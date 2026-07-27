import sdk = require("@solana-name-service/sns-sdk-kit");
import address = require("@solana-name-service/sns-sdk-kit/address");
import bindings = require("@solana-name-service/sns-sdk-kit/bindings");
import codecs = require("@solana-name-service/sns-sdk-kit/codecs");
import constants = require("@solana-name-service/sns-sdk-kit/constants");
import domain = require("@solana-name-service/sns-sdk-kit/domain");
import errors = require("@solana-name-service/sns-sdk-kit/errors");
import instructions = require("@solana-name-service/sns-sdk-kit/instructions");
import nft = require("@solana-name-service/sns-sdk-kit/nft");
import record = require("@solana-name-service/sns-sdk-kit/record");
import states = require("@solana-name-service/sns-sdk-kit/states");
import types = require("@solana-name-service/sns-sdk-kit/types");
import utils = require("@solana-name-service/sns-sdk-kit/utils");

void [
  sdk.resolve,
  sdk.safeResolve,
  address.getPrimaryDomain,
  bindings.registerDomain,
  codecs.addressCodec,
  constants.NAME_PROGRAM_ADDRESS,
  domain.resolve,
  domain.safeResolve,
  errors.SNSError,
  instructions.TransferInstruction,
  nft.getSnsNftMint,
  record.getRecordV1Address,
  states.RegistryState,
  types.Record,
  utils.serializeRecordContent,
];
