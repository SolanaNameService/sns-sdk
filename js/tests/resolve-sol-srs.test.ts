import { describe, expect, jest, test } from "@jest/globals";
import { AccountInfo, Connection, Keypair, PublicKey } from "@solana/web3.js";

jest.mock("../src/config", () => ({
  ...jest.requireActual<typeof import("../src/config")>("../src/config"),
  SOL_SRS_RESOLUTION_ENABLED: true,
}));

import { SRS_PROGRAM_ID } from "../src/config";
import {
  CouldNotFindSrsOwner,
  DomainDoesNotExist,
  DomainExpired,
  PdaOwnerNotAllowed,
  RecordMalformed,
  UnsupportedTldError,
} from "../src/error";
import { resolve } from "../src/resolve";
import {
  getSrsDomainKeySync,
  getSrsRecordSeed,
  SOL_SRS_CLASS,
  SRS_CENTRAL_STATE,
} from "../src/utils/getSrsDomainKeySync";
import * as tldUtils from "../src/utils/tld";

const getSrsAddresses = (domain: string) => {
  const name = domain.slice(0, -tldUtils.SOL_TLD.length);
  const { pubkey: record } = getSrsDomainKeySync(name);

  return {
    centralState: SRS_CENTRAL_STATE,
    solClass: SOL_SRS_CLASS,
    record,
  };
};

interface SrsRecordOptions {
  domain?: string;
  owner?: PublicKey;
  ownerType?: number;
  expiry?: bigint;
  discriminator?: number;
  recordClass?: PublicKey;
  length?: number;
}

const createSrsRecord = ({
  domain = "domain.sol",
  owner = Keypair.generate().publicKey,
  ownerType = 0,
  expiry = BigInt(Math.floor(Date.now() / 1_000) + 60),
  discriminator = 2,
  recordClass = getSrsAddresses(domain).solClass,
  length = 75,
}: SrsRecordOptions = {}): Buffer => {
  const data = Buffer.alloc(length);
  if (length < 75) {
    return data;
  }

  data[0] = discriminator;
  recordClass.toBuffer().copy(data, 1);
  data[33] = ownerType;
  owner.toBuffer().copy(data, 34);
  data.writeBigInt64LE(expiry, 67);
  return data;
};

const accountInfo = (
  data: Buffer,
  programId = SRS_PROGRAM_ID,
): AccountInfo<Buffer> => ({
  data,
  executable: false,
  lamports: 1,
  owner: programId,
  rentEpoch: 0,
});

const createConnection = (
  getAccountInfo: (address: PublicKey) => Promise<AccountInfo<Buffer> | null>,
) => {
  const getSlot = jest.fn(async () => {
    throw new Error("SRS resolution must not request a slot");
  });
  const getMultipleAccountsInfo = jest.fn(async () => {
    throw new Error("SRS resolution must not use legacy SNS");
  });
  const connection = {
    rpcEndpoint: "https://srs.example.com",
    getAccountInfo: jest.fn(getAccountInfo),
    getSlot,
    getMultipleAccountsInfo,
  } as unknown as Connection;

  return { connection, getSlot, getMultipleAccountsInfo };
};

describe("SRS record derivation", () => {
  test("generates the current record seed exactly", () => {
    expect(getSrsRecordSeed("domain")).toEqual(Buffer.from("namedomain"));
    expect(getSrsRecordSeed("dömain")).toEqual(Buffer.from("namedömain"));
  });

  test("matches canonical PDA fixtures", () => {
    const { centralState, solClass, record } =
      getSrsAddresses("test_domain.sol");

    expect(centralState.toBase58()).toBe(
      "8K9XmpN6nKy3ERnMovnoj5cbqWKPiGYN8hCRRyW4TLQV",
    );
    expect(solClass.toBase58()).toBe(
      "AjheAtCgSwEcEYd6xi6thcQW25ELWd7wKCx6SKBGUtMQ",
    );
    expect(record.toBase58()).toBe(
      "HcuxUAdeMaA2VHj3FifdTqjNFgJuExyEruLz8zhKYn7k",
    );
  });
});

