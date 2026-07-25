import {
  Address,
  fetchEncodedAccount,
  fetchEncodedAccounts,
  getPublicKeyFromAddress,
} from "@solana/kit";

import { addressCodec, utf8Codec } from "../codecs";
import {
  CouldNotFindNftOwnerError,
  DomainDoesNotExistError,
  InvalidRoaError,
  InvalidValidationError,
  PdaOwnerNotAllowedError,
  RecordMalformedError,
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
import { uint8ArrayToHex } from "../utils/uint8Array/uint8ArrayToHex";
import { uint8ArraysEqual } from "../utils/uint8Array/uint8ArraysEqual";
import { getSnsDomainAddress } from "./getSnsDomainAddress";
import { ResolveSnsParams } from "./resolveTypes";

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
  const encodedHexString = utf8Codec.encode(uint8ArrayToHex(data));

  return crypto.subtle.verify(
    { name: "Ed25519" },
    publicKey,
    signature,
    encodedHexString
  );
};

/** Resolves a TLD-trimmed SNS name using SNS-IP 5 behavior. */
export const resolveSns = async ({
  rpc,
  domain,
  options,
}: ResolveSnsParams): Promise<Address> => {
  const { domainAddress } = await getSnsDomainAddress({ domain });
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

    throw new InvalidRoaError(
      `The RoA ID should be ${addressCodec.decode(content)} but is ${addressCodec.decode(roaId)} `
    );
  }

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

  if (!checkAddressOnCurve(registry.owner)) {
    if (options.allowPda === "any") {
      return registry.owner;
    }

    if (options.allowPda) {
      const ownerAccount = await fetchEncodedAccount(rpc, registry.owner);

      if (!ownerAccount.exists) {
        throw new PdaOwnerNotAllowedError("Invalid domain owner account");
      }

      if (
        options.programIds.some(
          (programId) => ownerAccount.programAddress === programId
        )
      ) {
        return registry.owner;
      }

      throw new PdaOwnerNotAllowedError(
        `The program ${ownerAccount.programAddress} is not allowed`
      );
    }

    throw new PdaOwnerNotAllowedError();
  }

  return registry.owner;
};
