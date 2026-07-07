import splitGraphemes from "graphemesplit";

/**
 * Retrieves the domain registration price in USD from a domain name.
 *
 * @param name Domain name without suffix
 * @returns Registration price in USD.
 */
export const getDomainPriceFromName = (name: string) => {
  const split = splitGraphemes(name);

  switch (split.length) {
    case 1:
      return 750;
    case 2:
      return 700;
    case 3:
      return 640;
    case 4:
      return 160;
    default:
      return 20;
  }
};
