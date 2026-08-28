import { describe, expect, test } from "@jest/globals";
import { getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../src/codecs";
import {
  SOL_REGISTRAR_PROGRAM_ADDRESS,
  SOL_SRS_CLASS,
  SRS_CENTRAL_STATE,
  SRS_PROGRAM_ADDRESS,
} from "../src/constants";
import { getSolDomainAddress } from "../src/domain/getSolDomainAddress";
import { getSrsDomainAddress } from "../src/domain/getSrsDomainAddress";
import { uint8ArrayToHex } from "../src/utils/uint8Array/uint8ArrayToHex";

describe("getSolDomainAddress", () => {
  test("precomputed SRS addresses match their canonical derivation", async () => {
    const [centralState] = await getProgramDerivedAddress({
      programAddress: SOL_REGISTRAR_PROGRAM_ADDRESS,
      seeds: [utf8Codec.encode("central_state")],
    });
    const [solClass] = await getProgramDerivedAddress({
      programAddress: SRS_PROGRAM_ADDRESS,
      seeds: [
        utf8Codec.encode("class"),
        addressCodec.encode(centralState),
        utf8Codec.encode(".sol"),
      ],
    });

    expect(centralState).toBe(SRS_CENTRAL_STATE);
    expect(solClass).toBe(SOL_SRS_CLASS);
  });

  test.each([
    {
      domain: "sns-ip-5-wallet-1",
      domainAddress: "5aJnvSs3K5J1eFS1cemYHWnUeWp3QjKThWh5mWbGBgkt",
      hash: "39e1e7284dc5893c35d365931178414c9b64017e5db929e5e318607317972304",
    },
    {
      domain: "sns-ip-5-wallet-2",
      domainAddress: "2gN2aGXi9kRnkXewWsshKTUWairEvMapA3z1EaqFqwMd",
      hash: "e6e08c1d6c566f1795c0aa927b485fc091e888a5d7493892f27887e2fef881c6",
    },
  ])("derives $domain", async ({ domain, domainAddress, hash }) => {
    const result = await getSolDomainAddress({ domain });

    expect(result.domainAddress).toBe(domainAddress);
    expect(uint8ArrayToHex(result.hashed)).toBe(hash);
  });

  test("keeps the previous derivation name as a compatibility alias", async () => {
    await expect(
      getSrsDomainAddress({ domain: "sns-ip-5-wallet-1" })
    ).resolves.toEqual(
      await getSolDomainAddress({ domain: "sns-ip-5-wallet-1" })
    );
  });
});
