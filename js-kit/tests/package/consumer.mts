import { resolve, safeResolve } from "@solana-name-service/sns-sdk-kit";
import { getPrimaryDomain } from "@solana-name-service/sns-sdk-kit/address";
import { registerDomain } from "@solana-name-service/sns-sdk-kit/bindings";
import { addressCodec } from "@solana-name-service/sns-sdk-kit/codecs";
import { NAME_PROGRAM_ADDRESS } from "@solana-name-service/sns-sdk-kit/constants";
import {
  resolve as resolveDomain,
  safeResolve as safeResolveDomain,
} from "@solana-name-service/sns-sdk-kit/domain";
import { SNSError } from "@solana-name-service/sns-sdk-kit/errors";
import { TransferInstruction } from "@solana-name-service/sns-sdk-kit/instructions";
import { getSnsNftMint } from "@solana-name-service/sns-sdk-kit/nft";
import { getRecordV1Address } from "@solana-name-service/sns-sdk-kit/record";
import { RegistryState } from "@solana-name-service/sns-sdk-kit/states";
import { Record } from "@solana-name-service/sns-sdk-kit/types";
import { serializeRecordContent } from "@solana-name-service/sns-sdk-kit/utils";

void [
  resolve,
  safeResolve,
  getPrimaryDomain,
  registerDomain,
  addressCodec,
  NAME_PROGRAM_ADDRESS,
  resolveDomain,
  safeResolveDomain,
  SNSError,
  TransferInstruction,
  getSnsNftMint,
  getRecordV1Address,
  RegistryState,
  Record,
  serializeRecordContent,
];
