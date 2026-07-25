import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Numberu32, Numberu64 } from "../int";

/**
 * Builds an SPL Name Service instruction that creates a name registry account.
 *
 * @param nameProgramId SPL Name Service program address.
 * @param systemProgramId System Program address used to create the account.
 * @param nameKey Derived address of the registry to create.
 * @param nameOwnerKey Public key that will own the registry.
 * @param payerKey Signer that funds account creation.
 * @param hashed_name Hashed name bytes stored by the registry.
 * @param lamports Rent-exempt lamports to allocate to the registry.
 * @param space Number of bytes allocated for the registry data.
 * @param nameClassKey Optional class authority required to create the registry.
 * @param nameParent Optional parent registry address.
 * @param nameParentOwner Optional signer that owns the parent registry.
 * @returns A transaction instruction that creates the name registry.
 *
 * @example
 * ```ts
 * const instruction = createInstruction(
 *   nameProgramId, systemProgramId, nameKey, owner, payer, hashedName, lamports, space,
 * );
 * ```
 */
export function createInstruction(
  nameProgramId: PublicKey,
  systemProgramId: PublicKey,
  nameKey: PublicKey,
  nameOwnerKey: PublicKey,
  payerKey: PublicKey,
  hashed_name: Buffer,
  lamports: Numberu64,
  space: Numberu32,
  nameClassKey?: PublicKey,
  nameParent?: PublicKey,
  nameParentOwner?: PublicKey,
): TransactionInstruction {
  const buffers = [
    Buffer.from(Int8Array.from([0])),
    new Numberu32(hashed_name.length).toBuffer(),
    hashed_name,
    lamports.toBuffer(),
    space.toBuffer(),
  ];

  const data = Buffer.concat(buffers);

  const keys = [
    {
      pubkey: systemProgramId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: payerKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: nameKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: nameOwnerKey,
      isSigner: false,
      isWritable: false,
    },
  ];

  if (nameClassKey) {
    keys.push({
      pubkey: nameClassKey,
      isSigner: true,
      isWritable: false,
    });
  } else {
    keys.push({
      pubkey: new PublicKey(Buffer.alloc(32)),
      isSigner: false,
      isWritable: false,
    });
  }
  if (nameParent) {
    keys.push({
      pubkey: nameParent,
      isSigner: false,
      isWritable: false,
    });
  } else {
    keys.push({
      pubkey: new PublicKey(Buffer.alloc(32)),
      isSigner: false,
      isWritable: false,
    });
  }
  if (nameParentOwner) {
    keys.push({
      pubkey: nameParentOwner,
      isSigner: true,
      isWritable: false,
    });
  }

  return new TransactionInstruction({
    keys,
    programId: nameProgramId,
    data,
  });
}
