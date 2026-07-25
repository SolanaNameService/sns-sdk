import { Buffer } from "buffer";

import { Record as RecordV2 } from "@bonfida/sns-records";
import { ed25519 } from "@noble/curves/ed25519";
import {
  Connection,
  PublicKey,
  SIGNATURE_LENGTH_IN_BYTES,
} from "@solana/web3.js";

import {
  CouldNotFindNftOwner,
  DomainDoesNotExist,
  InvalidRoaError,
  PdaOwnerNotAllowed,
  RecordMalformed,
  WrongValidation,
} from "../error";
import { NAME_TOKENIZER_ID } from "../nft/const";
import { retrieveNftOwnerV2 } from "../nft/retrieveNftOwnerV2";
import { NftRecord, Tag } from "../nft/state";
import { Validation } from "../record/const";
import { getRecordV1Key } from "../record/getRecordV1Key";
import { getRecordV2Key } from "../record/getRecordV2Key";
import { NameRegistryState } from "../state";
import { Record } from "../types/record";
import { getSnsDomainKeySync } from "../utils/getSnsDomainKeySync";

import type { ResolveConfig } from "./types";

/** Verifies a SOL record V1 signature. */
const verifySolRecordV1Signature = (
  record: Uint8Array,
  signedRecord: Uint8Array,
  pubkey: PublicKey,
) => ed25519.verify(signedRecord, record, pubkey.toBytes());

/** Resolves a TLD-trimmed domain using SNS-IP 5 logic. */
export const resolveSns = async (
  connection: Connection,
  domain: string,
  config: ResolveConfig,
): Promise<PublicKey> => {
  const { pubkey } = getSnsDomainKeySync(domain);
  const [nftRecordKey] = NftRecord.findKeySync(pubkey, NAME_TOKENIZER_ID);
  const solRecordV1Key = getRecordV1Key(domain, Record.SOL);
  const solRecordV2Key = getRecordV2Key(domain, Record.SOL);
  const [nftRecordInfo, solRecordV1Info, solRecordV2Info, registryInfo] =
    await connection.getMultipleAccountsInfo([
      nftRecordKey,
      solRecordV1Key,
      solRecordV2Key,
      pubkey,
    ]);

  if (!registryInfo?.data) {
    throw new DomainDoesNotExist(`Domain ${domain} does not exist`);
  }

  const registry = NameRegistryState.deserialize(registryInfo.data);

  if (nftRecordInfo?.data) {
    const nftRecord = NftRecord.deserialize(nftRecordInfo.data);
    if (nftRecord.tag === Tag.ActiveRecord) {
      const nftOwner = await retrieveNftOwnerV2(connection, pubkey);
      if (!nftOwner) {
        throw new CouldNotFindNftOwner();
      }
      return nftOwner;
    }
  }

  recordV2: if (solRecordV2Info?.data) {
    const recordV2 = RecordV2.deserialize(solRecordV2Info.data);
    const stalenessId = recordV2.getStalenessId();
    const roaId = recordV2.getRoAId();
    const content = recordV2.getContent();

    if (content.length !== 32) {
      throw new RecordMalformed("Record is malformed");
    }

    if (
      recordV2.header.rightOfAssociationValidation !== Validation.Solana ||
      recordV2.header.stalenessValidation !== Validation.Solana
    ) {
      throw new WrongValidation();
    }

    if (!stalenessId.equals(registry.owner.toBuffer())) {
      break recordV2;
    }

    if (roaId.equals(content)) {
      return new PublicKey(content);
    }

    throw new InvalidRoaError(
      `The RoA ID should be ${new PublicKey(
        content,
      ).toBase58()} but is ${new PublicKey(roaId).toBase58()} `,
    );
  }

  if (solRecordV1Info?.data) {
    const encoder = new TextEncoder();
    const expectedBuffer = Buffer.concat([
      solRecordV1Info.data.subarray(
        NameRegistryState.HEADER_LEN,
        NameRegistryState.HEADER_LEN + 32,
      ),
      solRecordV1Key.toBuffer(),
    ]);

    const expected = encoder.encode(expectedBuffer.toString("hex"));
    const valid = verifySolRecordV1Signature(
      expected,
      solRecordV1Info.data.subarray(
        NameRegistryState.HEADER_LEN + 32,
        NameRegistryState.HEADER_LEN + 32 + SIGNATURE_LENGTH_IN_BYTES,
      ),
      registry.owner,
    );

    if (valid) {
      return new PublicKey(
        solRecordV1Info.data.subarray(
          NameRegistryState.HEADER_LEN,
          NameRegistryState.HEADER_LEN + 32,
        ),
      );
    }
  }

  const isOnCurve = PublicKey.isOnCurve(registry.owner);
  if (!isOnCurve) {
    if (config.allowPda === "any") {
      return registry.owner;
    }

    if (config.allowPda) {
      const ownerInfo = await connection.getAccountInfo(registry.owner);
      const isAllowed = config.programIds.some((programId) =>
        ownerInfo?.owner.equals(programId),
      );

      if (isAllowed) {
        return registry.owner;
      }

      throw new PdaOwnerNotAllowed(
        `The Program ${ownerInfo?.owner.toBase58()} is not allowed`,
      );
    }

    throw new PdaOwnerNotAllowed();
  }

  return registry.owner;
};
