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

/** Token22 Metadata Extension compatible Metadata format */
export type Metadata = {
  name: string;
  symbol: string;
  uri: string;
  additionalMetadata: Array<AdditionalMetadata>;
};

export type MetadataArgs = {
  name: string;
  symbol?: string;
  uri: string;
  additionalMetadata: Array<AdditionalMetadataArgs>;
};

export function getMetadataSerializer(): Serializer<MetadataArgs, Metadata> {
  return mapSerializer<MetadataArgs, any, Metadata>(
    struct<Metadata>(
      [
        ["name", string()],
        ["symbol", string()],
        ["uri", string()],
        ["additionalMetadata", array(getAdditionalMetadataSerializer())],
      ],
      { description: "Metadata" },
    ),
    (value) => ({ ...value, symbol: value.symbol ?? "SRS" }),
  ) as Serializer<MetadataArgs, Metadata>;
}
