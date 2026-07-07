import { getCreateAssociatedTokenIdempotentInstructionDataEncoder } from "@solana-program/token";
import { AccountMeta, AccountRole, Address, Instruction } from "@solana/kit";

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
