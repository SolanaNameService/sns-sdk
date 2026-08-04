import { ACCOUNT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SolanaJSONRPCError,
  type ConfirmedSignatureInfo,
  type GetProgramAccountsFilter,
  type ParsedTransactionWithMeta,
} from "@solana/web3.js";
import {
  NAME_TOKENIZER_ID,
  NftRecord,
  reverseLookupBatch,
  Tag,
} from "@bonfida/spl-name-service";
import { DurableObject } from "cloudflare:workers";

export type TokenizerBindings = {
  RPC_URL: string;
};

export type TokenizerRouteBindings = TokenizerBindings & {
  TOKENIZER_CACHE: DurableObjectNamespace<TokenizerCache>;
};

const ACTIVE_TAG_BASE58 = "3"; // Base58 encoding of the active-record tag byte (2).
const AMOUNT_ONE_BASE58 = "Ahg1opVcGX"; // Base58 encoding of little-endian u64 value 1.
const MAX_INCREMENTAL_SIGNATURES = 200; // Backlogs above this cap trigger a full bootstrap.
const TRANSACTION_BATCH_SIZE = 10; // Maximum parsed transactions accepted per QuickNode batch.
const ACCOUNT_BATCH_SIZE = 100; // Maximum accounts accepted by getMultipleAccountsInfo.
const SQL_PARAM_LIMIT = 100; // Conservative maximum number of SQLite bind parameters.
const META_ID = 1; // Fixed primary key for the singleton synchronization cursor.

type TokenizerCacheMetaRow = {
  last_signature: string | null;
};

type TokenizerRecordChange = {
  mint: string;
  nameAccount: string;
};

/** Splits an array into ordered batches no larger than the requested size. */
const chunk = <T>(values: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
};

/** Returns whether an instruction directly invokes the tokenizer program. */
const isTokenizerInstruction = (instruction: { programId: PublicKey }) =>
  instruction.programId.equals(NAME_TOKENIZER_ID);

/** Detects tokenizer invocations in top-level and inner instructions. */
const hasTokenizerInvocation = (transaction: ParsedTransactionWithMeta) => {
  const topLevel = transaction.transaction.message.instructions.some(
    isTokenizerInstruction,
  );
  const inner = transaction.meta?.innerInstructions?.some((group) =>
    group.instructions.some(isTokenizerInstruction),
  );

  return topLevel || inner === true;
};

/**
 * Maintains a complete positive index of active tokenizer mint records.
 *
 * The index is persisted in Durable Object SQLite storage and synchronized
 * against confirmed Solana state before each non-empty lookup.
 */
export class TokenizerCache extends DurableObject<TokenizerBindings> {
  private readonly connection: Connection;
  private syncPromise: Promise<void> | undefined;

