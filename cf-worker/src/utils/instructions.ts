import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import type { TransactionInstruction } from "@solana/web3.js";

export const serializeInstruction = (ix: TransactionInstruction) => ({
  programId: ix.programId.toBase58(),
  keys: ix.keys.map((key) => ({
    isSigner: key.isSigner,
    isWritable: key.isWritable,
    pubkey: key.pubkey.toBase58(),
  })),
  data: ix.data.toString("base64"),
});

export const buildInstructionResponse = async (
  connection: Connection,
  feePayer: PublicKey,
  ixs: TransactionInstruction[],
  serialize?: boolean,
) => {
  if (serialize) {
    const tx = new Transaction().add(...ixs);
    tx.feePayer = feePayer;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    return tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
  }

  return ixs.map(serializeInstruction);
};
