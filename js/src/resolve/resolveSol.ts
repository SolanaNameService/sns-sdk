import {
  TOKEN_2022_PROGRAM_ID,
  unpackAccount,
  unpackMint,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

import { SRS_PROGRAM_ID } from "../config";
import { SOL_SRS_CLASS } from "../constants";
import {
  CouldNotFindSrsOwner,
  DomainDoesNotExist,
  DomainExpired,
  PdaOwnerNotAllowed,
  RecordMalformed,
} from "../error";
import { getSrsDomainKeySync } from "../utils/getSrsDomainKeySync";

import type { ResolveConfig } from "./types";

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

const resolveSrsPubkeyOwner = async (
  connection: Connection,
  owner: PublicKey,
  config: ResolveConfig,
): Promise<PublicKey> => {
  if (PublicKey.isOnCurve(owner)) {
    return owner;
  }

  if (config.allowPda === "any") {
    return owner;
  }

  if (config.allowPda) {
    const ownerInfo = await connection.getAccountInfo(owner);
    const isAllowed = config.programIds.some((programId) =>
      ownerInfo?.owner.equals(programId),
    );

    if (isAllowed) {
      return owner;
    }

    throw new PdaOwnerNotAllowed(
      `The Program ${ownerInfo?.owner.toBase58()} is not allowed`,
    );
  }

  throw new PdaOwnerNotAllowed();
};

const resolveSrsTokenOwner = async (
  connection: Connection,
  record: PublicKey,
  mint: PublicKey,
  config: ResolveConfig,
): Promise<PublicKey> => {
  const [canonicalMint] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint"), record.toBuffer()],
    SRS_PROGRAM_ID,
  );

  if (!mint.equals(canonicalMint)) {
    throw new RecordMalformed("SRS record has a noncanonical token mint");
  }

  const mintInfo = await connection.getAccountInfo(mint);
  if (!mintInfo || !mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
    throw new CouldNotFindSrsOwner("SRS token mint is invalid");
  }

  let mintState;
  try {
    mintState = unpackMint(mint, mintInfo, TOKEN_2022_PROGRAM_ID);
  } catch {
    throw new CouldNotFindSrsOwner("SRS token mint is invalid");
  }

  if (
    !mintState.isInitialized ||
    mintState.decimals !== 0 ||
    mintState.supply !== BigInt(1)
  ) {
    throw new CouldNotFindSrsOwner("SRS token mint is invalid");
  }

  const largestAccounts = await connection.getTokenLargestAccounts(mint);
  const holders = largestAccounts.value.filter(({ amount }) => amount === "1");
  if (holders.length !== 1) {
    throw new CouldNotFindSrsOwner(
      "SRS token mint has no unique current holder",
    );
  }

  const holderAddress = holders[0].address;
  const holderInfo = await connection.getAccountInfo(holderAddress);
  if (!holderInfo || !holderInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
    throw new CouldNotFindSrsOwner("SRS token holder account is invalid");
  }

  let holderState;
  try {
    holderState = unpackAccount(
      holderAddress,
      holderInfo,
      TOKEN_2022_PROGRAM_ID,
    );
  } catch {
    throw new CouldNotFindSrsOwner("SRS token holder account is invalid");
  }

  if (
    !holderState.isInitialized ||
    !holderState.mint.equals(mint) ||
    holderState.amount !== BigInt(1)
  ) {
    throw new CouldNotFindSrsOwner("SRS token holder account is invalid");
  }

  return resolveSrsPubkeyOwner(connection, holderState.owner, config);
};

/** Resolves a TLD-trimmed `.sol` domain from its canonical SRS record. */
export const resolveSol = async (
  connection: Connection,
  domain: string,
  config: ResolveConfig,
): Promise<PublicKey> => {
  const { pubkey: record } = getSrsDomainKeySync(domain);
  const recordInfo = await connection.getAccountInfo(record);

  if (!recordInfo) {
    throw new DomainDoesNotExist(`Domain ${domain} does not exist`);
  }

  const { data } = recordInfo;
  if (
    !recordInfo.owner.equals(SRS_PROGRAM_ID) ||
    data.length < SRS_RECORD_HEADER_LENGTH ||
    data[SRS_RECORD_DISCRIMINATOR_OFFSET] !== SRS_RECORD_DISCRIMINATOR
  ) {
    throw new RecordMalformed("SRS record is malformed");
  }

  const recordClass = new PublicKey(
    data.subarray(
      SRS_RECORD_CLASS_OFFSET,
      SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH,
    ),
  );
  if (!recordClass.equals(SOL_SRS_CLASS)) {
    throw new RecordMalformed("SRS record has an invalid class");
  }

  const ownerType = data[SRS_RECORD_OWNER_TYPE_OFFSET];
  if (
    ownerType !== SRS_OWNER_TYPE_PUBKEY &&
    ownerType !== SRS_OWNER_TYPE_TOKEN
  ) {
    throw new RecordMalformed("SRS record has an invalid owner type");
  }

  const expiry = data.readBigInt64LE(SRS_RECORD_EXPIRY_OFFSET);
  if (expiry <= BigInt(Math.floor(Date.now() / 1_000))) {
    throw new DomainExpired(`Domain ${domain} has expired`);
  }

  const owner = new PublicKey(
    data.subarray(
      SRS_RECORD_OWNER_OFFSET,
      SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH,
    ),
  );
  if (ownerType === SRS_OWNER_TYPE_TOKEN) {
    return resolveSrsTokenOwner(connection, record, owner, config);
  }

  return resolveSrsPubkeyOwner(connection, owner, config);
};
