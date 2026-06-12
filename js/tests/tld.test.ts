import { expect, test } from "@jest/globals";

import { getTld, SNS_TLD, SOL_TLD } from "../src/utils/tld";

test.each([
  // .sol matches
  { input: "bonfida.sol", expected: SOL_TLD },
  { input: "sub.bonfida.sol", expected: SOL_TLD },
  // .sns matches
  { input: "alice.sns", expected: SNS_TLD },
  { input: "sub.alice.sns", expected: SNS_TLD },
  // bare name — no suffix
  { input: "bonfida", expected: undefined },
  // empty string
  { input: "", expected: undefined },
  // wrong TLD
  { input: "bonfida.com", expected: undefined },
  // pins case-sensitivity: uppercase TLD is not recognised
  { input: "bonfida.SOL", expected: undefined },
  { input: "bonfida.SNS", expected: undefined },
  // TLD alone (edge case: the string IS the suffix)
  { input: ".sol", expected: SOL_TLD },
  { input: ".sns", expected: SNS_TLD },
])("getTld('$input') === $expected", ({ input, expected }) => {
  expect(getTld(input)).toBe(expected);
});
