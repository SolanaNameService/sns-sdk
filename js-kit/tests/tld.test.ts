import { expect, test } from "@jest/globals";

import { UnsupportedTldError } from "../src/errors";
import { getTld, parseSupportedTld, SNS_TLD, SOL_TLD } from "../src/utils/tld";

test.each([
  { input: "bonfida.sol", expected: SOL_TLD },
  { input: "sub.bonfida.sol", expected: SOL_TLD },
  { input: "alice.sns", expected: SNS_TLD },
  { input: "sub.alice.sns", expected: SNS_TLD },
  { input: "bonfida", expected: undefined },
  { input: "", expected: undefined },
  { input: "bonfida.com", expected: undefined },
  { input: "bonfida.SOL", expected: undefined },
  { input: "bonfida.SNS", expected: undefined },
  { input: ".sol", expected: SOL_TLD },
  { input: ".sns", expected: SNS_TLD },
])("getTld('$input') === $expected", ({ input, expected }) => {
  expect(getTld(input)).toBe(expected);
});

test.each([
  {
    input: "bonfida.sol",
    expected: ["bonfida", SOL_TLD],
  },
  {
    input: "sub.bonfida.sol",
    expected: ["sub.bonfida", SOL_TLD],
  },
  {
    input: "alice.sns",
    expected: ["alice", SNS_TLD],
  },
  {
    input: "sub.alice.sns",
    expected: ["sub.alice", SNS_TLD],
  },
  {
    input: ".sol",
    expected: ["", SOL_TLD],
  },
  {
    input: ".sns",
    expected: ["", SNS_TLD],
  },
])("parseSupportedTld('$input')", ({ input, expected }) => {
  expect(parseSupportedTld(input)).toStrictEqual(expected);
});

test.each(["bonfida", "", "bonfida.com", "bonfida.SOL", "bonfida.SNS"])(
  "parseSupportedTld('%s') throws UnsupportedTldError",
  (input) => {
    expect(() => parseSupportedTld(input)).toThrow(UnsupportedTldError);
  }
);
