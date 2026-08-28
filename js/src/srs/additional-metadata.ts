import {
  Serializer,
  string,
  struct,
} from "@metaplex-foundation/umi/serializers";

/** Additional metadata for Token22 Metadata Extension compatible Metadata format */
export type AdditionalMetadata = { label: string; value: string };

export type AdditionalMetadataArgs = AdditionalMetadata;

export function getAdditionalMetadataSerializer(): Serializer<
  AdditionalMetadataArgs,
  AdditionalMetadata
> {
  return struct<AdditionalMetadata>(
    [
      ["label", string()],
      ["value", string()],
    ],
    { description: "AdditionalMetadata" },
  ) as Serializer<AdditionalMetadataArgs, AdditionalMetadata>;
}
