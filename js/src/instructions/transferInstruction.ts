import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

/**
 * Builds an SPL Name Service instruction that transfers a name registry owner.
 *
 * @param nameProgramId SPL Name Service program address.
 * @param nameAccountKey Registry address whose owner changes.
 * @param newOwnerKey Public key that becomes the registry owner.
 * @param currentNameOwnerKey Current registry owner and default required signer.
 * @param nameClassKey Optional class authority signer.
 * @param nameParent Optional parent registry address.
 * @param parentOwner Optional parent owner signer used instead of the current owner.
 * @returns A transaction instruction that transfers registry ownership.
 *
 * @example
 * ```ts
 * const instruction = transferInstruction(nameProgramId, nameAccount, newOwner, currentOwner);
 * ```
 */
export function transferInstruction(
  nameProgramId: PublicKey,
  nameAccountKey: PublicKey,
  newOwnerKey: PublicKey,
  currentNameOwnerKey: PublicKey,
  nameClassKey?: PublicKey,
  nameParent?: PublicKey,
  parentOwner?: PublicKey,
): TransactionInstruction {
  const buffers = [Buffer.from(Int8Array.from([2])), newOwnerKey.toBuffer()];

  const data = Buffer.concat(buffers);

  const keys = [
    {
      pubkey: nameAccountKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: parentOwner ? parentOwner : currentNameOwnerKey,
      isSigner: true,
      isWritable: false,
    },
  ];

  if (nameClassKey) {
    keys.push({
      pubkey: nameClassKey,
      isSigner: true,
      isWritable: false,
    });
  }

  if (parentOwner && nameParent) {
    if (!nameClassKey) {
      keys.push({
        pubkey: PublicKey.default,
        isSigner: false,
        isWritable: false,
      });
    }
    keys.push({
      pubkey: nameParent,
      isSigner: false,
      isWritable: false,
    });
  }

  return new TransactionInstruction({
    keys,
    programId: nameProgramId,
    data,
  });
}
