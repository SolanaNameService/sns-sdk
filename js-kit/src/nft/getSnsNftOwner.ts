import {
  Address,
  GetAccountInfoApi,
  GetTokenLargestAccountsApi,
  Rpc,
  SOLANA_ERROR__JSON_RPC__INVALID_PARAMS,
  fetchEncodedAccount,
  isSolanaError,
} from "@solana/kit";

import { tokenCodec } from "../codecs";
import { getSnsNftMint } from "./getSnsNftMint";

interface GetSnsNftOwnerParams {
  rpc: Rpc<GetAccountInfoApi & GetTokenLargestAccountsApi>;
  domainAddress: Address;
}

/**
 * Retrieves the owner of a tokenized SNS domain.
 *
 * @param params NFT owner retrieval parameters
 * @param params.rpc RPC client implementing account and token-largest-account APIs
 * @param params.domainAddress Domain account address whose tokenized owner is retrieved
 * @returns The SNS domain NFT owner address, or `null` when no valid tokenized owner is found.
 */
export const getSnsNftOwner = async ({
  rpc,
  domainAddress,
}: GetSnsNftOwnerParams): Promise<Address | null> => {
  try {
    const mint = await getSnsNftMint({ domainAddress });
    const largestAccounts = await rpc.getTokenLargestAccounts(mint).send();

    if (largestAccounts.value.length === 0) {
      return null;
    }

    const largestAccountInfo = await fetchEncodedAccount(
      rpc,
      largestAccounts.value[0].address
    );

    if (!largestAccountInfo.exists) {
      return null;
    }

    const decoded = tokenCodec.decode(largestAccountInfo.data);
    if (decoded.amount.toString() === "1") {
      return decoded.owner;
    }

    return null;
  } catch (err) {
    if (isSolanaError(err, SOLANA_ERROR__JSON_RPC__INVALID_PARAMS)) {
      return null;
    }
    throw err;
  }
};
