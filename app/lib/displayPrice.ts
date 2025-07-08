import type { Decimal } from "~/generated/prisma/internal/prismaNamespace";
const formatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

export function displayPrice(price: Decimal | number | null | undefined) {
  if (!price) return "$0.00";
  const numPriceDollars = typeof price !== "number" ? price.toNumber() : price;


  return formatter.format(numPriceDollars);
}
