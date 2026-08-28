import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  AccountState,
  getMintEncoder,
  getTokenEncoder,
  getTokenSize,
} from "@solana-program/token";
import {
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetTokenLargestAccountsApi,
  Rpc,
  fetchEncodedAccount,
  getI64Encoder,
  getProgramDerivedAddress,
  lamports,
} from "@solana/kit";

import { addressCodec, utf8Codec } from "../src/codecs";
import {
  SOL_SRS_CLASS,
  SRS_PROGRAM_ADDRESS,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "../src/constants/addresses";
import { getSolDomainAddress } from "../src/domain/getSolDomainAddress";
import { resolve } from "../src/domain/resolve";
import {
  CouldNotFindSrsOwnerError,
  DomainDoesNotExistError,
  DomainExpiredError,
  PdaOwnerNotAllowedError,
  RecordMalformedError,
  UnsupportedTldError,
} from "../src/errors";

jest.mock("@solana/kit", () => ({
  ...jest.requireActual<typeof import("@solana/kit")>("@solana/kit"),
  fetchEncodedAccount: jest.fn(),
}));

type TestRpc = Rpc<
  GetAccountInfoApi &
    GetMultipleAccountsApi &
    GetTokenLargestAccountsApi
>;

const fetchEncodedAccountMock = fetchEncodedAccount as jest.MockedFunction<
  typeof fetchEncodedAccount
>;
const owner = "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address;
const TOKEN_HOLDER_ADDRESS =
  "3ogYncmMM5CmytsGCqKHydmXmKUZ6sGWvizkzqwT7zb1" as Address;
const OTHER_TOKEN_HOLDER_ADDRESS =
  "DM1jJCkZZEwY5tmWbgvKRxsDFzXCdbfrYCCH1CtwguEs" as Address;
const TOKEN_2022_ACCOUNT_TYPE_OFFSET = getTokenSize();
const TOKEN_2022_MINT_ACCOUNT_TYPE = 1;
const TOKEN_2022_TOKEN_ACCOUNT_TYPE = 2;
const TOKEN_2022_MINT_EXTENSION_HEADER_LENGTH = 4;
const TOKEN_2022_MINT_EXTENSION_VALUE_LENGTH = 32;
const i64Encoder = getI64Encoder();
const mintEncoder = getMintEncoder();
const tokenEncoder = getTokenEncoder();

interface TokenLargestAccount {
  address: Address;
  amount: string;
}

type AccountResponse = Awaited<ReturnType<typeof fetchEncodedAccount>>;

interface RpcOptions {
  accountResponses?: readonly AccountResponse[];
  largestAccounts?: readonly TokenLargestAccount[];
}

const createRpc = ({
  accountResponses = [],
  largestAccounts,
}: RpcOptions = {}) => {
  for (const account of accountResponses) {
    fetchEncodedAccountMock.mockResolvedValueOnce(account);
  }

  const rpc = {
    getAccountInfo: jest.fn(),
    getMultipleAccounts: jest.fn(() => {
      throw new Error("SRS resolution must not use legacy SNS");
    }),
    getTokenLargestAccounts: jest.fn(() => {
      if (!largestAccounts) {
        throw new Error("SRS direct-owner resolution must not use token RPCs");
      }

      return {
        send: jest.fn(async () => ({ value: largestAccounts })),
      };
    }),
  } as unknown as TestRpc;

  return rpc;
};

interface SrsRecordOptions {
  recordOwner?: Address;
  ownerType?: number;
  expiry?: bigint;
  discriminator?: number;
  recordClass?: Address;
  frozen?: number;
  length?: number;
}

const createSrsRecord = async ({
  recordOwner = owner,
  ownerType = 0,
  expiry = BigInt(Math.floor(Date.now() / 1_000) + 60),
  discriminator = 2,
  recordClass = SOL_SRS_CLASS,
  frozen = 0,
  length = 75,
}: SrsRecordOptions = {}) => {
  const data = new Uint8Array(length);
  if (length < 75) return data;

  data[0] = discriminator;
  data.set(addressCodec.encode(recordClass), 1);
  data[33] = ownerType;
  data.set(addressCodec.encode(recordOwner), 34);
  data[66] = frozen;
  data.set(i64Encoder.encode(expiry), 67);
  return data;
};

const existingAccount = (
  data: Uint8Array,
  programAddress: Address = SRS_PROGRAM_ADDRESS,
  address: Address = SRS_PROGRAM_ADDRESS
) =>
  ({
    exists: true,
    address,
    data,
    executable: false,
    lamports: lamports(1n),
    programAddress,
    space: BigInt(data.length),
  }) as const;

interface MintDataOptions {
  supply?: bigint;
  decimals?: number;
  isInitialized?: boolean;
}

const createMintData = ({
  supply = 1n,
  decimals = 0,
  isInitialized = true,
}: MintDataOptions = {}) => {
  const base = mintEncoder.encode({
    mintAuthority: null,
    supply,
    decimals,
    isInitialized,
    freezeAuthority: null,
  });

  const data = new Uint8Array(
    TOKEN_2022_ACCOUNT_TYPE_OFFSET +
      1 +
      TOKEN_2022_MINT_EXTENSION_HEADER_LENGTH +
      TOKEN_2022_MINT_EXTENSION_VALUE_LENGTH
  );
  data.set(base);
  data[TOKEN_2022_ACCOUNT_TYPE_OFFSET] = TOKEN_2022_MINT_ACCOUNT_TYPE;
  data.set([3, 0, 32, 0], TOKEN_2022_ACCOUNT_TYPE_OFFSET + 1);
  return data;
};

interface TokenAccountDataOptions {
  mint: Address;
  owner: Address;
  amount?: bigint;
  state?: AccountState;
}

const createTokenAccountData = ({
  mint,
  owner,
  amount = 1n,
  state = AccountState.Initialized,
}: TokenAccountDataOptions) => {
  const base = tokenEncoder.encode({
    mint,
    owner,
    amount,
    delegate: null,
    state,
    isNative: null,
    delegatedAmount: 0n,
    closeAuthority: null,
  });

  const data = new Uint8Array(TOKEN_2022_ACCOUNT_TYPE_OFFSET + 5);
  data.set(base);
  data[TOKEN_2022_ACCOUNT_TYPE_OFFSET] = TOKEN_2022_TOKEN_ACCOUNT_TYPE;
  data.set([7, 0, 0, 0], TOKEN_2022_ACCOUNT_TYPE_OFFSET + 1);
  return data;
};

const getCanonicalTokenizedRecord = async (domain: string) => {
  const { domainAddress } = await getSolDomainAddress({ domain });
  const [mint] = await getProgramDerivedAddress({
    programAddress: SRS_PROGRAM_ADDRESS,
    seeds: [utf8Codec.encode("mint"), addressCodec.encode(domainAddress)],
  });

  return { domainAddress, mint };
};

describe("SRS .sol resolution", () => {
  beforeEach(() => {
    fetchEncodedAccountMock.mockReset();
  });

  test("returns a direct owner without SNS or token RPCs", async () => {
    const rpc = createRpc();
    fetchEncodedAccountMock.mockResolvedValue(
      existingAccount(await createSrsRecord())
    );

    await expect(resolve({ rpc, domain: "domain.sol" })).resolves.toBe(owner);
    expect(rpc.getMultipleAccounts).not.toHaveBeenCalled();
    expect(rpc.getTokenLargestAccounts).not.toHaveBeenCalled();
    expect(fetchEncodedAccountMock).toHaveBeenCalledTimes(1);
  });

  test("routes .sns through SNS", async () => {
    const rpc = createRpc();

    await expect(resolve({ rpc, domain: "domain.sns" })).rejects.toThrow(
      "SRS resolution must not use legacy SNS"
    );
    expect(rpc.getMultipleAccounts).toHaveBeenCalledTimes(1);
    expect(fetchEncodedAccountMock).not.toHaveBeenCalled();
  });

  test("rejects unsupported suffixes before RPCs", async () => {
    const rpc = createRpc();

    await expect(resolve({ rpc, domain: "domain.xyz" })).rejects.toThrow(
      UnsupportedTldError
    );
    expect(rpc.getMultipleAccounts).not.toHaveBeenCalled();
    expect(fetchEncodedAccountMock).not.toHaveBeenCalled();
  });

  test("throws when the canonical record does not exist", async () => {
    const rpc = createRpc();
    const { domainAddress } = await getSolDomainAddress({ domain: "missing" });
    fetchEncodedAccountMock.mockResolvedValue({
      exists: false,
      address: domainAddress,
    });

    await expect(resolve({ rpc, domain: "missing.sol" })).rejects.toThrow(
      DomainDoesNotExistError
    );
  });

  test.each([
    {
      name: "wrong runtime program",
      makeAccount: async () => existingAccount(await createSrsRecord(), owner),
    },
    {
      name: "short data",
      makeAccount: async () =>
        existingAccount((await createSrsRecord()).slice(0, 74)),
    },
    {
      name: "wrong discriminator",
      makeAccount: async () =>
        existingAccount(await createSrsRecord({ discriminator: 1 })),
    },
    {
      name: "wrong class",
      makeAccount: async () =>
        existingAccount(await createSrsRecord({ recordClass: owner })),
    },
    {
      name: "unknown owner type",
      makeAccount: async () =>
        existingAccount(await createSrsRecord({ ownerType: 2 })),
    },
  ])("rejects $name", async ({ makeAccount }) => {
    const rpc = createRpc();
    fetchEncodedAccountMock.mockResolvedValue(await makeAccount());

    await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toThrow(
      RecordMalformedError
    );
  });

  const now = 2_000_000_000;
  test.each([
    { name: "negative expiry as expired", expiry: -1n, expires: true },
    { name: "zero expiry as non-expiring", expiry: 0n, expires: false },
    { name: "past expiry as expired", expiry: BigInt(now - 1), expires: true },
    { name: "current expiry as expired", expiry: BigInt(now), expires: true },
    {
      name: "future expiry as valid",
      expiry: BigInt(now + 1),
      expires: false,
    },
  ])("treats $name", async ({ expiry, expires }) => {
    const dateNow = jest.spyOn(Date, "now").mockReturnValue(now * 1_000);
    const rpc = createRpc();
    fetchEncodedAccountMock.mockResolvedValue(
      existingAccount(await createSrsRecord({ expiry }))
    );

    const result = resolve({ rpc, domain: "domain.sol" });
    if (expires) {
      await expect(result).rejects.toThrow(DomainExpiredError);
    } else {
      await expect(result).resolves.toBe(owner);
    }
    dateNow.mockRestore();
  });

  test("accepts frozen records and trailing bytes", async () => {
    const rpc = createRpc();
    fetchEncodedAccountMock.mockResolvedValue(
      existingAccount(await createSrsRecord({ frozen: 1, length: 90 }))
    );

    await expect(resolve({ rpc, domain: "domain.sol" })).resolves.toBe(owner);
  });

  describe("tokenized SRS owners", () => {
    test.each([
      { name: "initialized", state: AccountState.Initialized },
      { name: "frozen", state: AccountState.Frozen },
    ])("resolves a $name extension-bearing holder", async ({ state }) => {
      const { domainAddress, mint } =
        await getCanonicalTokenizedRecord("domain");
      const rpc = createRpc({
        accountResponses: [
          existingAccount(
            await createSrsRecord({ recordOwner: mint, ownerType: 1 }),
            SRS_PROGRAM_ADDRESS,
            domainAddress
          ),
          existingAccount(createMintData(), TOKEN_2022_PROGRAM_ADDRESS, mint),
          existingAccount(
            createTokenAccountData({ mint, owner, state }),
            TOKEN_2022_PROGRAM_ADDRESS,
            TOKEN_HOLDER_ADDRESS
          ),
        ],
        largestAccounts: [
          { address: TOKEN_HOLDER_ADDRESS, amount: "1" },
          { address: OTHER_TOKEN_HOLDER_ADDRESS, amount: "0" },
        ],
      });

      await expect(resolve({ rpc, domain: "domain.sol" })).resolves.toBe(owner);
      expect(rpc.getTokenLargestAccounts).toHaveBeenCalledTimes(1);
      expect(fetchEncodedAccountMock).toHaveBeenCalledTimes(3);
    });

    test("rejects a noncanonical embedded mint before token RPCs", async () => {
      const { domainAddress } = await getCanonicalTokenizedRecord("domain");
      const rpc = createRpc({
        accountResponses: [
          existingAccount(
            await createSrsRecord({ recordOwner: owner, ownerType: 1 }),
            SRS_PROGRAM_ADDRESS,
            domainAddress
          ),
        ],
      });

      await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toThrow(
        RecordMalformedError
      );
      expect(fetchEncodedAccountMock).toHaveBeenCalledTimes(1);
      expect(rpc.getTokenLargestAccounts).not.toHaveBeenCalled();
    });

    interface InvalidMintCase {
      name: string;
      mintExists?: boolean;
      mintData?: Uint8Array;
      mintProgramAddress?: Address;
    }

    const invalidMintCases: InvalidMintCase[] = [
      { name: "missing", mintExists: false },
      { name: "wrong program", mintProgramAddress: owner },
      { name: "malformed", mintData: new Uint8Array(1) },
      {
        name: "uninitialized",
        mintData: createMintData({ isInitialized: false }),
      },
      { name: "nonzero decimals", mintData: createMintData({ decimals: 1 }) },
      { name: "wrong supply", mintData: createMintData({ supply: 2n }) },
    ];

    test.each(invalidMintCases)(
      "rejects a $name token mint",
      async (testCase) => {
        const { domainAddress, mint } =
          await getCanonicalTokenizedRecord("domain");
        const mintAccount =
          testCase.mintExists === false
            ? ({ exists: false, address: mint } as const)
            : existingAccount(
                testCase.mintData ?? createMintData(),
                testCase.mintProgramAddress ?? TOKEN_2022_PROGRAM_ADDRESS,
                mint
              );
        const rpc = createRpc({
          accountResponses: [
            existingAccount(
              await createSrsRecord({ recordOwner: mint, ownerType: 1 }),
              SRS_PROGRAM_ADDRESS,
              domainAddress
            ),
            mintAccount,
          ],
        });

        await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toThrow(
          CouldNotFindSrsOwnerError
        );
        expect(rpc.getTokenLargestAccounts).not.toHaveBeenCalled();
      }
    );

    test.each([
      { name: "no", largestAccounts: [] },
      {
        name: "multiple amount-one accounts in an inconsistent RPC response",
        largestAccounts: [
          { address: TOKEN_HOLDER_ADDRESS, amount: "1" },
          { address: OTHER_TOKEN_HOLDER_ADDRESS, amount: "1" },
        ],
      },
    ])("rejects $name unique holder result", async ({ largestAccounts }) => {
      const { domainAddress, mint } =
        await getCanonicalTokenizedRecord("domain");
      const rpc = createRpc({
        accountResponses: [
          existingAccount(
            await createSrsRecord({ recordOwner: mint, ownerType: 1 }),
            SRS_PROGRAM_ADDRESS,
            domainAddress
          ),
          existingAccount(createMintData(), TOKEN_2022_PROGRAM_ADDRESS, mint),
        ],
        largestAccounts,
      });

      await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toThrow(
        CouldNotFindSrsOwnerError
      );
      expect(fetchEncodedAccountMock).toHaveBeenCalledTimes(2);
    });

    interface HolderInvalidCase {
      name: string;
      holderExists?: boolean;
      holderProgramAddress?: Address;
      makeData?: (mint: Address) => Uint8Array;
    }

    const holderInvalidCases: HolderInvalidCase[] = [
      { name: "missing", holderExists: false },
      { name: "wrong program", holderProgramAddress: owner },
      { name: "malformed", makeData: () => new Uint8Array(1) },
      {
        name: "wrong mint",
        makeData: () => createTokenAccountData({ mint: owner, owner }),
      },
      {
        name: "wrong amount",
        makeData: (mint) => createTokenAccountData({ mint, owner, amount: 0n }),
      },
      {
        name: "uninitialized",
        makeData: (mint) =>
          createTokenAccountData({
            mint,
            owner,
            state: AccountState.Uninitialized,
          }),
      },
    ];

    test.each(holderInvalidCases)(
      "rejects a $name token holder account",
      async (testCase) => {
        const { domainAddress, mint } =
          await getCanonicalTokenizedRecord("domain");
        const holderAccount =
          testCase.holderExists === false
            ? ({ exists: false, address: TOKEN_HOLDER_ADDRESS } as const)
            : existingAccount(
                testCase.makeData?.(mint) ??
                  createTokenAccountData({ mint, owner }),
                testCase.holderProgramAddress ?? TOKEN_2022_PROGRAM_ADDRESS,
                TOKEN_HOLDER_ADDRESS
              );
        const rpc = createRpc({
          accountResponses: [
            existingAccount(
              await createSrsRecord({ recordOwner: mint, ownerType: 1 }),
              SRS_PROGRAM_ADDRESS,
              domainAddress
            ),
            existingAccount(createMintData(), TOKEN_2022_PROGRAM_ADDRESS, mint),
            holderAccount,
          ],
          largestAccounts: [{ address: TOKEN_HOLDER_ADDRESS, amount: "1" }],
        });

        await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toThrow(
          CouldNotFindSrsOwnerError
        );
      }
    );

    test("applies PDA policy to the token holder", async () => {
      const [holderOwner] = await getProgramDerivedAddress({
        programAddress: SRS_PROGRAM_ADDRESS,
        seeds: [utf8Codec.encode("holder")],
      });
      const { domainAddress, mint } =
        await getCanonicalTokenizedRecord("domain");
      const recordAccount = existingAccount(
        await createSrsRecord({ recordOwner: mint, ownerType: 1 }),
        SRS_PROGRAM_ADDRESS,
        domainAddress
      );
      const mintAccount = existingAccount(
        createMintData(),
        TOKEN_2022_PROGRAM_ADDRESS,
        mint
      );
      const holderData = createTokenAccountData({
        mint,
        owner: holderOwner,
      });
      const defaultRpc = createRpc({
        accountResponses: [
          recordAccount,
          mintAccount,
          existingAccount(
            holderData,
            TOKEN_2022_PROGRAM_ADDRESS,
            TOKEN_HOLDER_ADDRESS
          ),
        ],
        largestAccounts: [{ address: TOKEN_HOLDER_ADDRESS, amount: "1" }],
      });

      await expect(
        resolve({ rpc: defaultRpc, domain: "domain.sol" })
      ).rejects.toThrow(PdaOwnerNotAllowedError);

      const anyRpc = createRpc({
        accountResponses: [
          recordAccount,
          mintAccount,
          existingAccount(
            holderData,
            TOKEN_2022_PROGRAM_ADDRESS,
            TOKEN_HOLDER_ADDRESS
          ),
        ],
        largestAccounts: [{ address: TOKEN_HOLDER_ADDRESS, amount: "1" }],
      });
      await expect(
        resolve({
          rpc: anyRpc,
          domain: "domain.sol",
          options: { allowPda: "any" },
        })
      ).resolves.toBe(holderOwner);
    });
  });

  test("applies direct-owner PDA policy", async () => {
    const [pda] = await getProgramDerivedAddress({
      programAddress: SRS_PROGRAM_ADDRESS,
      seeds: [utf8Codec.encode("owner")],
    });
    const rpc = createRpc();
    const record = existingAccount(await createSrsRecord({ recordOwner: pda }));

    fetchEncodedAccountMock.mockResolvedValue(record);
    await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toThrow(
      PdaOwnerNotAllowedError
    );

    fetchEncodedAccountMock.mockResolvedValue(record);
    await expect(
      resolve({ rpc, domain: "domain.sol", options: { allowPda: "any" } })
    ).resolves.toBe(pda);
  });

  test("allows a PDA owned by an allowlisted program", async () => {
    const [pda] = await getProgramDerivedAddress({
      programAddress: SRS_PROGRAM_ADDRESS,
      seeds: [utf8Codec.encode("owner")],
    });
    const rpc = createRpc();
    fetchEncodedAccountMock
      .mockResolvedValueOnce(
        existingAccount(await createSrsRecord({ recordOwner: pda }))
      )
      .mockResolvedValueOnce(
        existingAccount(new Uint8Array(), SRS_PROGRAM_ADDRESS, pda)
      );

    await expect(
      resolve({
        rpc,
        domain: "domain.sol",
        options: { allowPda: true, programIds: [SRS_PROGRAM_ADDRESS] },
      })
    ).resolves.toBe(pda);
  });

  test("rejects missing and non-allowlisted PDA owner accounts", async () => {
    const [pda] = await getProgramDerivedAddress({
      programAddress: SRS_PROGRAM_ADDRESS,
      seeds: [utf8Codec.encode("owner")],
    });
    const { domainAddress } = await getSolDomainAddress({ domain: "domain" });
    const record = existingAccount(
      await createSrsRecord({ recordOwner: pda }),
      SRS_PROGRAM_ADDRESS,
      domainAddress
    );
    const rpc = createRpc();

    fetchEncodedAccountMock
      .mockResolvedValueOnce(record)
      .mockResolvedValueOnce({ exists: false, address: pda });
    await expect(
      resolve({
        rpc,
        domain: "domain.sol",
        options: { allowPda: true, programIds: [SRS_PROGRAM_ADDRESS] },
      })
    ).rejects.toThrow(PdaOwnerNotAllowedError);

    fetchEncodedAccountMock
      .mockResolvedValueOnce(record)
      .mockResolvedValueOnce(existingAccount(new Uint8Array(), owner, pda));
    await expect(
      resolve({
        rpc,
        domain: "domain.sol",
        options: { allowPda: true, programIds: [SRS_PROGRAM_ADDRESS] },
      })
    ).rejects.toThrow(PdaOwnerNotAllowedError);
  });

  test("propagates SRS account RPC errors unchanged", async () => {
    const rpc = createRpc();
    const failure = new Error("RPC unavailable");
    fetchEncodedAccountMock.mockRejectedValue(failure);

    await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toBe(failure);
  });
});
