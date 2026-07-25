import { expect, test } from "@jest/globals";

import {
  _parseSnsDomain,
  _parseSnsSubdomain,
  _parseSnsTopLevelDomain,
} from "../src/utils/parseSnsDomain";
import {
  getTld,
  parseSnsTld,
  parseSupportedTld,
  SNS_TLD,
  SOL_TLD,
} from "../src/utils/tld";
import { UnsupportedTldError } from "../src/error";

test.each([
  // .sol matches
  { input: "parent.sol", expected: SOL_TLD },
  { input: "sub.parent.sol", expected: SOL_TLD },
  // .sns matches
  { input: "alice.sns", expected: SNS_TLD },
  { input: "sub.alice.sns", expected: SNS_TLD },
  // bare name — no suffix
  { input: "parent", expected: undefined },
  // empty string
  { input: "", expected: undefined },
  // wrong TLD
  { input: "parent.com", expected: undefined },
  // pins case-sensitivity: uppercase TLD is not recognised
  { input: "parent.SOL", expected: undefined },
  { input: "parent.SNS", expected: undefined },
  // TLD alone (edge case: the string IS the suffix)
  { input: ".sol", expected: SOL_TLD },
  { input: ".sns", expected: SNS_TLD },
])("getTld('$input') === $expected", ({ input, expected }) => {
  expect(getTld(input)).toBe(expected);
});

test.each([
  ["parent.sns", ["parent", SNS_TLD]],
  ["sub.parent.sns", ["sub.parent", SNS_TLD]],
  ["parent.sol", ["parent", SOL_TLD]],
  ["sub.parent.sol", ["sub.parent", SOL_TLD]],
])("parseSupportedTld(%s)", (input, expected) => {
  expect(parseSupportedTld(input)).toEqual(expected);
});

test.each(["parent", "parent.com", "parent.SNS", "parent.SOL"])(
  "parseSupportedTld rejects %s",
  (input) => {
    expect(() => parseSupportedTld(input)).toThrow(UnsupportedTldError);
  },
);

test("parseSupportedTld rejects unsupported TLD when restricted", () => {
  expect(() => parseSupportedTld("parent.sol", [SNS_TLD])).toThrow(
    UnsupportedTldError,
  );
});

test.each([
  ["parent.sns", ["parent", SNS_TLD]],
  ["sub.parent.sns", ["sub.parent", SNS_TLD]],
])("parseSnsTld(%s)", (input, expected) => {
  expect(parseSnsTld(input)).toEqual(expected);
});

test.each(["parent", "parent.sol", "parent.com", "parent.SNS"])(
  "parseSnsTld rejects %s",
  (input) => {
    expect(() => parseSnsTld(input)).toThrow(UnsupportedTldError);
  },
);

test.each([["parent.sns", "parent"]])(
  "_parseSnsTopLevelDomain(%s)",
  (input, expected) => {
    expect(_parseSnsTopLevelDomain(input)).toBe(expected);
  },
);

test.each([
  "parent.sol",
  "Parent.sns",
  "parent.SNS",
  "parent.sns ",
  " parent.sns",
  "sub.parent.sns",
  ".sns",
  "parent..sns",
])("_parseSnsTopLevelDomain rejects %s", (input) => {
  expect(() => _parseSnsTopLevelDomain(input)).toThrow();
});

test.each([["sub.parent.sns", ["sub", "parent"]]])(
  "_parseSnsSubdomain(%s)",
  (input, expected) => {
    expect(_parseSnsSubdomain(input)).toEqual(expected);
  },
);

test.each([
  "parent.sns",
  "sub.parent.sol",
  "Sub.parent.sns",
  "sub..sns",
  "sub.parent.extra.sns",
])("_parseSnsSubdomain rejects %s", (input) => {
  expect(() => _parseSnsSubdomain(input)).toThrow();
});

test.each([
  ["parent.sns", "parent"],
  ["sub.parent.sns", "sub.parent"],
])("_parseSnsDomain(%s)", (input, expected) => {
  expect(_parseSnsDomain(input)).toBe(expected);
});

test.each(["parent.sol", "Parent.sns", "sub.parent.extra.sns", "sub..sns"])(
  "_parseSnsDomain rejects %s",
  (input) => {
    expect(() => _parseSnsDomain(input)).toThrow();
  },
);
