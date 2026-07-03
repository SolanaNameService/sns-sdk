import { Record as RecordV2, Validation } from "@bonfida/sns-records";
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
  UnsupportedTldError,
  WrongValidation,
} from "../error";
import { NAME_TOKENIZER_ID } from "../nft/const";
import { retrieveNftOwnerV2 } from "../nft/retrieveNftOwnerV2";
import { NftRecord, Tag } from "../nft/state";
import { getRecordV1Key } from "../record/getRecordV1Key";
import { getRecordV2Key } from "../record/getRecordV2Key";
import { NameRegistryState } from "../state";
import { Record } from "../types/record";
import { getDomainKeySync } from "../utils/getDomainKeySync";
import { getTld, SNS_TLD, SOL_TLD } from "../utils/tld";

export type ResolveConfig =
  | { allowPda: false; programIds?: never }
  | { allowPda: "any"; programIds?: never }
  | { allowPda: true; programIds: PublicKey[] };

/**
 * Verifies a SOL record V1 signature.
 *
 * @param record The expected signed payload
 * @param signedRecord The signature bytes
 * @param pubkey The public key of the signer
 * @returns Whether the signature is valid
 */
const verifySolRecordV1Signature = (
  record: Uint8Array,
  signedRecord: Uint8Array,
  pubkey: PublicKey,
) => {
  return ed25519.verify(signedRecord, record, pubkey.toBytes());
};

/**
 * Internal handler for `.sol` domains.
 *
 * @throws {Error} Always — `.sol`-specific resolution is not yet implemented.
 */
const resolveSol = async (
  _connection: Connection,
  _domain: string,
  _config: ResolveConfig,
): Promise<PublicKey> => {
  throw new Error("resolveSol is not yet implemented");
};

void resolveSol;

/**
 * Internal handler that resolves a .sns domain using the SNS-IP 5 logic.
 *
 * Accepts a .sns domain without TLD suffix (e.g. `"mydomain").
 */
const resolveSns = async (
  connection: Connection,
  domain: string,
  config: ResolveConfig,
): Promise<PublicKey> => {
  const { pubkey } = getDomainKeySync(domain);
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

  // If NFT record active -> NFT owner is the owner
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

  // Check SOL record V2
  recordV2: if (solRecordV2Info?.data) {
    const recordV2 = RecordV2.deserialize(solRecordV2Info.data);
    const stalenessId = recordV2.getStalenessId();
    const roaId = recordV2.getRoAId();
    const content = recordV2.getContent();

    if (content.length !== 32) {
      throw new RecordMalformed(`Record is malformed`);
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

  // Check SOL record V1
  if (solRecordV1Info?.data) {
    const encoder = new TextEncoder();
    const expectedBuffer = Buffer.concat([
      solRecordV1Info.data.slice(
        NameRegistryState.HEADER_LEN,
        NameRegistryState.HEADER_LEN + 32,
      ),
      solRecordV1Key.toBuffer(),
    ]);

    const expected = encoder.encode(expectedBuffer.toString("hex"));
    const valid = verifySolRecordV1Signature(
      expected,
      solRecordV1Info.data.slice(
        NameRegistryState.HEADER_LEN + 32,
        NameRegistryState.HEADER_LEN + 32 + SIGNATURE_LENGTH_IN_BYTES,
      ),
      registry.owner,
    );

    if (valid) {
      return new PublicKey(
        solRecordV1Info.data.slice(
          NameRegistryState.HEADER_LEN,
          NameRegistryState.HEADER_LEN + 32,
        ),
      );
    }
  }

  // Check if the registry owner is a PDA
  const isOnCurve = PublicKey.isOnCurve(registry.owner);
  if (!isOnCurve) {
    if (config.allowPda === "any") {
      return registry.owner;
    } else if (config.allowPda) {
      const ownerInfo = await connection.getAccountInfo(registry.owner);
      const isAllowed = config.programIds?.some((e) =>
        ownerInfo?.owner?.equals(e),
      );

      if (isAllowed) {
        return registry.owner;
      }

      throw new PdaOwnerNotAllowed(
        `The Program ${ownerInfo?.owner.toBase58()} is not allowed`,
      );
    } else {
      throw new PdaOwnerNotAllowed();
    }
  }

  return registry.owner;
};

/**
 * Resolve a domain to its owner public key according to SNS-IP 5.
 *
 * A TLD suffix is **required** — the domain must end with `.sns` or `.sol`
 * (e.g. `"mydomain.sns"`, `"mydomain.sol"`). Bare names without a recognised suffix
 * will throw {@link UnsupportedTldError}.
 *
 * Both `.sns` and `.sol` domains are currently resolved with the same SNS-IP 5
 * logic. `.sol`-specific behaviour (`resolveSol`) is reserved for a future release.
 *
 * @param connection - Solana RPC connection.
 * @param domain - Full domain name including TLD (e.g. `"mydomain.sns"`, `"mydomain.sol"`).
 * @param config - Optional PDA allowance config.
 * @throws {UnsupportedTldError} When the domain has no recognised TLD suffix.
 */
export const resolve = async (
  connection: Connection,
  domain: string,
  config: ResolveConfig = { allowPda: false },
): Promise<PublicKey> => {
  const tld = getTld(domain);
  if (!tld) {
    throw new UnsupportedTldError(
      `Domain "${domain}" is missing a supported TLD suffix (${SOL_TLD} or ${SNS_TLD})`,
    );
  }
  // Both .sns and .sol currently route to resolveSns (SNS-IP 5 logic).
  // resolveSol is reserved for future .sol-specific behaviour.
  return resolveSns(connection, domain, config);
};
