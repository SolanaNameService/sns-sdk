import { Buffer } from "buffer";

import {
  allocateAndPostRecordInstruction,
  deleteRecordInstruction,
  editRecordInstruction,
  validateSolanaSignatureInstruction,
  writeRoaInstruction,
} from "@bonfida/sns-records";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

import { PYTH_PULL_FEEDS } from "./constants";
import {
  InvalidInputError,
  InvalidParentError,
  NoAccountDataError,
  PythFeedNotFoundError,
} from "./error";
import { PrimaryDomain } from "./primary-domain";
import { BurnInstruction } from "./instructions/burnInstruction";
import { createInstruction } from "./instructions/createInstruction";
import { CreateReverseInstruction } from "./instructions/createReverseInstruction";
import { CreateSplitV2Instruction } from "./instructions/createSplitV2Instruction";
import { deleteInstruction } from "./instructions/deleteInstruction";
import { SetPrimaryInstruction } from "./instructions/setPrimaryInstruction";
import { transferInstruction } from "./instructions/transferInstruction";
import { updateInstruction } from "./instructions/updateInstruction";
import { Numberu32, Numberu64 } from "./int";
import { serializeRecordContent } from "./record/serializeRecordContent";
import { NameRegistryState } from "./state";
import { Record, RecordVersion } from "./types/record";
import {
  _parseSnsDomain,
  _parseSnsSubdomain,
  _parseSnsTopLevelDomain,
} from "./utils/parseSnsDomain";
import { deserializeReverse } from "./utils/deserializeReverse";
import { getHashedNameSync } from "./utils/getHashedNameSync";
import { getPythFeedAccountKey } from "./utils/getPythFeedAccountKey";
import { parseSupportedTld, SOL_TLD } from "./utils/tld";

const constants = {
  /**
   * The Solana Name Service program ID
   */
  NAME_PROGRAM_ID: new PublicKey("namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX"),

  /**
   * Hash prefix used to derive domain name addresses
   */
  HASH_PREFIX: "SPL Name Service",

  /**
   * The `.sns` TLD
   */
  SNS_ROOT_DOMAIN_ACCOUNT: new PublicKey(
    "5eoDkP6vCQBXqDV9YN2NdUs3nmML3dMRNmEYpiyVNBm2",
  ),

  /**
   * The Registry program ID
   */
  REGISTER_PROGRAM_ID: new PublicKey(
    "snshBoEQ9jx4QoHBpZDQPYdNCtw7RMxJvYrKFEhwaPJ",
  ),

  NAME_OFFERS_ID: new PublicKey("zugu92jR3kqgFiNEJywq7gbbc9NbaLmHLiQhsZRwd6J"),

  SNS_RECORDS_ID: new PublicKey("Ga872GkshNeNMDag7m1Bn54dN3NiHksfqnN2pH6A1H9F"),

  CENTRAL_STATE_SNS_RECORDS: new PublicKey(
    "9Wo9amAUKvrHXSSwg9HXY28miHH3sh2TQhxNgYiewkpg",
  ),

  /**
   * The reverse look up class
   */
  REVERSE_LOOKUP_CLASS: new PublicKey(
    "7NbD1vprif6apthEZAqhRfYuhrqnuderB8qpnfXGCc8H",
  ),

  USDC_MINT: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),

  REFERRERS: [
    new PublicKey("3ogYncmMM5CmytsGCqKHydmXmKUZ6sGWvizkzqwT7zb1"), // Test wallet,
  ],

  TOKENS_SYM_MINT: new Map<string, string>([
    ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", "USDC"],
    ["EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS", "USDT"],
    ["So11111111111111111111111111111111111111112", "SOL"],
    ["fidaWCioBQjieRrUQDxxS5Uxmq1CLi2VuVRyv4dEBey", "FIDA"],
    ["DL4ivZm3NVHWk9ZvtcqTchxoKArDK4rT3vbDx2gYVr7P", "INJ"],
  ]),

  PYTH_FEEDS: new Map<string, { price: string; product: string }>([
    [
      "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
      {
        price: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
        product: "6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA",
      },
    ],
    [
      "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS",
      {
        price: "38xoQ4oeJCBrcVvca2cGk7iV1dAfrmTR1kmhSCJQ8Jto",
        product: "C5wDxND9E61RZ1wZhaSTWkoA8udumaHnoQY6BBsiaVpn",
      },
    ],
    [
      "So11111111111111111111111111111111111111112",
      {
        price: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
        product: "3Mnn2fX6rQyUsyELYms1sBJyChWofzSNRoqYzvgMVz5E",
      },
    ],
    [
      "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
      {
        price: "7teETxN9Y8VK6uJxsctHEwST75mKLLwPH1jaFdvTQCpD",
        product: "5kWV4bhHeZANzg5MWaYCQYEEKHjur5uz1mu5vuLHwiLB",
      },
    ],
    [
      "DL4ivZm3NVHWk9ZvtcqTchxoKArDK4rT3vbDx2gYVr7P",
      {
        price: "44uRsNnT35kjkscSu59MxRr9CfkLZWf6gny8bWqUbVxE",
        product: "7UHB783Nh4avW3Yw9yoktf2KjxipU56KPahA51RnCCYE",
      },
    ],
  ]),

  PYTH_MAPPING_ACC: new PublicKey(
    "BmA9Z6FjioHJPpjT39QazZyhDRUdZy2ezwx4GiDdE2u2",
  ),

  VAULT_OWNER: new PublicKey("SNSaTJbEv2iT3CUrCQYa9zpGjbBVWhFCPaSJHkaJX34"),
};

