import { UnsupportedTldError } from "../error";

export const unsupportedTld = () =>
  new UnsupportedTldError("Domain has an unsupported TLD suffix");
