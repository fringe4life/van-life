import { useOutletContext } from "react-router";
import type { Route } from "./+types/vanDetailPricing";
import type { Van } from "~/generated/prisma/client";
import { displayPrice } from "~/lib/displayPrice";

export default function VanDetailPricing({}: Route.ComponentProps) {
  const van = useOutletContext<Van>();
  return <p className="my-6">{displayPrice(van.price)}/day</p>;
}