const getNameAccountKeySync = (
  hashed_name: Buffer,
  nameClass?: PublicKey,
  nameParent?: PublicKey,
): PublicKey => {
  const seeds = [hashed_name];
  if (nameClass) {
    seeds.push(nameClass.toBuffer());
  } else {
    seeds.push(Buffer.alloc(32));
  }
  if (nameParent) {
    seeds.push(nameParent.toBuffer());
  } else {
    seeds.push(Buffer.alloc(32));
  }
  const [nameAccountKey] = PublicKey.findProgramAddressSync(
    seeds,
    constants.NAME_PROGRAM_ID,
  );
  return nameAccountKey;
};

const reverseLookup = async (
  connection: Connection,
  nameAccount: PublicKey,
  parent?: PublicKey,
): Promise<string> => {
  const hashedReverseLookup = getHashedNameSync(nameAccount.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    constants.REVERSE_LOOKUP_CLASS,
    parent,
  );

  const { registry } = await NameRegistryState.retrieve(
    connection,
    reverseLookupAccount,
  );
  if (!registry.data) {
    throw new NoAccountDataError("The registry data is empty");
  }
  return deserializeReverse(registry.data, !!parent);
};

const _deriveSync = (
  name: string,
  parent: PublicKey = constants.SNS_ROOT_DOMAIN_ACCOUNT,
  classKey?: PublicKey,
) => {
  let hashed = getHashedNameSync(name);
  let pubkey = getNameAccountKeySync(hashed, classKey, parent);
  return { pubkey, hashed };
};

const getSnsDomainKeySync = (domain: string, record?: RecordVersion) => {
  const recordClass =
    record === RecordVersion.V2
      ? constants.CENTRAL_STATE_SNS_RECORDS
      : undefined;
  const splitted = domain.split(".");
  if (splitted.length === 2) {
    const prefix = Buffer.from([record ? record : 0]).toString();
    const sub = prefix.concat(splitted[0]);
    const { pubkey: parentKey } = _deriveSync(splitted[1]);
    const result = _deriveSync(sub, parentKey, recordClass);
    return { ...result, isSub: true, parent: parentKey };
  } else if (splitted.length === 3 && !!record) {
    // Parent key
    const { pubkey: parentKey } = _deriveSync(splitted[2]);
    // Sub domain
    const { pubkey: subKey } = _deriveSync("\0".concat(splitted[1]), parentKey);
    // Sub record
    const recordPrefix = record === RecordVersion.V2 ? `\x02` : `\x01`;
    const result = _deriveSync(
      recordPrefix.concat(splitted[0]),
      subKey,
      recordClass,
    );
    return { ...result, isSub: true, parent: parentKey, isSubRecord: true };
  } else if (splitted.length >= 3) {
    throw new InvalidInputError("The domain is malformed");
  }
  const result = _deriveSync(domain, constants.SNS_ROOT_DOMAIN_ACCOUNT);
  return { ...result, isSub: false, parent: undefined };
};

