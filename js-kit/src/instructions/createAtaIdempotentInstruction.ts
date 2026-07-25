import { getCreateAssociatedTokenIdempotentInstructionDataEncoder } from "@solana-program/token";
import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";

/**
 * Creates an idempotent associated-token-account instruction.
 *
 * The instruction succeeds when the associated token account already exists,
 * allowing callers to include it safely before token transfers.
 *
 * @param programAddress Associated Token Program address
 * @param payer Account funding associated token account creation
 * @param ata Derived associated token account address
 * @param owner Owner of the associated token account
 * @param mint Token mint for the associated token account
 * @param systemProgram Solana System Program address
 * @param splTokenProgram SPL Token Program address
 * @returns Idempotent associated-token-account creation instruction
 *
 * @example
 * ```ts
 * const instruction = _createAtaIdempotentInstruction(
 *   ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
 *   payer,
 *   ata,
 *   owner,
 *   mint,
 *   SYSTEM_PROGRAM_ADDRESS,
 *   TOKEN_PROGRAM_ADDRESS,
 * );
 * ```
 */
export const _createAtaIdempotentInstruction = (
  programAddress: Address,
  payer: Address,
  ata: Address,
  owner: Address,
  mint: Address,
  systemProgram: Address,
  splTokenProgram: Address
): Instruction => {
  const accounts: AccountMeta[] = [
    {
      address: payer,
      role: AccountRole.WRITABLE_SIGNER,
    },
    {
      address: ata,
      role: AccountRole.WRITABLE,
    },
    {
      address: owner,
      role: AccountRole.READONLY,
    },
    {
      address: mint,
      role: AccountRole.READONLY,
    },
    {
      address: systemProgram,
      role: AccountRole.READONLY,
    },
    {
      address: splTokenProgram,
      role: AccountRole.READONLY,
    },
  ];

  return {
    programAddress,
    accounts,
    data: getCreateAssociatedTokenIdempotentInstructionDataEncoder().encode({}),
  };
};
