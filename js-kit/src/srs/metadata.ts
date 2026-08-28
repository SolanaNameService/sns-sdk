import {
  Serializer,
  array,
  mapSerializer,
  string,
  struct,
} from "@metaplex-foundation/umi/serializers";

import {
  AdditionalMetadata,
  AdditionalMetadataArgs,
  getAdditionalMetadataSerializer,
} from "./additional-metadata";

/** Token-2022 Metadata Extension-compatible metadata format. */
export type Metadata = {
  name: string;
  symbol: string;
  uri: string;
  additionalMetadata: Array<AdditionalMetadata>;
};

/** Input fields accepted by the Token-2022 metadata serializer. */
export type MetadataArgs = {
  name: string;
  symbol?: string;
  uri: string;
  additionalMetadata: Array<AdditionalMetadataArgs>;
};

/**
 * Creates the serializer for the Token-2022 Metadata extension format used by
 * SRS records.
 *
 * The serializer uses the same wire format as the JS SDK and defaults an
 * omitted symbol to `"SRS"` when encoding metadata.
 *
 * @returns A serializer for encoding and decoding SRS metadata.
 */
export function getMetadataSerializer(): Serializer<MetadataArgs, Metadata> {
  return mapSerializer<MetadataArgs, any, Metadata>(
    struct<Metadata>(
      [
        ["name", string()],
        ["symbol", string()],
        ["uri", string()],
        ["additionalMetadata", array(getAdditionalMetadataSerializer())],
      ],
      { description: "Metadata" }
    ),
    (value) => ({ ...value, symbol: value.symbol ?? "SRS" })
  ) as Serializer<MetadataArgs, Metadata>;
}