const getSolDomainKeySync = (
  _domain: string,
  _record?: RecordVersion,
): ReturnType<typeof getSnsDomainKeySync> => {
  throw new Error("getSolDomainKeySync is not yet implemented");
};

void getSolDomainKeySync;

const getDomainKeySync = (domain: string, record?: RecordVersion) => {
  const [trimmedDomain, tld] = parseSupportedTld(domain);

  if (tld === SOL_TLD) {
    // Both .sol and .sns currently use SNS derivation for compatibility.
    // Switch this branch to getSolDomainKeySync once implemented.
    return getSnsDomainKeySync(trimmedDomain, record);
  }

  return getSnsDomainKeySync(trimmedDomain, record);
};

const getReverseKeySync = (domain: string, isSub?: boolean) => {
  const { pubkey, parent } = getDomainKeySync(domain);
  const hashedReverseLookup = getHashedNameSync(pubkey.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    constants.REVERSE_LOOKUP_CLASS,
    isSub ? parent : undefined,
  );
  return reverseLookupAccount;
};

/**
 * Derives the V2 record account and the owning domain or subdomain account.
 *
 * Callers are responsible for applying any public API TLD restrictions before
 * invoking this helper. The key derivation itself follows `getDomainKeySync`.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type whose V2 account should be derived
 * @returns The derived record account as `pubkey` and its owning parent account
 * @throws {InvalidParentError} When the owning domain account cannot be resolved
 */
const _getRecordAndParentKey = ({
  domain,
  record,
}: {
  domain: string;
  record: Record;
}) => {
  let { pubkey, parent, isSub } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getDomainKeySync(domain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }

  return { pubkey, parent };
};

/**
 * Creates a name account with the given rent budget, allocated space, owner and class.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the new account
 * @param space The space in bytes allocated to the account
 * @param payerKey The allocation cost payer
 * @param nameOwner The pubkey to be set as owner of the new name account
 * @param lamports The budget to be set for the name account. If not specified, it'll be the minimum for rent exemption
 * @param nameClass The class of this new name
 * @param parentName The parent name of the new name. If specified its owner needs to sign
 * @returns
 */
async function createNameRegistry(
  connection: Connection,
  name: string,
  space: number,
  payerKey: PublicKey,
  nameOwner: PublicKey,
  lamports?: number,
  nameClass?: PublicKey,
  parentName?: PublicKey,
): Promise<TransactionInstruction> {
  const hashed_name = getHashedNameSync(name);
  const nameAccountKey = await getNameAccountKeySync(
    hashed_name,
    nameClass,
    parentName,
  );

  const balance = lamports
    ? lamports
    : await connection.getMinimumBalanceForRentExemption(space);

  let nameParentOwner: PublicKey | undefined;
  if (parentName) {
    const { registry: parentAccount } = await NameRegistryState.retrieve(
      connection,
      parentName,
    );
    nameParentOwner = parentAccount.owner;
  }

  const createNameInstr = createInstruction(
    constants.NAME_PROGRAM_ID,
    SystemProgram.programId,
    nameAccountKey,
    nameOwner,
    payerKey,
    hashed_name,
    new Numberu64(balance),
    new Numberu32(space),
    nameClass,
    parentName,
    nameParentOwner,
  );

  return createNameInstr;
}

