import { Buffer } from "buffer";
import { base58 } from "@scure/base";
import {
  ExtensionType,
  getExtensionData,
  getTokenGroupMemberState,
  TOKEN_2022_PROGRAM_ID,
  unpackAccount,
  unpackMint,
} from "@solana/spl-token";
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from "@solana/web3.js";

import { SOL_SRS_CLASS, SRS_PROGRAM_ID } from "../constants";
import {
  SRS_ADDRESS_LENGTH,
  SRS_OWNER_TYPE_TOKEN,
  SRS_RECORD_CLASS_OFFSET,
  SRS_RECORD_DISCRIMINATOR,
  SRS_RECORD_EXPIRY_OFFSET,
  SRS_RECORD_HEADER_LENGTH,
  SRS_RECORD_OWNER_OFFSET,
  SRS_RECORD_OWNER_TYPE_OFFSET,
} from "../srs/constants";
import { getMetadataSerializer } from "../srs/metadata";
import { getMultipleAccountsInfoBatched } from "./getMultipleAccountsInfoBatched";
import { getSolDomainKeySync } from "./getSolDomainKeySync";

/**
 * A tokenized `.sol` domain and its associated NFT mint.
 *
 * @example
 * ```ts
 * const nft: SolNft = {
 *   domain: "example",
 *   key: nameAccount,
 *   mint: nftMint,
 * };
 * ```
 */
export interface SolNft {
  /** TLD-trimmed `.sol` domain name. */
  domain: string;
  /** SRS record account address for `domain`. */
  key: PublicKey;
  /** NFT mint that tokenizes `domain`. */
  mint: PublicKey;
}

const TOKEN_AMOUNT_ONE = base58.encode(Uint8Array.of(1, 0, 0, 0, 0, 0, 0, 0));
const TOKEN_ACCOUNT_DATA_LENGTH = 166;
const TOKEN_METADATA_CONTENT_OFFSET = 64;

/**
 * Retrieves tokenized `.sol` domains owned by a wallet, excluding expired
 * domains.
 *
 * @param connection Solana RPC connection
 * @param owner Owner of the tokenized domains
 * @returns Tokenized domain records containing the TLD-trimmed domain name, its
 * SRS record public key, and NFT mint public key
 *
 * @example
 * ```ts
 * const domains = await getSolNftsForOwner(connection, wallet);
 * ```
 */
export const getSolNftsForOwner = async (
  connection: Connection,
  owner: PublicKey,
): Promise<SolNft[]> => {
  const filters: GetProgramAccountsFilter[] = [
    {
      memcmp: {
        offset: 32,
        bytes: owner.toBase58(),
      },
    },
    { memcmp: { offset: 64, bytes: TOKEN_AMOUNT_ONE } },
  ];

  // Base account data plus the Token-2022 account-type byte.
  // Enough for unpackAccount() to distinguish accounts from mints.
  const dataSlice = {
    offset: 0,
    length: TOKEN_ACCOUNT_DATA_LENGTH,
  };

  const result = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
    filters,
    dataSlice,
  });

  const tokenAccs = result.flatMap(({ pubkey, account }) => {
    try {
      return [unpackAccount(pubkey, account, TOKEN_2022_PROGRAM_ID)];
    } catch {
      // Reject mints, malformed accounts, and invalid account-type markers.
      return [];
    }
  });

  const mintAddresses = tokenAccs.map(({ mint }) => mint);
  const mintInfos = await getMultipleAccountsInfoBatched(
    connection,
    mintAddresses,
  );
  const [solGroup] = PublicKey.findProgramAddressSync(
    [Buffer.from("group"), SOL_SRS_CLASS.toBuffer()],
    SRS_PROGRAM_ID,
  );
  const metadataSerializer = getMetadataSerializer();

  const candidates = tokenAccs.flatMap((tokenAccount, index) => {
    const mintInfo = mintInfos[index];

    if (!mintInfo) {
      return [];
    }

    try {
      const mint = unpackMint(
        tokenAccount.mint,
        mintInfo,
        TOKEN_2022_PROGRAM_ID,
      );
      if (
        !mint.isInitialized ||
        mint.decimals !== 0 ||
        mint.supply !== BigInt(1)
      ) {
        return [];
      }

      const member = getTokenGroupMemberState(mint);

      if (
        !member?.mint?.equals(tokenAccount.mint) ||
        !member.group?.equals(solGroup)
      ) {
        return [];
      }

      const metadataData = getExtensionData(
        ExtensionType.TokenMetadata,
        mint.tlvData,
      );

      if (!metadataData) {
        return [];
      }

      const [metadata] = metadataSerializer.deserialize(
        metadataData.subarray(TOKEN_METADATA_CONTENT_OFFSET),
      );
      const { pubkey } = getSolDomainKeySync(metadata.name);
      const [canonicalMint] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), pubkey.toBuffer()],
        SRS_PROGRAM_ID,
      );

      return canonicalMint.equals(tokenAccount.mint)
        ? [{ domain: metadata.name, key: pubkey, mint: tokenAccount.mint }]
        : [];
    } catch {
      return [];
    }
  });

  const recordInfos = await getMultipleAccountsInfoBatched(
    connection,
    candidates.map(({ key }) => key),
  );
  const now = BigInt(Math.floor(Date.now() / 1_000));

  return candidates.filter((candidate, index) => {
    const recordInfo = recordInfos[index];

    if (!recordInfo || !recordInfo.owner.equals(SRS_PROGRAM_ID)) {
      return false;
    }

    try {
      const { data } = recordInfo;
      // Confirm this is a valid SRS token-owned record for the candidate mint.
      if (
        data.length < SRS_RECORD_HEADER_LENGTH ||
        data[0] !== SRS_RECORD_DISCRIMINATOR ||
        data[SRS_RECORD_OWNER_TYPE_OFFSET] !== SRS_OWNER_TYPE_TOKEN ||
        !new PublicKey(
          data.subarray(
            SRS_RECORD_CLASS_OFFSET,
            SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH,
          ),
        ).equals(SOL_SRS_CLASS) ||
        !new PublicKey(
          data.subarray(
            SRS_RECORD_OWNER_OFFSET,
            SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH,
          ),
        ).equals(candidate.mint)
      ) {
        return false;
      }

      const expiry = data.readBigInt64LE(SRS_RECORD_EXPIRY_OFFSET);
      return expiry === BigInt(0) || expiry > now;
    } catch {
      return false;
    }
  });
};
