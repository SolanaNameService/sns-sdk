import {
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetTokenLargestAccountsApi,
  Rpc,
  fetchEncodedAccount,
  fetchEncodedAccounts,
  getPublicKeyFromAddress,
} from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import {
  CouldNotFindNftOwnerError,
  DomainDoesNotExistError,
  InvalidRoAError,
  InvalidValidationError,
  PdaOwnerNotAllowedError,
  RecordMalformedError,
  UnsupportedTldError,
} from "../errors";
import { getSnsNftOwner } from "../nft/getSnsNftOwner";
import { getRecordV1Address } from "../record/getRecordV1Address";
import { getRecordV2Address } from "../record/getRecordV2Address";
import { NftState, NftTag } from "../states/nft";
import { RecordState } from "../states/record";
import { RegistryState } from "../states/registry";
import { Record } from "../types/record";
import { Validation } from "../types/validation";
import { checkAddressOnCurve } from "../utils/checkAddressOnCurve";
import { SNS_TLD, SOL_TLD, getTld } from "../utils/tld";
import { uint8ArrayToHex } from "../utils/uint8Array/uint8ArrayToHex";
import { uint8ArraysEqual } from "../utils/uint8Array/uint8ArraysEqual";
import { getDomainAddress } from "./getDomainAddress";

interface ResolveParams {
  rpc: Rpc<
    GetAccountInfoApi & GetMultipleAccountsApi & GetTokenLargestAccountsApi
  >;
  domain: string;
  options?: ResolveOptions;
}

type ResolveParamsWithOptions = Omit<ResolveParams, "options"> & {
  options: ResolveOptions;
};

export type ResolveOptions =
  | { allowPda: false; programIds?: never }
  | { allowPda: "any"; programIds?: never }
  | { allowPda: true; programIds: Address[] };

/**
 * Verifies the signature of a Solana record using Ed25519 cryptographic verification.
 *
 * @param data - The record data to verify.
 * @param signature - The signature associated with the record.
 * @param address - The address of the record's ownery.
 * @returns A promise that resolves to a boolean indicating whether the signature is valid.
 */
const verifySolRecordV1Signature = async ({
  data,
  signature,
  address,
}: {
  data: Uint8Array;
  signature: Uint8Array<ArrayBuffer>;
  address: Address;
}) => {
  const publicKey = await getPublicKeyFromAddress(address);

  // Convert `data` to a hex string and then back to a `Uint8Array`
  const encodedHexString = utf8Codec.encode(uint8ArrayToHex(data));

  const result = await crypto.subtle.verify(
    {
      name: "Ed25519",
    },
    publicKey,
    signature,
    encodedHexString
  );

  return result;
};

/**
 * Internal handler for `.sns` domains using SNS-IP 5 logic.
 */
