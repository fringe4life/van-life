import type{ Decimal } from "~/generated/prisma/internal/prismaNamespace";
const formatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

export function displayPrice(price: Decimal) {
  if (!price) return "$0.00";
  const numPriceDollars = price.toNumber();

  return formatter.format(numPriceDollars);
}
