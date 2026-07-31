import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  Address,
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  Rpc,
  fetchEncodedAccount,
  getI64Encoder,
  getProgramDerivedAddress,
  lamports,
} from "@solana/kit";

import { addressCodec, utf8Codec } from "../src/codecs";
import { SRS_PROGRAM_ADDRESS } from "../src/config";
import { SOL_SRS_CLASS } from "../src/constants/addresses";
import { getSrsDomainAddress } from "../src/domain/getSrsDomainAddress";
import { resolve } from "../src/domain/resolve";
import {
  CouldNotFindSrsOwnerError,
  DomainDoesNotExistError,
  DomainExpiredError,
  PdaOwnerNotAllowedError,
  RecordMalformedError,
  UnsupportedTldError,
} from "../src/errors";

jest.mock("../src/config", () => ({
  ...jest.requireActual<typeof import("../src/config")>("../src/config"),
  SOL_SRS_RESOLUTION_ENABLED: true,
}));

jest.mock("@solana/kit", () => ({
  ...jest.requireActual<typeof import("@solana/kit")>("@solana/kit"),
  fetchEncodedAccount: jest.fn(),
}));

type TestRpc = Rpc<
  GetAccountInfoApi &
    GetMultipleAccountsApi &
    GetSlotApi &
    GetTokenLargestAccountsApi
>;

const fetchEncodedAccountMock = fetchEncodedAccount as jest.MockedFunction<
  typeof fetchEncodedAccount
>;
const owner = "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address;
const i64Encoder = getI64Encoder();

const createRpc = () => {
  const rpc = {
    getAccountInfo: jest.fn(),
    getMultipleAccounts: jest.fn(() => {
      throw new Error("SRS resolution must not use legacy SNS");
    }),
    getSlot: jest.fn(() => {
      throw new Error("SRS resolution must not request a slot");
    }),
    getTokenLargestAccounts: jest.fn(() => {
      throw new Error("SRS direct-owner resolution must not use token RPCs");
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

describe("SRS .sol resolution", () => {
  beforeEach(() => {
    fetchEncodedAccountMock.mockReset();
  });

  test("returns a direct owner without slot, SNS, or token RPCs", async () => {
    const rpc = createRpc();
    fetchEncodedAccountMock.mockResolvedValue(
      existingAccount(await createSrsRecord())
    );

    await expect(resolve({ rpc, domain: "domain.sol" })).resolves.toBe(owner);
    expect(rpc.getSlot).not.toHaveBeenCalled();
    expect(rpc.getMultipleAccounts).not.toHaveBeenCalled();
    expect(rpc.getTokenLargestAccounts).not.toHaveBeenCalled();
    expect(fetchEncodedAccountMock).toHaveBeenCalledTimes(1);
  });

  test("routes .sns through SNS without requesting a slot", async () => {
    const rpc = createRpc();

    await expect(resolve({ rpc, domain: "domain.sns" })).rejects.toThrow(
      "SRS resolution must not use legacy SNS"
    );
    expect(rpc.getSlot).not.toHaveBeenCalled();
    expect(rpc.getMultipleAccounts).toHaveBeenCalledTimes(1);
    expect(fetchEncodedAccountMock).not.toHaveBeenCalled();
  });

  test("rejects unsupported suffixes before RPCs", async () => {
    const rpc = createRpc();

    await expect(resolve({ rpc, domain: "domain.xyz" })).rejects.toThrow(
      UnsupportedTldError
    );
    expect(rpc.getSlot).not.toHaveBeenCalled();
    expect(rpc.getMultipleAccounts).not.toHaveBeenCalled();
    expect(fetchEncodedAccountMock).not.toHaveBeenCalled();
  });

  test("throws when the canonical record does not exist", async () => {
    const rpc = createRpc();
    const { domainAddress } = await getSrsDomainAddress({ domain: "missing" });
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
      makeAccount: async () => existingAccount(new Uint8Array(74)),
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

  test("rejects tokenized owners until Token-2022 support lands", async () => {
    const rpc = createRpc();
    fetchEncodedAccountMock.mockResolvedValue(
      existingAccount(await createSrsRecord({ ownerType: 1 }))
    );

    await expect(resolve({ rpc, domain: "domain.sol" })).rejects.toThrow(
      CouldNotFindSrsOwnerError
    );
    expect(rpc.getTokenLargestAccounts).not.toHaveBeenCalled();
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
    const { domainAddress } = await getSrsDomainAddress({ domain: "domain" });
    const record = existingAccount(await createSrsRecord({ recordOwner: pda }));
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
      .mockResolvedValueOnce(
        existingAccount(new Uint8Array(), owner, domainAddress)
      );
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
