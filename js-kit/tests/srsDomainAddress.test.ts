import { describe, expect, test } from "@jest/globals";
import { getProgramDerivedAddress } from "@solana/kit";

import { addressCodec, utf8Codec } from "../src/codecs";
import {
  SOL_REGISTRAR_PROGRAM_ADDRESS,
  SRS_PROGRAM_ADDRESS,
} from "../src/config";
import { SOL_SRS_CLASS, SRS_CENTRAL_STATE } from "../src/constants/addresses";
import { getSrsDomainAddress } from "../src/domain/getSrsDomainAddress";
import { uint8ArrayToHex } from "../src/utils/uint8Array/uint8ArrayToHex";

describe("getSrsDomainAddress", () => {
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
      domain: "example",
      domainAddress: "BtnBwXquD42ehaVbfJQdmoFeB6kS3aooPzhfQmH4FM2N",
      hash: "5b96a5f79408e4401cdc30fb60f37cffecabc23b16d26b80169e6fb8a0df02dc",
    },
    {
      domain: "sub.example",
      domainAddress: "9KM3Le7YRzJY3sn6gk7RsBZsEsViTRc4wb8boszLEuk7",
      hash: "87f20401c8a32a2417a22e2b29ccbe2a8fa8cbd2686a073b40bd27b55b740c6b",
    },
  ])("derives $domain", async ({ domain, domainAddress, hash }) => {
    const result = await getSrsDomainAddress({ domain });

    expect(result.domainAddress).toBe(domainAddress);
    expect(uint8ArrayToHex(result.hashed)).toBe(hash);
  });
});
