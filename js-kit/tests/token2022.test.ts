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

import { unpackAccount, unpackMint } from "../src/utils/token2022";

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

describe("Token-2022 unpacking", () => {
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
});
