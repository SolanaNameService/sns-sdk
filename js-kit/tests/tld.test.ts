import { expect, test } from "@jest/globals";

import { UnsupportedTldError } from "../src/errors";
import { _parseSnsDomain } from "../src/utils/parseSnsDomain";
import {
  SNS_TLD,
  SUPPORTED_TLDS,
  getTld,
  parseSupportedTld,
} from "../src/utils/tld";

test("only SNS is in the default supported TLD set", () => {
  expect(SUPPORTED_TLDS).toStrictEqual([SNS_TLD]);
});

test.each([
  "Example.sns",
  "example.SNS",
  "sub.example.more.sns",
  "example.sol",
])("_parseSnsDomain rejects %s", (domain) => {
  expect(() => _parseSnsDomain(domain)).toThrow();
});

test("_parseSnsDomain accepts canonical top-level and one-level names", () => {
  expect(_parseSnsDomain("example.sns")).toBe("example");
  expect(_parseSnsDomain("sub.example.sns")).toBe("sub.example");
});

test.each([
  { input: "alice.sol", expected: undefined },
  { input: "sub.alice.sol", expected: undefined },
  { input: "alice.sns", expected: SNS_TLD },
  { input: "sub.alice.sns", expected: SNS_TLD },
  { input: "alice", expected: undefined },
  { input: "", expected: undefined },
  { input: "alice.com", expected: undefined },
  { input: "alice.SOL", expected: undefined },
  { input: "alice.SNS", expected: undefined },
  { input: ".sol", expected: undefined },
  { input: ".sns", expected: SNS_TLD },
])("getTld('$input') === $expected", ({ input, expected }) => {
  expect(getTld(input)).toBe(expected);
});

test.each([
  {
    input: "alice.sns",
    expected: ["alice", SNS_TLD],
  },
  {
    input: "sub.alice.sns",
    expected: ["sub.alice", SNS_TLD],
  },
  {
    input: ".sns",
    expected: ["", SNS_TLD],
  },
])("parseSupportedTld('$input')", ({ input, expected }) => {
  expect(parseSupportedTld(input)).toStrictEqual(expected);
});

test.each(["alice.sol", "alice", "", "alice.com", "alice.SOL", "alice.SNS"])(
  "parseSupportedTld('%s') throws UnsupportedTldError",
  (input) => {
    expect(() => parseSupportedTld(input)).toThrow(UnsupportedTldError);
  }
);
