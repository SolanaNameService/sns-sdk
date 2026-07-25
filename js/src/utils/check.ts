import { SNSError } from "../error";

/**
 * Throws `error` unless `bool` is true, preserving its concrete SNS error type.
 *
 * @param bool Condition that must be true
 * @param error Error to throw when `bool` is false
 * @throws The supplied error when `bool` is false
 *
 * @example
 * ```ts
 * check(value !== undefined, new InvalidInputError("A value is required"));
 * ```
 */
export const check = <T extends SNSError>(bool: boolean, error: T) => {
  if (!bool) {
    throw error;
  }
};