/**
 * Overwrite the data of the given name registry.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name registry to update
 * @param offset The offset to which the data should be written into the registry
 * @param input_data The data to be written
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 */
async function updateNameRegistry(
  connection: Connection,
  name: string,
  offset: number,
  input_data: Buffer,
  nameClass?: PublicKey,
  nameParent?: PublicKey,
): Promise<TransactionInstruction> {
  const hashed_name = getHashedNameSync(name);
  const nameAccountKey = getNameAccountKeySync(
    hashed_name,
    nameClass,
    nameParent,
  );

  let signer: PublicKey;
  if (nameClass) {
    signer = nameClass;
  } else {
    signer = (await NameRegistryState.retrieve(connection, nameAccountKey))
      .registry.owner;
  }

  const updateInstr = updateInstruction(
    constants.NAME_PROGRAM_ID,
    nameAccountKey,
    new Numberu32(offset),
    input_data,
    signer,
  );

  return updateInstr;
}

/**
 * Change the owner of a given name account.
 *
 * @param connection The solana connection object to the RPC node
 * @param domain The domain to transfer, must include the TLD suffix (e.g. `mydomain.sns`).
 * @param newOwner The new owner to be set
 * @returns
 */
async function transferDomain(
  connection: Connection,
  domain: string,
  newOwner: PublicKey,
): Promise<TransactionInstruction> {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);

  const hashed_name = getHashedNameSync(trimmedDomain);
  const nameAccountKey = getNameAccountKeySync(
    hashed_name,
    undefined,
    constants.SNS_ROOT_DOMAIN_ACCOUNT,
  );
  const curentNameOwner = (
    await NameRegistryState.retrieve(connection, nameAccountKey)
  ).registry.owner;

  const transferInstr = transferInstruction(
    constants.NAME_PROGRAM_ID,
    nameAccountKey,
    newOwner,
    curentNameOwner,
  );

  return transferInstr;
}

/**
 * Delete the name account and transfer the rent to the target.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name account
 * @param refundTargetKey The refund destination address
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 * @returns
 */
async function deleteNameRegistry(
  connection: Connection,
  name: string,
  refundTargetKey: PublicKey,
  nameClass?: PublicKey,
  nameParent?: PublicKey,
): Promise<TransactionInstruction> {
  const hashed_name = getHashedNameSync(name);
  const nameAccountKey = getNameAccountKeySync(
    hashed_name,
    nameClass,
    nameParent,
  );

  let nameOwner: PublicKey;
  if (nameClass) {
    nameOwner = nameClass;
  } else {
    nameOwner = (await NameRegistryState.retrieve(connection, nameAccountKey))
      .registry.owner;
  }

  const changeAuthoritiesInstr = deleteInstruction(
    constants.NAME_PROGRAM_ID,
    nameAccountKey,
    refundTargetKey,
    nameOwner,
  );

  return changeAuthoritiesInstr;
}

/**
 *
 * @param nameAccount The name account to create the reverse account for
 * @param name The name of the domain
 * @param feePayer The fee payer of the transaction
 * @param parentName The parent name account
 * @param parentNameOwner The parent name owner
 * @returns
 */
const createReverse = async (
  nameAccount: PublicKey,
  name: string,
  feePayer: PublicKey,
  parentName?: PublicKey,
  parentNameOwner?: PublicKey,
) => {
  let [centralState] = await PublicKey.findProgramAddress(
    [constants.REGISTER_PROGRAM_ID.toBuffer()],
    constants.REGISTER_PROGRAM_ID,
  );

  let hashedReverseLookup = getHashedNameSync(nameAccount.toBase58());
  let reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    centralState,
    parentName,
  );

  let initCentralStateInstruction = new CreateReverseInstruction({
    name,
  }).getInstruction(
    constants.REGISTER_PROGRAM_ID,
    constants.NAME_PROGRAM_ID,
    constants.SNS_ROOT_DOMAIN_ACCOUNT,
    reverseLookupAccount,
    SystemProgram.programId,
    centralState,
    feePayer,
    SYSVAR_RENT_PUBKEY,
    parentName,
    parentNameOwner,
  );

  let instructions = [initCentralStateInstruction];

  return instructions;
};

