import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { NAME_PROGRAM_ID } from "../constants";
import { getCustomBgKeys } from "../custom-bg";
import { InvalidCustomBgError } from "../error";
import { createInstruction } from "../instructions/createInstruction";
import { reallocInstruction } from "../instructions/reallocInstruction";
import { transferInstruction } from "../instructions/transferInstruction";
import { updateInstruction } from "../instructions/updateInstruction";
import { Numberu32, Numberu64 } from "../int";
import { NameRegistryState } from "../state";
import { CustomBg } from "../types/custom-bg";
import { Record, RecordVersion } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";
import { _parseSnsTopLevelDomain } from "../utils/parseSnsDomain";

/**
 * Builds the instructions to set an issued custom background for a top-level `.sns` domain.
 *
 * @param connection Solana RPC connection
 * @param domain Full `.sns` domain name
 * @param bg The issued custom background to set
 * @param owner Current owner of the domain
 * @returns Transaction instructions.
 *
 * @example
 * ```ts
 * const instructions = await setBackground(connection, "example.sns", CustomBg.DegenPoet1, owner);
 * ```
 */
export const setBackground = async (
  connection: Connection,
  domain: string,
  bg: CustomBg,
  owner: PublicKey,
) => {
  const trimmedDomain = _parseSnsTopLevelDomain(domain);

  if (!Object.values(CustomBg).includes(bg)) {
    throw new InvalidCustomBgError("The selected background is invalid");
  }

  const { bgKey } = getCustomBgKeys(trimmedDomain, bg);
  const {
    pubkey: recordKey,
    hashed,
    parent,
  } = getSnsDomainKeySync(
    `${Record.Background}.${trimmedDomain}`,
    RecordVersion.V1,
  );

  const [bgInfo, recordInfo] = await connection.getMultipleAccountsInfo([
    bgKey,
    recordKey,
  ]);

  const bgData = bgInfo?.data.subarray(NameRegistryState.HEADER_LEN).toString();

  if (bgData !== bg) {
    throw new InvalidCustomBgError(
      "The selected background cannot be found for the domain",
    );
  }

  const serialized = bgKey.toBuffer();
  const space = serialized.length;

  const updateIx = updateInstruction(
    NAME_PROGRAM_ID,
    recordKey,
    new Numberu32(0),
    serialized,
    owner,
  );

  if (!recordInfo?.data) {
    const lamports = await connection.getMinimumBalanceForRentExemption(
      space + NameRegistryState.HEADER_LEN,
    );

    return [
      createInstruction(
        NAME_PROGRAM_ID,
        SystemProgram.programId,
        recordKey,
        owner,
        owner,
        hashed,
        new Numberu64(lamports),
        new Numberu32(space),
        undefined,
        parent,
        owner,
      ),
      updateIx,
    ];
  }

  const ixs: TransactionInstruction[] = [];

  const registry = NameRegistryState.deserialize(recordInfo.data);

  if (!registry.owner.equals(owner)) {
    // Transfer BG record to domain owner if record has a different owner
    const ix = transferInstruction(
      NAME_PROGRAM_ID,
      recordKey,
      owner,
      registry.owner,
      undefined,
      registry.parentName,
      owner,
    );
    ixs.push(ix);
  }

  const currentData = recordInfo.data.subarray(NameRegistryState.HEADER_LEN);

  if (currentData.length !== serialized.length) {
    ixs.push(
      reallocInstruction(
        NAME_PROGRAM_ID,
        SystemProgram.programId,
        owner,
        recordKey,
        owner,
        new Numberu32(space),
      ),
    );
  }

  ixs.push(updateIx);

  return ixs;
};
