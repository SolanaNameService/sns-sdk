import {
  Address,
  Base58EncodedBytes,
  GetMultipleAccountsApi,
  GetProgramAccountsApi,
  Rpc,
  getI64Decoder,
  getProgramDerivedAddress,
} from "@solana/kit";

import { addressCodec, base58Codec, base64Codec, utf8Codec } from "../codecs";
import {
  SOL_SRS_CLASS,
  SRS_PROGRAM_ADDRESS,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "../constants/addresses";
import {
  SRS_ADDRESS_LENGTH,
  SRS_OWNER_TYPE_TOKEN,
  SRS_RECORD_CLASS_OFFSET,
  SRS_RECORD_DISCRIMINATOR,
  SRS_RECORD_DISCRIMINATOR_OFFSET,
  SRS_RECORD_EXPIRY_OFFSET,
  SRS_RECORD_HEADER_LENGTH,
  SRS_RECORD_OWNER_OFFSET,
  SRS_RECORD_OWNER_TYPE_OFFSET,
} from "../constants/srs";
import { getSolDomainAddress } from "../domain/getSolDomainAddress";
import { getMetadataSerializer } from "../srs/metadata";
import { fetchEncodedAccountsBatched } from "../utils/fetchEncodedAccountsBatched";
import {
  getTokenGroupMember,
  getTokenMetadataExtension,
  unpackAccount,
  unpackMint,
} from "../utils/token2022";

/**
 * Parameters for retrieving tokenized SRS `.sol` domains.
 *
 * @example
 * ```ts
 * const params: GetSolNftsForAddressParams = { rpc, address };
 * ```
 */
export interface GetSolNftsForAddressParams {
  /** RPC client implementing program-account and multiple-account lookup APIs. */
  rpc: Rpc<GetProgramAccountsApi & GetMultipleAccountsApi>;
  /** Wallet address holding the tokenized domains. */
  address: Address;
}

/**
 * A tokenized `.sol` domain and its associated NFT mint.
 *
 * @example
 * ```ts
 * const domain: GetSolNftsForAddressResult = {
 *   domain: "example",
 *   domainAddress,
 *   mint,
 * };
 * ```
 */
export interface GetSolNftsForAddressResult {
  /** TLD-trimmed `.sol` domain name. */
  domain: string;
  /** SRS record address. */
  domainAddress: Address;
  /** Token-2022 mint address. */
  mint: Address;
}

const TOKEN_AMOUNT_ONE = base58Codec.decode(
  Uint8Array.of(1, 0, 0, 0, 0, 0, 0, 0)
) as string as Base58EncodedBytes;
const TOKEN_ACCOUNT_DATA_LENGTH = 166;
const i64Decoder = getI64Decoder();

type TokenAccountCandidate = { mint: Address };
type SolNftCandidate = GetSolNftsForAddressResult;

/**
 * Retrieves non-expired tokenized `.sol` domains held by an address.
 *
 * Malformed or nonmatching candidates are skipped, while RPC failures
 * propagate to the caller.
 *
 * @param params Tokenized-domain retrieval parameters
 * @param params.rpc RPC client implementing program-account and multiple-account lookup APIs
 * @param params.address Address holding the tokenized `.sol` domains
 * @returns Non-expired tokenized-domain records with TLD-trimmed names, SRS record addresses, and mint addresses.
 *
 * @example
 * ```ts
 * const domains = await getSolNftsForAddress({ rpc, address });
 * ```
 */
export const getSolNftsForAddress = async ({
  rpc,
  address,
}: GetSolNftsForAddressParams): Promise<GetSolNftsForAddressResult[]> => {
  const tokenAccounts = await rpc
    .getProgramAccounts(TOKEN_2022_PROGRAM_ADDRESS, {
      encoding: "base64",
      filters: [
        {
          memcmp: {
            offset: 32n,
            bytes: address as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
        {
          memcmp: {
            offset: 64n,
            bytes: TOKEN_AMOUNT_ONE,
            encoding: "base58",
          },
        },
      ],
      dataSlice: { offset: 0, length: TOKEN_ACCOUNT_DATA_LENGTH },
    })
    .send();

  const candidates: TokenAccountCandidate[] = tokenAccounts.flatMap(
    ({ account }) => {
      try {
        const data = base64Codec.encode(account.data[0]);
        return [{ mint: unpackAccount(data).mint }];
      } catch {
        return [];
      }
    }
  );

  const mintAccounts = await fetchEncodedAccountsBatched(
    rpc,
    candidates.map(({ mint }) => mint)
  );
  const [solGroup] = await getProgramDerivedAddress({
    programAddress: SRS_PROGRAM_ADDRESS,
    seeds: [utf8Codec.encode("group"), addressCodec.encode(SOL_SRS_CLASS)],
  });
  const metadataSerializer = getMetadataSerializer();

  const solNftCandidates: SolNftCandidate[] = (
    await Promise.all(
      candidates.map(async ({ mint }, index) => {
        const mintAccount = mintAccounts[index];
        if (!mintAccount.exists) {
          return [];
        }

        try {
          if (mintAccount.programAddress !== TOKEN_2022_PROGRAM_ADDRESS) {
            return [];
          }

          const mintData = mintAccount.data;
          const mintState = unpackMint(mintData);
          if (
            !mintState.isInitialized ||
            mintState.decimals !== 0 ||
            mintState.supply !== 1n
          ) {
            return [];
          }

          const member = getTokenGroupMember(mintData);
          if (!member || member.mint !== mint || member.group !== solGroup) {
            return [];
          }

          const metadataExtension = getTokenMetadataExtension(mintData);
          if (!metadataExtension) {
            return [];
          }
          const [metadata] = metadataSerializer.deserialize(
            metadataExtension.subarray(64)
          );
          const { domainAddress } = await getSolDomainAddress({
            domain: metadata.name,
          });
          const [canonicalMint] = await getProgramDerivedAddress({
            programAddress: SRS_PROGRAM_ADDRESS,
            seeds: [
              utf8Codec.encode("mint"),
              addressCodec.encode(domainAddress),
            ],
          });

          return canonicalMint === mint
            ? [{ domain: metadata.name, domainAddress, mint }]
            : [];
        } catch {
          return [];
        }
      })
    )
  ).flat();

  const recordAccounts = await fetchEncodedAccountsBatched(
    rpc,
    solNftCandidates.map(({ domainAddress }) => domainAddress)
  );
  const now = BigInt(Math.floor(Date.now() / 1_000));

  return solNftCandidates.filter((candidate, index) => {
    const recordAccount = recordAccounts[index];
    if (!recordAccount?.exists) {
      return false;
    }

    try {
      const { data } = recordAccount;
      // Confirm this is a valid SRS token-owned record for the candidate mint.
      if (
        recordAccount.programAddress !== SRS_PROGRAM_ADDRESS ||
        data.length < SRS_RECORD_HEADER_LENGTH ||
        data[SRS_RECORD_DISCRIMINATOR_OFFSET] !== SRS_RECORD_DISCRIMINATOR ||
        data[SRS_RECORD_OWNER_TYPE_OFFSET] !== SRS_OWNER_TYPE_TOKEN ||
        addressCodec.decode(
          data.slice(
            SRS_RECORD_CLASS_OFFSET,
            SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH
          )
        ) !== SOL_SRS_CLASS ||
        addressCodec.decode(
          data.slice(
            SRS_RECORD_OWNER_OFFSET,
            SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH
          )
        ) !== candidate.mint
      ) {
        return false;
      }

      const expiry = i64Decoder.decode(
        data.slice(SRS_RECORD_EXPIRY_OFFSET, SRS_RECORD_EXPIRY_OFFSET + 8)
      );
      return expiry === 0n || expiry > now;
    } catch {
      return false;
    }
  });
};