  /** Initializes the Solana connection and idempotent SQLite schema. */
  constructor(ctx: DurableObjectState, env: TokenizerBindings) {
    super(ctx, env);
    this.connection = new Connection(env.RPC_URL, "confirmed");
    ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS tokenizer_records (
        mint TEXT PRIMARY KEY,
        name_account TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tokenizer_cache_meta (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        last_signature TEXT
      );
    `);
  }

  /**
   * Resolves active tokenizer records for the requested mints.
   *
   * @param mints Base58 mint addresses in caller-defined order.
   * @param minContextSlot Minimum confirmed Solana slot the index must observe.
   * @returns Matching name-account addresses in input-mint order.
   * @throws When tokenizer synchronization or storage access fails.
   */
  public async resolveMints(
    mints: string[],
    minContextSlot: number,
  ): Promise<string[]> {
    if (mints.length === 0) {
      return [];
    }

    await this.synchronize(minContextSlot);

    const records = new Map<string, string>();
    for (const mintBatch of chunk(mints, SQL_PARAM_LIMIT)) {
      const placeholders = mintBatch.map(() => "?").join(", ");
      const rows = this.ctx.storage.sql
        .exec<{
          mint: string;
          name_account: string;
        }>(
          `SELECT mint, name_account FROM tokenizer_records WHERE mint IN (${placeholders})`,
          ...mintBatch,
        )
        .toArray();

      for (const row of rows) {
        records.set(row.mint, row.name_account);
      }
    }

    return mints.flatMap((mint) => {
      const nameAccount = records.get(mint);
      return nameAccount === undefined ? [] : [nameAccount];
    });
  }

  /** Shares one in-flight synchronization between concurrent DO requests. */
  private synchronize(minContextSlot: number): Promise<void> {
    if (!this.syncPromise) {
      this.syncPromise = this.synchronizeInternal(minContextSlot).finally(
        () => {
          this.syncPromise = undefined;
        },
      );
    }

    return this.syncPromise;
  }

  /** Selects bootstrap or bounded incremental synchronization from the cursor. */
  private async synchronizeInternal(minContextSlot: number): Promise<void> {
    const cursorSignature = this.readCursor();
    if (!cursorSignature) {
      await this.bootstrap(minContextSlot);
      return;
    }

    const signatures = await this.connection.getSignaturesForAddress(
      NAME_TOKENIZER_ID,
      {
        limit: MAX_INCREMENTAL_SIGNATURES,
        until: cursorSignature,
        minContextSlot,
      },
      "confirmed",
    );

    if (signatures.length === 0) {
      return;
    }

    if (signatures.length === MAX_INCREMENTAL_SIGNATURES) {
      const oldestSignature = signatures[signatures.length - 1].signature;
      const probe = await this.connection.getSignaturesForAddress(
        NAME_TOKENIZER_ID,
        {
          before: oldestSignature,
          until: cursorSignature,
          limit: 1,
          minContextSlot,
        },
        "confirmed",
      );

      if (probe.length > 0) {
        await this.bootstrap(minContextSlot);
        return;
      }
    }

    await this.processIncremental(signatures, minContextSlot);
  }

  /** Fetches the latest confirmed tokenizer signature used as a bootstrap cursor. */
  private async fetchAnchor(minContextSlot: number) {
    const [anchor] = await this.connection.getSignaturesForAddress(
      NAME_TOKENIZER_ID,
      { limit: 1, minContextSlot },
      "confirmed",
    );

    if (!anchor) {
      throw new Error("Unable to establish a tokenizer synchronization anchor");
    }

    return anchor;
  }

  /** Rebuilds the complete positive index from all active tokenizer records. */
  private async bootstrap(minContextSlot: number): Promise<void> {
    const anchor = await this.fetchAnchor(minContextSlot);
    const filters: GetProgramAccountsFilter[] = [
      { dataSize: NftRecord.LEN },
      {
        memcmp: {
          offset: 0,
          bytes: ACTIVE_TAG_BASE58,
        },
      },
    ];
    const result = await this.connection.getProgramAccounts(NAME_TOKENIZER_ID, {
      commitment: "confirmed",
      filters,
      minContextSlot: Math.max(minContextSlot, anchor.slot),
      withContext: true,
    });

    const records = new Map<string, string>();
    for (const account of result.value) {
      const record = NftRecord.deserialize(account.account.data);
      records.set(record.nftMint.toBase58(), record.nameAccount.toBase58());
    }

    this.ctx.storage.transactionSync(() => {
      this.ctx.storage.sql.exec("DELETE FROM tokenizer_records");
      this.insertRecords(records.values(), records.keys());
      this.writeCursor(anchor);
    });
  }

  /**
   * Applies tokenizer record changes referenced by a bounded signature batch.
   * Falls back to bootstrap when successful transactions cannot be retrieved.
   */
  private async processIncremental(
    signatures: ConfirmedSignatureInfo[],
    minContextSlot: number,
  ): Promise<void> {
    const newestSignature = signatures[0];
    const successfulSignatures = signatures.filter(
      (signature) => signature.err === null,
    );
    const writableAccounts = new Map<string, PublicKey>();

    for (const signatureBatch of chunk(
      successfulSignatures,
      TRANSACTION_BATCH_SIZE,
    )) {
      let transactions: (ParsedTransactionWithMeta | null)[];
      try {
        transactions = await this.connection.getParsedTransactions(
          signatureBatch.map((signature) => signature.signature),
          {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
          },
        );
      } catch {
        await this.bootstrap(minContextSlot);
        return;
      }

      if (transactions.some((transaction) => transaction === null)) {
        await this.bootstrap(minContextSlot);
        return;
      }

      for (const transaction of transactions) {
        if (!transaction || !hasTokenizerInvocation(transaction)) {
          continue;
        }

        for (const account of transaction.transaction.message.accountKeys) {
          if (account.writable) {
            writableAccounts.set(account.pubkey.toBase58(), account.pubkey);
          }
        }
      }
    }

    const upserts = new Map<string, string>();
    const deletions = new Set<string>();
    const writableKeys = [...writableAccounts.values()];

    for (const accountBatch of chunk(writableKeys, ACCOUNT_BATCH_SIZE)) {
      const result = await this.connection.getMultipleAccountsInfoAndContext(
        accountBatch,
        {
          commitment: "confirmed",
          minContextSlot: newestSignature.slot,
        },
      );

      for (const [index, account] of result.value.entries()) {
        if (
          !account ||
          !account.owner.equals(NAME_TOKENIZER_ID) ||
          account.data.length !== NftRecord.LEN
        ) {
          continue;
        }

        const record = NftRecord.deserialize(account.data);
        const mint = record.nftMint.toBase58();

        switch (record.tag) {
          case Tag.ActiveRecord:
            upserts.set(mint, record.nameAccount.toBase58());
            deletions.delete(mint);
            break;
          case Tag.InactiveRecord:
            upserts.delete(mint);
            deletions.add(mint);
            break;
          default:
            throw new Error(
              `Unknown tokenizer record tag ${record.tag} at ${accountBatch[index].toBase58()}`,
            );
        }
      }
    }

    this.ctx.storage.transactionSync(() => {
      this.upsertRecords(upserts);
      this.deleteRecords(deletions);
      this.writeCursor(newestSignature);
    });
  }

  /** Reads the last successfully processed tokenizer signature. */
  private readCursor(): string | undefined {
    const row = this.ctx.storage.sql
      .exec<TokenizerCacheMetaRow>(
        "SELECT last_signature FROM tokenizer_cache_meta WHERE id = ?",
        META_ID,
      )
      .toArray()[0];

    if (!row || row.last_signature === null) {
      return undefined;
    }

    return row.last_signature;
  }

  /** Persists the last successfully processed tokenizer signature. */
  private writeCursor(cursor: Pick<ConfirmedSignatureInfo, "signature">) {
    this.ctx.storage.sql.exec(
      `INSERT INTO tokenizer_cache_meta (id, last_signature)
       VALUES (?, ?)
       ON CONFLICT(id) DO UPDATE SET
         last_signature = excluded.last_signature`,
      META_ID,
      cursor.signature,
    );
  }

  /** Inserts or replaces mint-to-name-account records in bounded SQL batches. */
  private insertRecords(
    nameAccounts: Iterable<string>,
    mints: Iterable<string>,
  ) {
    const records: TokenizerRecordChange[] = [];
    const mintIterator = mints[Symbol.iterator]();
    const nameAccountIterator = nameAccounts[Symbol.iterator]();
    let mint = mintIterator.next();
    let nameAccount = nameAccountIterator.next();

    while (!mint.done && !nameAccount.done) {
      records.push({ mint: mint.value, nameAccount: nameAccount.value });
      mint = mintIterator.next();
      nameAccount = nameAccountIterator.next();
    }

    for (const recordBatch of chunk(records, Math.floor(SQL_PARAM_LIMIT / 2))) {
      const placeholders = recordBatch.map(() => "(?, ?)").join(", ");
      const values = recordBatch.flatMap((record) => [
        record.mint,
        record.nameAccount,
      ]);

      this.ctx.storage.sql.exec(
        `INSERT INTO tokenizer_records (mint, name_account)
         VALUES ${placeholders}
         ON CONFLICT(mint) DO UPDATE SET name_account = excluded.name_account`,
        ...values,
      );
    }
  }

  /** Upserts active tokenizer records into the positive index. */
  private upsertRecords(records: Map<string, string>) {
    this.insertRecords(records.values(), records.keys());
  }

  /** Deletes inactive tokenizer mints from the positive index. */
  private deleteRecords(mints: Set<string>) {
    for (const mintBatch of chunk([...mints], SQL_PARAM_LIMIT)) {
      const placeholders = mintBatch.map(() => "?").join(", ");
      this.ctx.storage.sql.exec(
        `DELETE FROM tokenizer_records WHERE mint IN (${placeholders})`,
        ...mintBatch,
      );
    }
  }
}

/**
 * Retrieves tokenized SNS domains owned by a wallet through the positive cache.
 *
 * The wallet query reads only mint bytes from classic SPL-token accounts holding
 * exactly one token, then resolves matching active records through the singleton
 * tokenizer Durable Object and reverse-lookups their domain names.
 *
 * @param bindings Default RPC and tokenizer Durable Object bindings.
 * @param owner Wallet whose tokenized SNS domains should be retrieved.
 * @returns Resolved domain names and their name-account public keys.
 * @throws When the RPC URL is absent or an RPC/cache lookup fails.
 */
export const getSnsNftsForOwnerCached = async (
  bindings: TokenizerRouteBindings,
  owner: PublicKey,
): Promise<{ domain: string; key: PublicKey }[]> => {
  const endpoint = bindings.RPC_URL?.trim();
  if (!endpoint) {
    throw new Error("RPC_URL is not configured");
  }

  const connection = new Connection(endpoint, "confirmed");
  const walletAccounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    commitment: "confirmed",
    dataSlice: { offset: 0, length: 32 },
    filters: [
      { dataSize: ACCOUNT_SIZE },
      {
        memcmp: {
          offset: 32,
          bytes: owner.toBase58(),
        },
      },
      {
        memcmp: {
          offset: 64,
          bytes: AMOUNT_ONE_BASE58,
        },
      },
    ],
    withContext: true,
  });

  const mints: string[] = [];
  const seenMints = new Set<string>();
  for (const account of walletAccounts.value) {
    const mint = new PublicKey(account.account.data).toBase58();
    if (!seenMints.has(mint)) {
      seenMints.add(mint);
      mints.push(mint);
    }
  }

  if (mints.length === 0) {
    return [];
  }

  const namespace = bindings.TOKENIZER_CACHE;
  const stub = namespace.get(namespace.idFromName("mainnet"));
  let nameAccountStrings: string[];
  try {
    nameAccountStrings = await stub.resolveMints(
      mints,
      walletAccounts.context.slot,
    );
  } catch (err) {
    if (err instanceof Error && err.name === "SolanaJSONRPCError") {
      throw new SolanaJSONRPCError({ code: undefined, message: err.message });
    }
    throw err;
  }
  const nameAccounts = nameAccountStrings.map(
    (nameAccount) => new PublicKey(nameAccount),
  );
  const domains = await reverseLookupBatch(connection, nameAccounts);

  return nameAccounts
    .map((key, index) => {
      const domain = domains[index];
      return domain === undefined ? undefined : { domain, key };
    })
    .filter(
      (entry): entry is { domain: string; key: PublicKey } =>
        entry !== undefined,
    );
};
