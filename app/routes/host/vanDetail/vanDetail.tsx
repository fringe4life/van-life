import { useOutletContext } from "react-router";

import type { Route } from "./+types/vanDetail";
import { capitalize } from "~/utils/utils";
import type { Van } from "@prisma/client";

export default function VanDetail({}: Route.ComponentProps) {
  const van = useOutletContext<Van>();
  return (
    <article>
      <p className="font-bold">
        Name: <span className="font-normal">{van.name}</span>
      </p>
      <p className="font-bold my-4">
        Category: <span className="font-normal">{capitalize(van.type)}</span>
      </p>
      <p className="font-bold min-w-full max-w-3xs">
        Description: <span className="font-normal">{van.description}</span>
      </p>
    </article>
  );
}
