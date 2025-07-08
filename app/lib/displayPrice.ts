import type { Decimal } from "~/generated/prisma/internal/prismaNamespace";

export function displayPrice(price: Decimal | number) {
  const numPriceDollars = typeof price !== "number" ? price?.toNumber() : price;

  const formatter = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(numPriceDollars);
}
