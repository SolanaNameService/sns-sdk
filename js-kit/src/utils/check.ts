import { SNSError } from "../errors";

/**
 * Internal assertion helper that throws the provided error when a condition is false.
 *
 * @template T Type of error to throw
 * @param bool Boolean condition to check
 * @param error Error to throw when the condition is false
 * @throws The provided error if the condition is false.
 */
export const _check = <T extends SNSError>(bool: boolean, error: T) => {
  if (!bool) {
    throw error;
  }
};
