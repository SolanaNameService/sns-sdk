import address = require("@bonfida/spl-name-service-beta/address");
import bindings = require("@bonfida/spl-name-service-beta/bindings");
import constants = require("@bonfida/spl-name-service-beta/constants");
import domain = require("@bonfida/spl-name-service-beta/domain");
import errors = require("@bonfida/spl-name-service-beta/errors");
import instructions = require("@bonfida/spl-name-service-beta/instructions");
import nft = require("@bonfida/spl-name-service-beta/nft");
import record = require("@bonfida/spl-name-service-beta/record");
import root = require("@bonfida/spl-name-service-beta");
import states = require("@bonfida/spl-name-service-beta/states");
import twitter = require("@bonfida/spl-name-service-beta/twitter");
import types = require("@bonfida/spl-name-service-beta/types");
import utils = require("@bonfida/spl-name-service-beta/utils");

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
