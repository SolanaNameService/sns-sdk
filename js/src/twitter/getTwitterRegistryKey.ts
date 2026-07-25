import { PublicKey } from "@solana/web3.js";
import { TWITTER_ROOT_PARENT_REGISTRY_KEY } from "../constants";
import { getHashedNameSync } from "../utils/getHashedNameSync";
import { getNameAccountKeySync } from "../utils/getNameAccountKeySync";

/**
 * Derives the user-facing name registry key for a Twitter handle.
 *
 * @param twitter_handle Twitter handle without the `@` prefix
 * @returns Derived Twitter name-registry account public key
 *
 * @example
 * ```ts
 * const key = await getTwitterRegistryKey("bonfida");
 * ```
 */
export async function getTwitterRegistryKey(
  twitter_handle: string,
): Promise<PublicKey> {
  const hashedTwitterHandle = getHashedNameSync(twitter_handle);
  return getNameAccountKeySync(
    hashedTwitterHandle,
    undefined,
    TWITTER_ROOT_PARENT_REGISTRY_KEY,
  );
}