/**
 * This function can be used to create a subdomain
 * @param connection The Solana RPC connection object
 * @param subdomain The subdomain to create, must include the TLD suffix (e.g. `sub.parent.sns`)
 * @param owner The owner of the parent domain creating the subdomain
 * @param space The space to allocate to the subdomain (defaults to 2kb)
 */
const createSubdomain = async (
  connection: Connection,
  subdomain: string,
  owner: PublicKey,
  space = 2_000,
  feePayer?: PublicKey,
) => {
  const ixs: TransactionInstruction[] = [];
  const [sub] = _parseSnsSubdomain(subdomain);

  const { parent, pubkey } = getDomainKeySync(subdomain);

  // Space allocated to the subdomains
  const lamports = await connection.getMinimumBalanceForRentExemption(
    space + NameRegistryState.HEADER_LEN,
  );

  const ix_create = await createNameRegistry(
    connection,
    "\0".concat(sub),
    space,
    feePayer || owner,
    owner,
    lamports,
    undefined,
    parent,
  );
  ixs.push(ix_create);

  // Create the reverse name
  const reverseKey = getReverseKeySync(subdomain, true);
  const info = await connection.getAccountInfo(reverseKey);
  if (!info?.data) {
    const ix_reverse = await createReverse(
      pubkey,
      "\0".concat(sub),
      feePayer || owner,
      parent,
      owner,
    );
    ixs.push(...ix_reverse);
  }

  return ixs;
};

const burnDomain = (domain: string, owner: PublicKey, target: PublicKey) => {
  _parseSnsTopLevelDomain(domain);

  const { pubkey } = getDomainKeySync(domain);
  const [state] = PublicKey.findProgramAddressSync(
    [pubkey.toBuffer()],
    constants.REGISTER_PROGRAM_ID,
  );
  const [resellingState] = PublicKey.findProgramAddressSync(
    [pubkey.toBuffer(), Uint8Array.from([1, 1])],
    constants.REGISTER_PROGRAM_ID,
  );

  const ix = new BurnInstruction().getInstruction(
    constants.REGISTER_PROGRAM_ID,
    constants.NAME_PROGRAM_ID,
    SystemProgram.programId,
    pubkey,
    getReverseKeySync(domain),
    resellingState,
    state,
    constants.REVERSE_LOOKUP_CLASS,
    owner,
    target,
  );
  return ix;
};

/**
 * This function is used to transfer the ownership of a subdomain in the Solana Name Service.
 *
 * @param {Connection} connection - The Solana RPC connection object.
 * @param {string} subdomain - The subdomain to transfer, must include the TLD suffix (e.g. `sub.parent.sns`).
 * @param {PublicKey} newOwner - The public key of the new owner of the subdomain.
 * @param {boolean} [isParentOwnerSigner=false] - A flag indicating whether the parent name owner is signing this transfer.
 * @param {PublicKey} [owner] - The public key of the current owner of the subdomain. This is an optional parameter. If not provided, the owner will be resolved automatically. This can be helpful to build transactions when the subdomain does not exist yet.
 *
 * @returns {Promise<TransactionInstruction>} - A promise that resolves to a Solana instruction for the transfer operation.
 */
const transferSubdomain = async (
  connection: Connection,
  subdomain: string,
  newOwner: PublicKey,
  isParentOwnerSigner?: boolean,
  owner?: PublicKey,
): Promise<TransactionInstruction> => {
  _parseSnsSubdomain(subdomain);

  const { pubkey, parent } = getDomainKeySync(subdomain);

  if (!owner) {
    const { registry } = await NameRegistryState.retrieve(connection, pubkey);
    owner = registry.owner;
  }

  let nameParent: PublicKey | undefined = undefined;
  let nameParentOwner: PublicKey | undefined = undefined;

  if (isParentOwnerSigner) {
    nameParent = parent!;
    nameParentOwner = (await NameRegistryState.retrieve(connection, parent!))
      .registry.owner;
  }

  const ix = transferInstruction(
    constants.NAME_PROGRAM_ID,
    pubkey,
    newOwner,
    owner,
    undefined,
    nameParent,
    nameParentOwner,
  );

  return ix;
};

