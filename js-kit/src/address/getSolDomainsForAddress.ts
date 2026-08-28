import {
  Address,
  Base58EncodedBytes,
  GetProgramAccountsApi,
  Rpc,
  getI64Decoder,
} from "@solana/kit";

import { base58Codec, base64Codec } from "../codecs";
import { SOL_SRS_CLASS, SRS_PROGRAM_ADDRESS } from "../constants/addresses";
import {
  SRS_EXPIRY_LENGTH,
  SRS_OWNER_TYPE_PUBKEY,
  SRS_RECORD_CLASS_OFFSET,
  SRS_RECORD_DISCRIMINATOR,
  SRS_RECORD_DISCRIMINATOR_OFFSET,
  SRS_RECORD_EXPIRY_OFFSET,
  SRS_RECORD_METADATA_OFFSET,
  SRS_RECORD_OWNER_OFFSET,
  SRS_RECORD_OWNER_TYPE_OFFSET,
} from "../constants/srs";
import { getMetadataSerializer } from "../srs/metadata";

/**
 * Parameters for retrieving directly owned SRS `.sol` domains.
 *
 * @example
 * ```ts
 * const params: GetSolDomainsForAddressParams = { rpc, address };
 * ```
 */
export interface GetSolDomainsForAddressParams {
  /** RPC client. */
  rpc: Rpc<GetProgramAccountsApi>;
  /** Wallet address whose directly owned records are retrieved. */
  address: Address;
}

/**
 * A directly wallet-owned SRS `.sol` domain.
 *
 * @example
 * ```ts
 * const domain: GetSolDomainsForAddressResult = {
 *   domain: "example",
 *   domainAddress,
 * };
 * ```
 */
export interface GetSolDomainsForAddressResult {
  /** TLD-trimmed `.sol` domain name. */
  domain: string;
  /** SRS record address. */
  domainAddress: Address;
}

const i64Decoder = getI64Decoder();

/**
 * Retrieves non-expired, directly wallet-owned top-level `.sol` domains.
 *
 * Tokenized records and malformed individual records are omitted. RPC
 * failures are propagated to the caller.
 *
 * @param params Domain retrieval parameters
 * @param params.rpc RPC client implementing program account lookup
 * @param params.address Address whose directly owned `.sol` domains are retrieved
 * @returns Non-expired direct-domain records with TLD-trimmed names and SRS record addresses.
 *
 * @example
 * ```ts
 * const domains = await getSolDomainsForAddress({ rpc, address });
 * ```
 */
export const getSolDomainsForAddress = async ({
  rpc,
  address,
}: GetSolDomainsForAddressParams): Promise<GetSolDomainsForAddressResult[]> => {
  const accounts = await rpc
    .getProgramAccounts(SRS_PROGRAM_ADDRESS, {
      encoding: "base64",
      filters: [
        {
          memcmp: {
            offset: BigInt(SRS_RECORD_DISCRIMINATOR_OFFSET),
            bytes: base58Codec.decode(
              Uint8Array.of(SRS_RECORD_DISCRIMINATOR)
            ) as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
        {
          memcmp: {
            offset: BigInt(SRS_RECORD_CLASS_OFFSET),
            bytes: SOL_SRS_CLASS as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
        {
          memcmp: {
            offset: BigInt(SRS_RECORD_OWNER_TYPE_OFFSET),
            bytes: base58Codec.decode(
              Uint8Array.of(SRS_OWNER_TYPE_PUBKEY)
            ) as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
        {
          memcmp: {
            offset: BigInt(SRS_RECORD_OWNER_OFFSET),
            bytes: address as string as Base58EncodedBytes,
            encoding: "base58",
          },
        },
      ],
    })
    .send();

  const now = BigInt(Math.floor(Date.now() / 1_000));
  const metadataSerializer = getMetadataSerializer();

  return accounts.flatMap(({ account, pubkey }) => {
    try {
      const data = base64Codec.encode(account.data[0]);
      if (data.length < SRS_RECORD_EXPIRY_OFFSET + SRS_EXPIRY_LENGTH) {
        return [];
      }

      const expiry = i64Decoder.decode(
        data.slice(SRS_RECORD_EXPIRY_OFFSET, SRS_RECORD_EXPIRY_OFFSET + 8)
      );
      if (expiry !== 0n && expiry <= now) {
        return [];
      }

      const [metadata] = metadataSerializer.deserialize(
        data.slice(SRS_RECORD_METADATA_OFFSET)
      );
      return [{ domain: metadata.name, domainAddress: pubkey }];
    } catch {
      return [];
    }
  });
};
