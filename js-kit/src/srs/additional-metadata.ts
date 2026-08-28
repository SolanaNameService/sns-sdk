import {
  Serializer,
  string,
  struct,
} from "@metaplex-foundation/umi/serializers";

/** Additional metadata for the Token-2022 Metadata Extension format. */
export type AdditionalMetadata = { label: string; value: string };

/** Input fields accepted by the additional metadata serializer. */
export type AdditionalMetadataArgs = AdditionalMetadata;

/**
 * Creates the serializer for one Token-2022 additional metadata entry.
 *
 * @returns A serializer for encoding and decoding additional metadata entries.
 */
export function getAdditionalMetadataSerializer(): Serializer<
  AdditionalMetadataArgs,
  AdditionalMetadata
> {
  return struct<AdditionalMetadata>(
    [
      ["label", string()],
      ["value", string()],
    ],
    { description: "AdditionalMetadata" }
  ) as Serializer<AdditionalMetadataArgs, AdditionalMetadata>;
}
