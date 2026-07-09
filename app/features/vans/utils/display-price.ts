import type { Maybe } from "~/types";

const formatter = new Intl.NumberFormat("en-us", {
  currency: "USD",
  style: "currency",
});

/**
 * @abstract used to display price information to visitors
 * @param price the price of the item
 * @returns a string representation to be shown to users
 */
export function displayPrice(price: Maybe<number>): string {
  if (!price) {
    return "$0.00";
  }
  return formatter.format(price);
}
