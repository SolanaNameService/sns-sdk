import { describe, expect, test } from "@jest/globals";
import {
  AccountState,
  getMintEncoder,
  getMintSize,
  getMultisigSize,
  getTokenEncoder,
  getTokenSize,
} from "@solana-program/token";
import { Address } from "@solana/kit";

import { addressCodec } from "../src/codecs";
import { getMetadataSerializer } from "../src/srs/metadata";
import {
  getToken2022MintExtension,
  getTokenGroupMember,
  getTokenMetadataExtension,
  unpackAccount,
  unpackMint,
} from "../src/utils/token2022";

const mint = "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address;
const owner = "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8JmZKpU" as Address;
const TOKEN_2022_ACCOUNT_TYPE_OFFSET = getTokenSize();
const TOKEN_2022_MINT_ACCOUNT_TYPE = 1;
const TOKEN_2022_TOKEN_ACCOUNT_TYPE = 2;
const TOKEN_ACCOUNT_STATE_OFFSET = 108;
const mintEncoder = getMintEncoder();
const tokenEncoder = getTokenEncoder();

const createMintData = () =>
  Uint8Array.from(
    mintEncoder.encode({
      mintAuthority: null,
      supply: 1n,
      decimals: 0,
      isInitialized: true,
      freezeAuthority: null,
    })
  );

const createAccountData = () =>
  Uint8Array.from(
    tokenEncoder.encode({
      mint,
      owner,
      amount: 1n,
      delegate: null,
      state: AccountState.Initialized,
      isNative: null,
      delegatedAmount: 0n,
      closeAuthority: null,
    })
  );

const withExtensionEnvelope = (
  base: Uint8Array,
  accountType: number,
  length = TOKEN_2022_ACCOUNT_TYPE_OFFSET + 5
) => {
  const data = new Uint8Array(length);
  data.set(base);
  data[TOKEN_2022_ACCOUNT_TYPE_OFFSET] = accountType;
  return data;
};

const encodeString = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const result = new Uint8Array(4 + bytes.length);
  new DataView(result.buffer).setUint32(0, bytes.length, true);
  result.set(bytes, 4);
  return result;
};

const concat = (...parts: Uint8Array[]) => {
  const result = new Uint8Array(
    parts.reduce((length, part) => length + part.length, 0)
  );
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
};

const withMintExtensions = (
  extensions: { type: number; data: Uint8Array }[]
) => {
  const length =
    getTokenSize() +
    1 +
    extensions.reduce(
      (total, extension) => total + 4 + extension.data.length,
      0
    );
  const result = new Uint8Array(length);
  result.set(createMintData(), 0);
  result[getTokenSize()] = TOKEN_2022_MINT_ACCOUNT_TYPE;

  let offset = getTokenSize() + 1;
  for (const extension of extensions) {
    result[offset] = extension.type;
    result[offset + 1] = extension.type >> 8;
    result[offset + 2] = extension.data.length;
    result[offset + 3] = extension.data.length >> 8;
    result.set(extension.data, offset + 4);
    offset += 4 + extension.data.length;
  }
  return result;
};

const createMetadataExtension = () =>
  concat(
    new Uint8Array(addressCodec.encode(owner)),
    new Uint8Array(addressCodec.encode(mint)),
    encodeString("sns-ip-5-wallet-1"),
    encodeString("SRS"),
    encodeString("https://example.com/metadata.json"),
    new Uint8Array([0, 0, 0, 0])
  );

const createGroupMemberExtension = () =>
  concat(
    new Uint8Array(addressCodec.encode(mint)),
    new Uint8Array(addressCodec.encode(owner)),
    new Uint8Array(8)
  );

describe("Token-2022 unpacking", () => {
  const metadataSerializer = getMetadataSerializer();
  describe("unpackMint", () => {
    test.each([
      { name: "base", data: createMintData() },
      {
        name: "extension-bearing",
        data: withExtensionEnvelope(
          createMintData(),
          TOKEN_2022_MINT_ACCOUNT_TYPE
        ),
      },
    ])("decodes $name mint data", ({ data }) => {
      expect(unpackMint(data)).toMatchObject({
        supply: 1n,
        decimals: 0,
        isInitialized: true,
      });
    });

    test.each([
      {
        name: "truncated base",
        data: new Uint8Array(getMintSize() - 1),
      },
      {
        name: "intermediate length",
        data: withExtensionEnvelope(
          createMintData(),
          TOKEN_2022_MINT_ACCOUNT_TYPE,
          TOKEN_2022_ACCOUNT_TYPE_OFFSET
        ),
      },
      {
        name: "wrong account type",
        data: withExtensionEnvelope(
          createMintData(),
          TOKEN_2022_TOKEN_ACCOUNT_TYPE
        ),
      },
      {
        name: "multisig-sized ambiguity",
        data: withExtensionEnvelope(
          createMintData(),
          TOKEN_2022_MINT_ACCOUNT_TYPE,
          getMultisigSize()
        ),
      },
    ])("rejects $name", ({ data }) => {
      expect(() => unpackMint(data)).toThrow();
    });
  });

  describe("unpackAccount", () => {
    test.each([
      { name: "base", data: createAccountData() },
      {
        name: "extension-bearing",
        data: withExtensionEnvelope(
          createAccountData(),
          TOKEN_2022_TOKEN_ACCOUNT_TYPE
        ),
      },
    ])("decodes $name token account data", ({ data }) => {
      expect(unpackAccount(data)).toMatchObject({
        mint,
        owner,
        amount: 1n,
        state: AccountState.Initialized,
      });
    });

    const malformedBase = withExtensionEnvelope(
      createAccountData(),
      TOKEN_2022_TOKEN_ACCOUNT_TYPE
    );
    malformedBase[TOKEN_ACCOUNT_STATE_OFFSET] = 3;

    test.each([
      {
        name: "truncated base",
        data: new Uint8Array(getTokenSize() - 1),
      },
      {
        name: "wrong account type",
        data: withExtensionEnvelope(
          createAccountData(),
          TOKEN_2022_MINT_ACCOUNT_TYPE
        ),
      },
      {
        name: "multisig-sized ambiguity",
        data: withExtensionEnvelope(
          createAccountData(),
          TOKEN_2022_TOKEN_ACCOUNT_TYPE,
          getMultisigSize()
        ),
      },
      { name: "malformed base fields", data: malformedBase },
    ])("rejects $name", ({ data }) => {
      expect(() => unpackAccount(data)).toThrow();
    });
  });

  describe("SRS discovery extensions", () => {
    test("decodes Token Group Member and Token Metadata extensions", () => {
      const data = withMintExtensions([
        { type: 23, data: createGroupMemberExtension() },
        { type: 19, data: createMetadataExtension() },
      ]);

      expect(getTokenGroupMember(data)).toEqual({
        mint,
        group: owner,
      });
      expect(getTokenMetadataExtension(data)).toBeDefined();
      const [metadata] = metadataSerializer.deserialize(
        getTokenMetadataExtension(data)!.subarray(64)
      );
      expect(metadata).toEqual({
        name: "sns-ip-5-wallet-1",
        symbol: "SRS",
        uri: "https://example.com/metadata.json",
        additionalMetadata: [],
      });
    });

    test("rejects truncated Token-2022 extension data", () => {
      const data = new Uint8Array(getTokenSize() + 1 + 4);
      data[getTokenSize()] = TOKEN_2022_MINT_ACCOUNT_TYPE;
      data[getTokenSize() + 1] = 19;
      data[getTokenSize() + 3] = 16;

      expect(() => getToken2022MintExtension(data, 19)).toThrow();
    });
  });
});
