import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";

/** Program ID for the SNS name-tokenizer program. */
export const NAME_TOKENIZER_ID = new PublicKey(
  "nftD3vbNkNqfj2Sd3HZwbpw4BxxKWr4AjGb9X38JeZk",
);

/** PDA seed prefix for tokenized SNS domain mints. */
export const MINT_PREFIX = Buffer.from("tokenized_name");
