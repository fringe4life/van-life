import { useOutletContext } from "react-router";
import type { Van } from "~/generated/prisma/client";

export default function VanDetailPhotos() {
  const van = useOutletContext<Van>();
  return <img src={van.imageUrl} alt={van.name} width={100} height={100} />;
}
