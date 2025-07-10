const formatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

export function displayPrice(price: number) {
  if (!price) return "$0.00";

  return formatter.format(price);
}