/**
 * This function can be used to register a .sns domain
 * @param connection The Solana RPC connection object
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param space The domain name account size (max 10kB)
 * @param buyer The public key of the buyer
 * @param buyerTokenAccount The buyer token account (USDC)
 * @param mint Optional mint used to purchase the domain, defaults to USDC
 * @param referrerKey Optional referrer key
 * @returns
 */
const registerDomain = async (
  connection: Connection,
  domain: string,
  space: number,
  buyer: PublicKey,
  buyerTokenAccount: PublicKey,
  mint = constants.USDC_MINT,
  referrerKey?: PublicKey,
) => {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);
  const [cs] = PublicKey.findProgramAddressSync(
    [constants.REGISTER_PROGRAM_ID.toBuffer()],
    constants.REGISTER_PROGRAM_ID,
  );

  const hashed = getHashedNameSync(trimmedDomain);
  const nameAccount = getNameAccountKeySync(
    hashed,
    undefined,
    constants.SNS_ROOT_DOMAIN_ACCOUNT,
  );

  const hashedReverseLookup = getHashedNameSync(nameAccount.toBase58());
  const reverseLookupAccount = getNameAccountKeySync(hashedReverseLookup, cs);

  const [derived_state] = PublicKey.findProgramAddressSync(
    [nameAccount.toBuffer()],
    constants.REGISTER_PROGRAM_ID,
  );

  const refIdx = constants.REFERRERS.findIndex((e) => referrerKey?.equals(e));
  let refTokenAccount: PublicKey | undefined = undefined;

  const ixs: TransactionInstruction[] = [];

  if (refIdx !== -1 && !!referrerKey) {
    refTokenAccount = getAssociatedTokenAddressSync(mint, referrerKey, true);
    const acc = await connection.getAccountInfo(refTokenAccount);
    if (!acc?.data) {
      const ix = createAssociatedTokenAccountIdempotentInstruction(
        buyer,
        refTokenAccount,
        referrerKey,
        mint,
      );
      ixs.push(ix);
    }
  }

  const vault = getAssociatedTokenAddressSync(
    mint,
    constants.VAULT_OWNER,
    true,
  );
  const pythFeed = PYTH_PULL_FEEDS.get(mint.toBase58());

  if (!pythFeed) {
    throw new PythFeedNotFoundError(
      "The Pyth account for the provided mint was not found",
    );
  }

  const [pythFeedAccount] = getPythFeedAccountKey(0, pythFeed);

  const ix = new CreateSplitV2Instruction({
    name: trimmedDomain,
    space,
    referrerIdxOpt: refIdx != -1 ? refIdx : null,
  }).getInstruction(
    constants.REGISTER_PROGRAM_ID,
    constants.NAME_PROGRAM_ID,
    constants.SNS_ROOT_DOMAIN_ACCOUNT,
    nameAccount,
    reverseLookupAccount,
    SystemProgram.programId,
    cs,
    buyer,
    buyer,
    buyer,
    buyerTokenAccount,
    pythFeedAccount,
    vault,
    TOKEN_PROGRAM_ID,
    SYSVAR_RENT_PUBKEY,
    derived_state,
    refTokenAccount,
  );
  ixs.push(ix);

  return ixs;
};

/**
 * This function can be used to register a domain name as favorite
 * @param nameAccount The name account being registered as favorite
 * @param owner The owner of the name account
 * @param programId The name offer program ID
 * @returns
 */
const setPrimaryDomain = async (
  connection: Connection,
  nameAccount: PublicKey,
  owner: PublicKey,
) => {
  let parent: PublicKey | undefined = undefined;
  const { registry } = await NameRegistryState.retrieve(
    connection,
    nameAccount,
  );
  if (!registry.parentName.equals(constants.SNS_ROOT_DOMAIN_ACCOUNT)) {
    parent = registry.parentName;
  }

  const [favKey] = await PrimaryDomain.getKey(constants.NAME_OFFERS_ID, owner);
  const ix = new SetPrimaryInstruction().getInstruction(
    constants.NAME_OFFERS_ID,
    nameAccount,
    favKey,
    owner,
    SystemProgram.programId,
    parent,
  );

  return ix;
};

