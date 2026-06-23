import { expect, test } from "@jest/globals";

import {
  _parseSnsDomain,
  _parseSnsSubdomain,
  _parseSnsTopLevelDomain,
} from "../src/utils/parseSnsDomain";
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

test.each([
  ["bonfida.sns", "bonfida"],
])("_parseSnsTopLevelDomain(%s)", (input, expected) => {
  expect(_parseSnsTopLevelDomain(input)).toBe(expected);
});

test.each([
  "bonfida.sol",
  "Bonfida.sns",
  "bonfida.SNS",
  "bonfida.sns ",
  " bonfida.sns",
  "sub.bonfida.sns",
  ".sns",
  "bonfida..sns",
])("_parseSnsTopLevelDomain rejects %s", (input) => {
  expect(() => _parseSnsTopLevelDomain(input)).toThrow();
});

test.each([
  ["sub.bonfida.sns", ["sub", "bonfida"]],
])("_parseSnsSubdomain(%s)", (input, expected) => {
  expect(_parseSnsSubdomain(input)).toEqual(expected);
});

test.each([
  "bonfida.sns",
  "sub.bonfida.sol",
  "Sub.bonfida.sns",
  "sub..sns",
  "sub.parent.extra.sns",
])("_parseSnsSubdomain rejects %s", (input) => {
  expect(() => _parseSnsSubdomain(input)).toThrow();
});

test.each([
  ["bonfida.sns", "bonfida"],
  ["sub.bonfida.sns", "sub.bonfida"],
])("_parseSnsDomain(%s)", (input, expected) => {
  expect(_parseSnsDomain(input)).toBe(expected);
});

test.each([
  "bonfida.sol",
  "Bonfida.sns",
  "sub.parent.extra.sns",
  "sub..sns",
])("_parseSnsDomain rejects %s", (input) => {
  expect(() => _parseSnsDomain(input)).toThrow();
});
