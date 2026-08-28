import {
  Address,
  Base58EncodedBytes,
  GetProgramAccountsApi,
  Rpc,
} from "@solana/kit";

import { addressCodec, base58Codec, base64Codec } from "../codecs";
import { SOL_SRS_CLASS, SRS_PROGRAM_ADDRESS } from "../constants/addresses";
import {
  SRS_ADDRESS_LENGTH,
  SRS_RECORD_CLASS_OFFSET,
  SRS_RECORD_DISCRIMINATOR,
  SRS_RECORD_DISCRIMINATOR_OFFSET,
  SRS_RECORD_OWNER_OFFSET,
} from "../constants/srs";

/**
 * Parameters for retrieving all SRS `.sol` domains.
 *
 * @example
 * ```ts
 * const params: GetAllSolDomainsParams = { rpc };
 * ```
 */
export interface GetAllSolDomainsParams {
  /** RPC client. */
  rpc: Rpc<GetProgramAccountsApi>;
}

/**
 * A top-level SRS `.sol` domain record.
 *
 * @example
 * ```ts
 * const domain: GetAllSolDomainsResult = { domainAddress, owner };
 * ```
 */
export interface GetAllSolDomainsResult {
  /** SRS record address. */
  domainAddress: Address;
  /** Raw SRS owner, either a wallet address or Token-2022 mint. */
  owner: Address;
}

/**
 * Retrieves all registered top-level `.sol` SRS records, including expired
 * records.
 *
 * The returned owner is the raw SRS owner field. It is a wallet address for a
 * directly owned record and a Token-2022 mint for a tokenized record.
 *
 * @param params Domain retrieval parameters
 * @param params.rpc RPC client implementing program account lookup
 * @returns All top-level SRS records with their addresses and raw owners, including expired records.
 *
 * @example
 * ```ts
 * const domains = await getAllSolDomains({ rpc });
 * ```
 */
export const getAllSolDomains = async ({
  rpc,
}: GetAllSolDomainsParams): Promise<GetAllSolDomainsResult[]> => {
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
      ],
      dataSlice: {
        offset: SRS_RECORD_OWNER_OFFSET,
        length: SRS_ADDRESS_LENGTH,
      },
    })
    .send();

  return accounts.map(({ account: { data }, pubkey }) => ({
    domainAddress: pubkey,
    owner: addressCodec.decode(base64Codec.encode(data[0])),
  }));
};