/**
 * This function can be used to retrieve the favorite domain of a user
 * @param connection The Solana RPC connection object
 * @param owner The owner you want to retrieve the favorite domain for
 * @returns
 */
const getPrimaryDomain = async (connection: Connection, owner: PublicKey) => {
  const [favKey] = PrimaryDomain.getKeySync(
    constants.NAME_OFFERS_ID,
    new PublicKey(owner),
  );
  const favorite = await PrimaryDomain.retrieve(connection, favKey);
  const { registry, nftOwner } = await NameRegistryState.retrieve(
    connection,
    favorite.nameAccount,
  );
  const domainOwner = nftOwner || registry.owner;

  let reverse = await reverseLookup(
    connection,
    favorite.nameAccount,
    registry.parentName.equals(constants.SNS_ROOT_DOMAIN_ACCOUNT)
      ? undefined
      : registry.parentName,
  );

  if (!registry.parentName.equals(constants.SNS_ROOT_DOMAIN_ACCOUNT)) {
    const parentReverse = await reverseLookup(connection, registry.parentName);
    reverse += `.${parentReverse}`;
  }

  return {
    domain: favorite.nameAccount,
    reverse,
    stale: !owner.equals(domainOwner),
  };
};

/**
 * Creates a record account and serializes its content according to SNS-IP 1.
 *
 * @param domain The full domain name including TLD (e.g. `mydomain.sns`)
 * @param record The record type enum
 * @param content The record content to serialize and store
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @returns The create record transaction instruction
 */
const createRecord = (
  domain: string,
  record: Record,
  content: string,
  owner: PublicKey,
  payer: PublicKey,
) => {
  _parseSnsDomain(domain);

  let { pubkey, parent, isSub } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getDomainKeySync(domain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }

  const ix = new allocateAndPostRecordInstruction({
    record: `\x02`.concat(record as string),
    content: Array.from(serializeRecordContent(content, record)),
  }).getInstruction(
    constants.SNS_RECORDS_ID,
    SystemProgram.programId,
    constants.NAME_PROGRAM_ID,
    payer,
    pubkey,
    parent,
    owner,
    constants.CENTRAL_STATE_SNS_RECORDS,
  );

  return ix;
};

/**
 * Updates a record account and serializes its content according to SNS-IP 1.
 *
 * @param domain The full domain name including TLD (e.g. `mydomain.sns`)
 * @param record The record type enum
 * @param content The record content to serialize and store
 * @param owner The owner of the record/domain
 * @param payer The fee payer of the transaction
 * @returns The update record transaction instruction
 */
const updateRecord = (
  domain: string,
  record: Record,
  content: string,
  owner: PublicKey,
  payer: PublicKey,
) => {
  _parseSnsDomain(domain);

  let { pubkey, parent, isSub } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getDomainKeySync(domain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }

  const ix = new editRecordInstruction({
    record: `\x02`.concat(record as string),
    content: Array.from(serializeRecordContent(content, record)),
  }).getInstruction(
    constants.SNS_RECORDS_ID,
    SystemProgram.programId,
    constants.NAME_PROGRAM_ID,
    payer,
    pubkey,
    parent,
    owner,
    constants.CENTRAL_STATE_SNS_RECORDS,
  );

  return ix;
};

/**
 * Deletes a record account and returns the rent to the fee payer.
 *
 * @param domain The full domain name including TLD (e.g. `mydomain.sns`)
 * @param record The record type enum
 * @param owner The owner of the record/domain
 * @param payer The fee payer of the transaction
 * @returns The delete record transaction instruction
 */
