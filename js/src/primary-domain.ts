import { Buffer } from "buffer";
import { deserialize } from "borsh";
import { PublicKey, Connection } from "@solana/web3.js";
import {
  AccountLayout,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { deserializeReverse } from "./utils/deserializeReverse";
import { getReverseKeyFromDomainKey } from "./utils/getReverseKeyFromDomainKey";
import { reverseLookup } from "./utils/reverseLookup";
import { PrimaryDomainNotFoundError } from "./error";
import { getDomainMint } from "./nft/getDomainMint";
import { NameRegistryState } from "./state";
import { NAME_PROGRAM_ID, SNS_ROOT_DOMAIN_ACCOUNT } from "./constants";

export const NAME_OFFERS_ID = new PublicKey(
  "85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29",
);

export class PrimaryDomain {
  tag: number;
  nameAccount: PublicKey;
  static schema = {
    struct: {
      tag: "u8",
      nameAccount: { array: { type: "u8", len: 32 } },
    },
  };

  constructor(obj: { tag: number; nameAccount: Uint8Array }) {
    this.tag = obj.tag;
    this.nameAccount = new PublicKey(obj.nameAccount);
  }

  /**
   * Deserializes raw primary-domain account data.
   *
   * @param data The raw primary-domain account data
   * @returns The deserialized primary-domain account
   */
  static deserialize(data: Buffer) {
    return new PrimaryDomain(deserialize(this.schema, data) as any);
  }

  /**
   * Fetches and deserializes a primary-domain account.
   *
   * @param connection Solana RPC connection
   * @param key The primary-domain account address
   * @returns The deserialized primary-domain account
   */
  static async retrieve(connection: Connection, key: PublicKey) {
    const accountInfo = await connection.getAccountInfo(key);
    if (!accountInfo || !accountInfo.data) {
      throw new PrimaryDomainNotFoundError(
        "The primary account does not exist",
      );
    }
    return this.deserialize(accountInfo.data);
  }

  /**
   * Derives the primary-domain account address for an owner.
   *
   * @param programId The primary-domain program ID
   * @param owner The public key of the wallet owner
   * @returns The derived primary-domain account address and bump seed
   */
  static async getKey(programId: PublicKey, owner: PublicKey) {
    return await PublicKey.findProgramAddress(
      [Buffer.from("favourite_domain"), owner.toBuffer()],
      programId,
    );
  }

  /**
   * Synchronously derives the primary-domain account address for an owner.
   *
   * @param programId The primary-domain program ID
   * @param owner The public key of the wallet owner
   * @returns The derived primary-domain account address and bump seed
   */
  static getKeySync(programId: PublicKey, owner: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("favourite_domain"), owner.toBuffer()],
      programId,
    );
  }
}

/**
 * Retrieves the primary domain set for a wallet.
 *
 * @param connection Solana RPC connection
 * @param owner The public key of the wallet owner
 * @returns The primary domain account, reverse domain name, and stale status
 */
export const getPrimaryDomain = async (
  connection: Connection,
  owner: PublicKey,
) => {
  const [primaryKey] = PrimaryDomain.getKeySync(
    NAME_OFFERS_ID,
    new PublicKey(owner),
  );
  const primary = await PrimaryDomain.retrieve(connection, primaryKey);
  const { registry, nftOwner } = await NameRegistryState.retrieve(
    connection,
    primary.nameAccount,
  );
  const domainOwner = nftOwner || registry.owner;

  let reverse = await reverseLookup(
    connection,
    primary.nameAccount,
    registry.parentName.equals(SNS_ROOT_DOMAIN_ACCOUNT)
      ? undefined
      : registry.parentName,
  );

  if (!registry.parentName.equals(SNS_ROOT_DOMAIN_ACCOUNT)) {
    const parentReverse = await reverseLookup(connection, registry.parentName);
    reverse += `.${parentReverse}`;
  }

  return {
    domain: primary.nameAccount,
    reverse,
    stale: !owner.equals(domainOwner),
  };
};

/**
 * This function can be used to retrieve the primary domains for multiple wallets, up to a maximum of 100.
 * If a wallet does not have a primary domain, the result will be 'undefined' instead of the human readable domain as a string.
 * This function is optimized for network efficiency, making only four RPC calls, three of which are executed in parallel using Promise.all, thereby reducing the overall execution time.
 * @param connection The Solana RPC connection object
 * @param wallets An array of PublicKeys representing the wallets
 * @returns A promise that resolves to an array of strings or undefined, representing the primary domains or lack thereof for each wallet
 */
export const getMultiplePrimaryDomains = async (
  connection: Connection,
  wallets: PublicKey[],
): Promise<(string | undefined)[]> => {
  const result: (string | undefined)[] = [];

  const primaryKeys = wallets.map(
    (e) => PrimaryDomain.getKeySync(NAME_OFFERS_ID, e)[0],
  );
  const primaryDomains = (
    await connection.getMultipleAccountsInfo(primaryKeys)
  ).map((e) => {
    if (!!e?.data) {
      return PrimaryDomain.deserialize(e?.data).nameAccount;
    }
    return PublicKey.default;
  });

  const domainInfos = await connection.getMultipleAccountsInfo(primaryDomains);
  const parentRevKeys: PublicKey[] = [];
  const revKeys = domainInfos.map((e, idx) => {
    const parent = new PublicKey(e?.data.slice(0, 32) ?? Buffer.alloc(32));
    const isSub =
      e?.owner.equals(NAME_PROGRAM_ID) &&
      !parent.equals(SNS_ROOT_DOMAIN_ACCOUNT);
    parentRevKeys.push(
      isSub ? getReverseKeyFromDomainKey(parent) : PublicKey.default,
    );
    return getReverseKeyFromDomainKey(
      primaryDomains[idx],
      isSub ? parent : undefined,
    );
  });
  const atas = primaryDomains.map((e, idx) => {
    const mint = getDomainMint(e);
    const ata = getAssociatedTokenAddressSync(mint, wallets[idx], true);
    return ata;
  });

  const [revs, tokenAccs, parentRevs] = await Promise.all([
    connection.getMultipleAccountsInfo(revKeys),
    connection.getMultipleAccountsInfo(atas),
    connection.getMultipleAccountsInfo(parentRevKeys),
  ]);

  for (let i = 0; i < wallets.length; i++) {
    let parentRev = "";
    const domainInfo = domainInfos[i];
    const rev = revs[i];
    const parentRevAccount = parentRevs[i];
    const tokenAcc = tokenAccs[i];

    if (!domainInfo || !rev) {
      result.push(undefined);
      continue;
    }

    if (parentRevAccount && parentRevAccount.owner.equals(NAME_PROGRAM_ID)) {
      const des = deserializeReverse(parentRevAccount.data.slice(96));
      parentRev += `.${des}`;
    }

    const nativeOwner = new PublicKey(domainInfo?.data.slice(32, 64));

    if (nativeOwner.equals(wallets[i])) {
      result.push(deserializeReverse(rev?.data.slice(96), true) + parentRev);
      continue;
    }
    // Either tokenized or stale
    if (!tokenAcc) {
      result.push(undefined);
      continue;
    }

    const decoded = AccountLayout.decode(tokenAcc.data);
    // Tokenized
    if (Number(decoded.amount) === 1) {
      result.push(deserializeReverse(rev?.data.slice(96)) + parentRev);
      continue;
    }

    // Stale
    result.push(undefined);
  }

  return result;
};
