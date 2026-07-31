import { Address, fetchEncodedAccount, getI64Decoder } from "@solana/kit";

import { addressCodec } from "../codecs";
import { SRS_PROGRAM_ADDRESS } from "../config";
import { SOL_SRS_CLASS } from "../constants/addresses";
import {
  CouldNotFindSrsOwnerError,
  DomainDoesNotExistError,
  DomainExpiredError,
  PdaOwnerNotAllowedError,
  RecordMalformedError,
} from "../errors";
import { checkAddressOnCurve } from "../utils/checkAddressOnCurve";
import { getSrsDomainAddress } from "./getSrsDomainAddress";
import { ResolveSolParams } from "./resolveTypes";

const SRS_RECORD_DISCRIMINATOR = 2;
const SRS_OWNER_TYPE_PUBKEY = 0;
const SRS_OWNER_TYPE_TOKEN = 1;
const SRS_ADDRESS_LENGTH = 32;
const SRS_EXPIRY_LENGTH = 8;
const SRS_RECORD_DISCRIMINATOR_OFFSET = 0;
const SRS_RECORD_CLASS_OFFSET = SRS_RECORD_DISCRIMINATOR_OFFSET + 1;
const SRS_RECORD_OWNER_TYPE_OFFSET =
  SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH;
const SRS_RECORD_OWNER_OFFSET = SRS_RECORD_OWNER_TYPE_OFFSET + 1;
const SRS_RECORD_FROZEN_OFFSET = SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH;
const SRS_RECORD_EXPIRY_OFFSET = SRS_RECORD_FROZEN_OFFSET + 1;
const SRS_RECORD_HEADER_LENGTH = SRS_RECORD_EXPIRY_OFFSET + SRS_EXPIRY_LENGTH;
const i64Decoder = getI64Decoder();

const resolveSrsPubkeyOwner = async ({
  rpc,
  owner,
  options,
}: Pick<ResolveSolParams, "rpc" | "options"> & {
  owner: Address;
}): Promise<Address> => {
  if (checkAddressOnCurve(owner)) {
    return owner;
  }

  if (options.allowPda === "any") {
    return owner;
  }

  if (!options.allowPda) {
    throw new PdaOwnerNotAllowedError();
  }

  const ownerAccount = await fetchEncodedAccount(rpc, owner);
  if (!ownerAccount.exists) {
    throw new PdaOwnerNotAllowedError("Invalid domain owner account");
  }

  if (
    options.programIds.some(
      (programId) => ownerAccount.programAddress === programId
    )
  ) {
    return owner;
  }

  throw new PdaOwnerNotAllowedError(
    `The program ${ownerAccount.programAddress} is not allowed`
  );
};

/** Resolves a TLD-trimmed `.sol` name from its canonical SRS record. */
export const resolveSol = async ({
  rpc,
  domain,
  options,
}: ResolveSolParams): Promise<Address> => {
  const { domainAddress } = await getSrsDomainAddress({ domain });
  const account = await fetchEncodedAccount(rpc, domainAddress);

  if (!account.exists) {
    throw new DomainDoesNotExistError(`Domain ${domain} does not exist`);
  }

  const { data } = account;
  if (
    account.programAddress !== SRS_PROGRAM_ADDRESS ||
    data.length < SRS_RECORD_HEADER_LENGTH ||
    data[SRS_RECORD_DISCRIMINATOR_OFFSET] !== SRS_RECORD_DISCRIMINATOR
  ) {
    throw new RecordMalformedError("SRS record is malformed");
  }

  if (
    addressCodec.decode(
      data.slice(
        SRS_RECORD_CLASS_OFFSET,
        SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH
      )
    ) !== SOL_SRS_CLASS
  ) {
    throw new RecordMalformedError("SRS record has an invalid class");
  }

  const ownerType = data[SRS_RECORD_OWNER_TYPE_OFFSET];
  if (
    ownerType !== SRS_OWNER_TYPE_PUBKEY &&
    ownerType !== SRS_OWNER_TYPE_TOKEN
  ) {
    throw new RecordMalformedError("SRS record has an invalid owner type");
  }

  const expiry = i64Decoder.decode(
    data.slice(
      SRS_RECORD_EXPIRY_OFFSET,
      SRS_RECORD_EXPIRY_OFFSET + SRS_EXPIRY_LENGTH
    )
  );
  // Zero is the SRS sentinel for a record that does not expire.
  if (expiry !== 0n && expiry <= BigInt(Math.floor(Date.now() / 1_000))) {
    throw new DomainExpiredError(`Domain ${domain} has expired`);
  }

  const owner = addressCodec.decode(
    data.slice(
      SRS_RECORD_OWNER_OFFSET,
      SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH
    )
  );
  if (ownerType === SRS_OWNER_TYPE_TOKEN) {
    throw new CouldNotFindSrsOwnerError(
      "Tokenized SRS owners are not supported yet"
    );
  }

  return resolveSrsPubkeyOwner({ rpc, owner, options });
};