const deleteRecord = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
) => {
  _parseSnsDomain(domain);

  let { pubkey, parent, isSub } = getDomainKeySync(
    `${record}.${domain}`,
    RecordVersion.V2,
  );

  if (isSub) {
    parent = getDomainKeySync(domain).pubkey;
  }

  if (!parent) {
    throw new InvalidParentError("Parent could not be found");
  }

  const ix = new deleteRecordInstruction().getInstruction(
    constants.SNS_RECORDS_ID,
    SystemProgram.programId,
    constants.NAME_PROGRAM_ID,
    payer,
    pubkey,
    parent,
    owner,
    constants.CENTRAL_STATE_SNS_RECORDS,
  );

  return ix;
};

/**
 * Builds the SNS records program's Solana-signature validation instruction.
 *
 * The `staleness` flag selects the low-level program mode: `true` writes or
 * refreshes staleness verifier metadata, while `false` validates Right of
 * Association using the provided Solana verifier.
 *
 * @param staleness Whether to build the staleness verifier instruction mode
 * @param domain The full `.sns` domain or subdomain whose record is validated
 * @param record The record type whose V2 account is validated
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The Solana verifier account used by the selected mode
 * @returns A transaction instruction for the SNS records program
 * @throws {UnsupportedTldError} When `domain` is not a `.sns` domain
 * @throws {InvalidParentError} When the owning domain account cannot be resolved
 */
const _buildValidateSolanaSignatureInstruction = (
  staleness: boolean,
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) => {
  _parseSnsDomain(domain);

  const { pubkey, parent } = _getRecordAndParentKey({ domain, record });

  const ix = new validateSolanaSignatureInstruction({
    staleness,
  }).getInstruction(
    constants.SNS_RECORDS_ID,
    SystemProgram.programId,
    constants.NAME_PROGRAM_ID,
    payer,
    pubkey,
    parent,
    owner,
    constants.CENTRAL_STATE_SNS_RECORDS,
    verifier,
  );

  return ix;
};

/**
 * Writes or refreshes the staleness verifier metadata for a .sns record.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to validate
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The verifier to store for staleness checks
 * @returns A transaction instruction that sets the staleness verifier
 */
const setRecordStalenessVerifier = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) =>
  _buildValidateSolanaSignatureInstruction(
    true,
    domain,
    record,
    owner,
    payer,
    verifier,
  );

/**
 * Validates the Right of Association of a .sns record using a Solana verifier.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to validate
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The expected RoA verifier that signs the validation
 * @returns A transaction instruction that validates the record RoA
 */
const validateRecordRoa = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) =>
  _buildValidateSolanaSignatureInstruction(
    false,
    domain,
    record,
    owner,
    payer,
    verifier,
  );

/**
 * Stores the expected Right of Association verifier for a .sns record.
 *
 * @param domain The full domain name including TLD (e.g. `"mydomain.sns"`)
 * @param record The record type to set the RoA verifier for
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @param verifier The expected RoA verifier to store in the record
 * @returns A transaction instruction that sets the RoA verifier
 */
const setRecordRoaVerifier = (
  domain: string,
  record: Record,
  owner: PublicKey,
  payer: PublicKey,
  verifier: PublicKey,
) => {
  _parseSnsDomain(domain);

  const { pubkey, parent } = _getRecordAndParentKey({ domain, record });

  const ix = new writeRoaInstruction({
    roaId: Array.from(verifier.toBuffer()),
  }).getInstruction(
    constants.SNS_RECORDS_ID,
    SystemProgram.programId,
    constants.NAME_PROGRAM_ID,
    payer,
    pubkey,
    parent,
    owner,
    constants.CENTRAL_STATE_SNS_RECORDS,
  );

  return ix;
};

export const devnet = {
  utils: {
    getNameAccountKeySync,
    reverseLookup,
    _deriveSync,
    getDomainKeySync,
    getReverseKeySync,
    getPrimaryDomain,
  },
  constants,
  bindings: {
    createNameRegistry,
    updateNameRegistry,
    transferDomain,
    deleteNameRegistry,
    createReverse,
    createSubdomain,
    burnDomain,
    transferSubdomain,
    registerDomain,
    setPrimaryDomain,
    createRecord,
    updateRecord,
    deleteRecord,
    setRecordStalenessVerifier,
    setRecordRoaVerifier,
    validateRecordRoa,
  },
};
