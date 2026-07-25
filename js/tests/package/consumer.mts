import { getPrimaryDomain } from "@bonfida/spl-name-service-beta/address";
import { burnDomain } from "@bonfida/spl-name-service-beta/bindings";
import { NAME_PROGRAM_ID } from "@bonfida/spl-name-service-beta/constants";
import { resolve } from "@bonfida/spl-name-service-beta/domain";
import { SNSError } from "@bonfida/spl-name-service-beta/errors";
import { BurnInstruction } from "@bonfida/spl-name-service-beta/instructions";
import { getDomainMint } from "@bonfida/spl-name-service-beta/nft";
import {
  getMultipleRecords,
  Record,
  type RecordResult,
} from "@bonfida/spl-name-service-beta/record";
import { NameRegistryState } from "@bonfida/spl-name-service-beta/states";
import { getTwitterRegistryKey } from "@bonfida/spl-name-service-beta/twitter";
import { CustomBg } from "@bonfida/spl-name-service-beta/types";
import { check } from "@bonfida/spl-name-service-beta/utils";
import { getSnsDomainKeySync } from "@bonfida/spl-name-service-beta";

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
];
