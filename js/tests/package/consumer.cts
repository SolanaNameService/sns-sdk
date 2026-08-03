import address = require("@bonfida/spl-name-service/address");
import bindings = require("@bonfida/spl-name-service/bindings");
import constants = require("@bonfida/spl-name-service/constants");
import domain = require("@bonfida/spl-name-service/domain");
import errors = require("@bonfida/spl-name-service/errors");
import instructions = require("@bonfida/spl-name-service/instructions");
import nft = require("@bonfida/spl-name-service/nft");
import record = require("@bonfida/spl-name-service/record");
import root = require("@bonfida/spl-name-service");
import states = require("@bonfida/spl-name-service/states");
import twitter = require("@bonfida/spl-name-service/twitter");
import types = require("@bonfida/spl-name-service/types");
import utils = require("@bonfida/spl-name-service/utils");

void [
  address.getPrimaryDomain,
  bindings.burnDomain,
  constants.NAME_PROGRAM_ID,
  domain.resolve,
  domain.safeResolve,
  errors.SNSError,
  instructions.BurnInstruction,
  nft.getDomainMint,
  record.getMultipleRecords,
  root.getSnsDomainKeySync,
  root.safeResolve,
  states.NameRegistryState,
  twitter.getTwitterRegistryKey,
  types.CustomBg,
  utils.check,
];
