import { useOutletContext } from "react-router";
import type { Route } from "./+types/vanDetailPricing";
import { displayPrice } from "~/utils/displayPrice";
import type { Van } from "@prisma/client";

export default function VanDetailPricing({}: Route.ComponentProps) {
  const van = useOutletContext<Van>();
  return <p className="my-6">{displayPrice(van.price)}/day</p>;
}
