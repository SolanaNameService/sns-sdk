import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Numberu32 } from "../int";

/**
 * Builds an SPL Name Service instruction that writes bytes to a name registry.
 *
 * @param nameProgramId SPL Name Service program address.
 * @param nameAccountKey Registry address to update.
 * @param offset Byte offset at which to begin writing.
 * @param inputData Bytes written to the account.
 * @param nameUpdateSigner Signer authorized to update the registry.
 * @returns A transaction instruction that writes the supplied bytes.
 *
 * @example
 * ```ts
 * const instruction = updateInstruction(nameProgramId, nameAccount, offset, data, updateSigner);
 * ```
 */
export function updateInstruction(
  nameProgramId: PublicKey,
  nameAccountKey: PublicKey,
  offset: Numberu32,
  inputData: Buffer,
  nameUpdateSigner: PublicKey,
): TransactionInstruction {
  const buffers = [
    Buffer.from(Int8Array.from([1])),
    offset.toBuffer(),
    new Numberu32(inputData.length).toBuffer(),
    inputData,
  ];

  const data = Buffer.concat(buffers);
  const keys = [
    {
      pubkey: nameAccountKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: nameUpdateSigner,
      isSigner: true,
      isWritable: false,
    },
  ];

  return new TransactionInstruction({
    keys,
    programId: nameProgramId,
    data,
  });
}
