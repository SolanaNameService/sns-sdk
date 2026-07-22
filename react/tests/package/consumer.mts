import type { Connection, PublicKey } from "@solana/web3.js";
import {
  useResolve,
  usePrimaryDomain,
  useProfilePic,
  useRecords,
  useReverseLookup,
  useSnsDomainsForOwner,
  useSubdomains,
  type Options,
} from "@bonfida/sns-react";

declare const connection: Connection;
declare const publicKey: PublicKey;
declare const options: Options<PublicKey, string>;

const selectedOwner = useResolve(connection, "example.sns", options);
const selectedRecords = useRecords(
  connection,
  "example.sns",
  [],
  { deserialize: true },
  { select: (records) => records.filter(Boolean).length },
);
const owner: string | undefined = selectedOwner.data;
const recordCount: number | undefined = selectedRecords.data;

void [
  owner,
  recordCount,
  usePrimaryDomain,
  useProfilePic,
  useReverseLookup,
  useSnsDomainsForOwner,
  useSubdomains,
  publicKey,
];
