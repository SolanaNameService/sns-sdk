import { getPrimaryDomain } from "@bonfida/spl-name-service/address";
import { burnDomain } from "@bonfida/spl-name-service/bindings";
import { NAME_PROGRAM_ID } from "@bonfida/spl-name-service/constants";
import {
  resolve,
  safeResolve as safeResolveDomain,
} from "@bonfida/spl-name-service/domain";
import { SNSError } from "@bonfida/spl-name-service/errors";
import { BurnInstruction } from "@bonfida/spl-name-service/instructions";
import { getDomainMint } from "@bonfida/spl-name-service/nft";
import {
  getMultipleRecords,
  Record,
  type RecordResult,
} from "@bonfida/spl-name-service/record";
import { NameRegistryState } from "@bonfida/spl-name-service/states";
import { getTwitterRegistryKey } from "@bonfida/spl-name-service/twitter";
import { CustomBg } from "@bonfida/spl-name-service/types";
import { check } from "@bonfida/spl-name-service/utils";
import { getSnsDomainKeySync, safeResolve } from "@bonfida/spl-name-service";

declare const recordResult: RecordResult;

void [
  CustomBg,
  BurnInstruction,
  NAME_PROGRAM_ID,
  NameRegistryState,
  Record,
  SNSError,
  burnDomain,
  check,
  getDomainMint,
  getMultipleRecords,
  getPrimaryDomain,
  getSnsDomainKeySync,
  getTwitterRegistryKey,
  recordResult,
  resolve,
  safeResolve,
  safeResolveDomain,
];
