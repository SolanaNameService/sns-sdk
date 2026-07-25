import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

/**
 * Builds an SPL Name Service instruction that deletes a name registry account.
 *
 * @param nameProgramId SPL Name Service program address.
 * @param nameAccountKey Registry address to delete.
 * @param refundTargetKey Account that receives the reclaimed lamports.
 * @param nameOwnerKey Signer authorized to delete the registry.
 * @returns A transaction instruction that deletes the name registry.
 *
 * @example
 * ```ts
 * const instruction = deleteInstruction(nameProgramId, nameAccount, refundTarget, owner);
 * ```
 */
export function deleteInstruction(
  nameProgramId: PublicKey,
  nameAccountKey: PublicKey,
  refundTargetKey: PublicKey,
  nameOwnerKey: PublicKey,
): TransactionInstruction {
  const buffers = [Buffer.from(Int8Array.from([3]))];

  const data = Buffer.concat(buffers);
  const keys = [
    {
      pubkey: nameAccountKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: nameOwnerKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: refundTargetKey,
      isSigner: false,
      isWritable: true,
    },
  ];

  return new TransactionInstruction({
    keys,
    programId: nameProgramId,
    data,
  });
}
