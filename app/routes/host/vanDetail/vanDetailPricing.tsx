import { useOutletContext } from "react-router";
import type { Route } from "./+types/vanDetailPricing";
import type { Van } from "~/generated/prisma/client";

export default function VanDetailPricing({}: Route.ComponentProps) {
  const data = useOutletContext<Van>();
  console.log({ data });
  return <p>pricing</p>;
}