describe("SRS .sol resolution", () => {
  test("returns a live pubkey owner without slot or legacy RPCs", async () => {
    const owner = Keypair.generate().publicKey;
    const { connection, getSlot, getMultipleAccountsInfo } = createConnection(
      async () => accountInfo(createSrsRecord({ owner })),
    );
    const getTld = jest.spyOn(tldUtils, "getTld");

    await expect(resolve(connection, "domain.sol")).resolves.toEqual(owner);
    expect(getTld).not.toHaveBeenCalled();
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).not.toHaveBeenCalled();

    getTld.mockRestore();
  });

  test("routes .sns through legacy resolution when SRS is enabled", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } = createConnection(
      async () => null,
    );

    await expect(resolve(connection, "domain.sns")).rejects.toThrow(
      "SRS resolution must not use legacy SNS",
    );
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).toHaveBeenCalledTimes(1);
  });

  test("throws when the canonical record does not exist", async () => {
    const { connection } = createConnection(async () => null);

    await expect(resolve(connection, "missing.sol")).rejects.toThrow(
      DomainDoesNotExist,
    );
  });

  test.each([
    {
      name: "wrong runtime program",
      info: accountInfo(createSrsRecord(), PublicKey.default),
    },
    { name: "short data", info: accountInfo(Buffer.alloc(74)) },
    {
      name: "wrong discriminator",
      info: accountInfo(createSrsRecord({ discriminator: 1 })),
    },
    {
      name: "wrong class",
      info: accountInfo(createSrsRecord({ recordClass: PublicKey.default })),
    },
    {
      name: "unknown owner type",
      info: accountInfo(createSrsRecord({ ownerType: 2 })),
    },
  ])("rejects $name", async ({ info }) => {
    const { connection } = createConnection(async () => info);

    await expect(resolve(connection, "domain.sol")).rejects.toThrow(
      RecordMalformed,
    );
  });

  test.each([
    { offset: -1, expires: true },
    { offset: 0, expires: true },
    { offset: 1, expires: false },
  ])(
    "applies the expiry boundary at $offset seconds",
    async ({ offset, expires }) => {
      const now = 2_000_000_000;
      const dateNow = jest.spyOn(Date, "now").mockReturnValue(now * 1_000);
      const { connection } = createConnection(async () =>
        accountInfo(createSrsRecord({ expiry: BigInt(now + offset) })),
      );
      const result = resolve(connection, "domain.sol");

      if (expires) {
        await expect(result).rejects.toThrow(DomainExpired);
      } else {
        await expect(result).resolves.toBeInstanceOf(PublicKey);
      }

      dateNow.mockRestore();
    },
  );

  test("allows any PDA owner when configured", async () => {
    const [owner] = PublicKey.findProgramAddressSync(
      [Buffer.from("owner")],
      SRS_PROGRAM_ID,
    );
    const { connection } = createConnection(async () =>
      accountInfo(createSrsRecord({ owner })),
    );

    await expect(
      resolve(connection, "domain.sol", { allowPda: "any" }),
    ).resolves.toEqual(owner);
  });

  test("resolves the owner of a frozen record", async () => {
    const owner = Keypair.generate().publicKey;
    const data = createSrsRecord({ owner });
    data[66] = 1;
    const { connection } = createConnection(async () => accountInfo(data));

    await expect(resolve(connection, "domain.sol")).resolves.toEqual(owner);
  });

  test("rejects a PDA owner by default", async () => {
    const [owner] = PublicKey.findProgramAddressSync(
      [Buffer.from("owner")],
      SRS_PROGRAM_ID,
    );
    const { connection } = createConnection(async () =>
      accountInfo(createSrsRecord({ owner })),
    );

    await expect(resolve(connection, "domain.sol")).rejects.toThrow(
      PdaOwnerNotAllowed,
    );
  });

  test("allows a PDA owned by an allowlisted program", async () => {
    const [owner] = PublicKey.findProgramAddressSync(
      [Buffer.from("owner")],
      SRS_PROGRAM_ID,
    );
    const allowedProgram = Keypair.generate().publicKey;
    const { record } = getSrsAddresses("domain.sol");
    const { connection } = createConnection(async (address) => {
      if (address.equals(record)) {
        return accountInfo(createSrsRecord({ owner }));
      }
      if (address.equals(owner)) {
        return accountInfo(Buffer.alloc(0), allowedProgram);
      }
      return null;
    });

    await expect(
      resolve(connection, "domain.sol", {
        allowPda: true,
        programIds: [allowedProgram],
      }),
    ).resolves.toEqual(owner);
  });

  test("rejects a PDA owned by a non-allowlisted program", async () => {
    const [owner] = PublicKey.findProgramAddressSync(
      [Buffer.from("owner")],
      SRS_PROGRAM_ID,
    );
    const allowedProgram = Keypair.generate().publicKey;
    const actualProgram = Keypair.generate().publicKey;
    const { record } = getSrsAddresses("domain.sol");
    const { connection } = createConnection(async (address) => {
      if (address.equals(record)) {
        return accountInfo(createSrsRecord({ owner }));
      }
      if (address.equals(owner)) {
        return accountInfo(Buffer.alloc(0), actualProgram);
      }
      return null;
    });

    await expect(
      resolve(connection, "domain.sol", {
        allowPda: true,
        programIds: [allowedProgram],
      }),
    ).rejects.toThrow(PdaOwnerNotAllowed);
  });

  test("rejects a tokenized owner until token resolution is implemented", async () => {
    const { connection } = createConnection(async () =>
      accountInfo(createSrsRecord({ ownerType: 1 })),
    );

    await expect(resolve(connection, "domain.sol")).rejects.toThrow(
      CouldNotFindSrsOwner,
    );
  });

  test("does not route future unsupported TLDs through SRS", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } = createConnection(
      async () => accountInfo(createSrsRecord()),
    );

    await expect(resolve(connection, "domain.xyz")).rejects.toThrow(
      UnsupportedTldError,
    );
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).not.toHaveBeenCalled();
  });
});