const resolveSns = async ({
  rpc,
  domain,
  options,
}: ResolveParamsWithOptions): Promise<Address> => {
  const { domainAddress } = await getDomainAddress({ domain });
  const nftAddress = await NftState.getAddress(domainAddress);
  const solRecordV1Address = await getRecordV1Address({
    domain,
    record: Record.SOL,
  });
  const solRecordV2Address = await getRecordV2Address({
    domain,
    record: Record.SOL,
  });
  const [domainAccount, nftAccount, solRecordV1Account, solRecordV2Account] =
    await fetchEncodedAccounts(rpc, [
      domainAddress,
      nftAddress,
      solRecordV1Address,
      solRecordV2Address,
    ]);

  if (!domainAccount.exists) {
    throw new DomainDoesNotExistError(`Domain ${domain} does not exist`);
  }

  const registry = RegistryState.deserialize(domainAccount.data);

  // If NFT account exists, then the NFT owner is the domain owner
  if (nftAccount.exists) {
    const nftRecord = NftState.deserialize(nftAccount.data);
    if (nftRecord.tag === NftTag.ActiveRecord) {
      const nftOwner = await getSnsNftOwner({ rpc, domainAddress });
      if (!nftOwner) {
        throw new CouldNotFindNftOwnerError();
      }
      return nftOwner;
    }
  }

  // Check SOL record V2
  recordV2: if (solRecordV2Account.exists) {
    const recordV2 = RecordState.deserialize(solRecordV2Account.data);
    const stalenessId = recordV2.getStalenessId();
    const roaId = recordV2.getRoAId();
    const content = recordV2.getContent();

    if (content.length !== 32) {
      throw new RecordMalformedError("Record is malformed");
    }

    if (
      recordV2.header.rightOfAssociationValidation !== Validation.Solana ||
      recordV2.header.stalenessValidation !== Validation.Solana
    ) {
      throw new InvalidValidationError();
    }

    if (registry.owner !== addressCodec.decode(stalenessId)) {
      break recordV2;
    }

    if (uint8ArraysEqual(roaId, content)) {
      return addressCodec.decode(content);
    }

    throw new InvalidRoAError(
      `The RoA ID shoudl be ${addressCodec.decode(content)} but is ${addressCodec.decode(roaId)} `
    );
  }

  // Check SOL record V1
  if (solRecordV1Account.exists) {
    const data = new Uint8Array([
      ...solRecordV1Account.data.slice(
        RegistryState.HEADER_LEN,
        RegistryState.HEADER_LEN + 32
      ),
      ...addressCodec.encode(solRecordV1Address),
    ]);

    const signature = solRecordV1Account.data.slice(
      RegistryState.HEADER_LEN + 32,
      RegistryState.HEADER_LEN + 32 + 64
    );

    const valid = await verifySolRecordV1Signature({
      data,
      signature,
      address: registry.owner,
    });

    if (valid) {
      return addressCodec.decode(
        solRecordV1Account.data.slice(
          RegistryState.HEADER_LEN,
          RegistryState.HEADER_LEN + 32
        )
      );
    }
  }

  // Check if the registry owner is a PDA
  const isOnCurve = checkAddressOnCurve(registry.owner);

  if (!isOnCurve) {
    if (options.allowPda === "any") {
      return registry.owner;
    } else if (options.allowPda) {
      const ownerAccount = await fetchEncodedAccount(rpc, registry.owner);

      if (!ownerAccount.exists) {
        throw new PdaOwnerNotAllowedError("Invalid domain owner account");
      }

      const isAllowed = options.programIds?.some(
        (e) => ownerAccount.programAddress === e
      );

      if (isAllowed) {
        return registry.owner;
      }

      throw new PdaOwnerNotAllowedError(
        `The program ${ownerAccount.programAddress} is not allowed`
      );
    } else {
      throw new PdaOwnerNotAllowedError();
    }
  }

  return registry.owner;
};

/**
 * Internal handler for `.sol` domains.
 *
 * During migration, `.sol` remains an alias for `.sns` and routes through the
 * same SNS-IP 5 logic. This separate handler is kept so `.sol` resolution can
 * diverge later without changing the public API.
 */
const resolveSol = async (params: ResolveParamsWithOptions): Promise<Address> =>
  resolveSns(params);

/**
 * Resolves a .sns or .sol domain to its target address according to SNS-IP 5.
 *
 * @param params - An object containing the following properties:
 *   - `rpc`: An RPC interface implementing GetAccountInfoApi, GetMultipleAccountsApi, and GetTokenLargestAccountsApi.
 *   - `domain`: The full domain name to resolve, including a .sns or .sol suffix.
 *   - `config`: (Optional) Configuration for resolving the domain, including whether to allow PDA owners
 *     and permissible program IDs.
 * @returns A promise that resolves to the target address.
 */
export const resolve = async ({
  rpc,
  domain,
  options = { allowPda: false },
}: ResolveParams): Promise<Address> => {
  const tld = getTld(domain);

  if (!tld) {
    throw new UnsupportedTldError(
      `Domain "${domain}" is missing a supported TLD suffix (${SOL_TLD} or ${SNS_TLD})`
    );
  }

  const params = { rpc, domain, options };

  switch (tld) {
    case SNS_TLD:
      return resolveSns(params);
    case SOL_TLD:
      return resolveSol(params);
    default:
      throw new UnsupportedTldError(
        `Domain "${domain}" is missing a supported TLD suffix (${SOL_TLD} or ${SNS_TLD})`
      );
  }
};
