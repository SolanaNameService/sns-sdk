import { getSolDomainAddress } from "./getSolDomainAddress";
import type {
  GetSolDomainAddressParams,
  GetSolDomainAddressResult,
} from "./getSolDomainAddress";

/** @deprecated Use `GetSolDomainAddressParams` instead. */
export type GetSrsDomainAddressParams = GetSolDomainAddressParams;

/** @deprecated Use `GetSolDomainAddressResult` instead. */
export type GetSrsDomainAddressResult = GetSolDomainAddressResult;

/**
 * Derives the canonical SRS record address for a TLD-trimmed `.sol` name.
 *
 * @deprecated Use {@link getSolDomainAddress} instead.
 * @param params Derivation parameters
 * @param params.domain TLD-trimmed `.sol` domain name
 * @returns The SRS record address and canonical name hash.
 *
 * @example
 * ```ts
 * const derived = await getSrsDomainAddress({ domain: "example" });
 * ```
 */
export const getSrsDomainAddress = getSolDomainAddress;
