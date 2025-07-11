import type { Van } from "@prisma/client";
import { useOutletContext } from "react-router";


export default function VanDetailPhotos() {
  const van = useOutletContext<Van>();
  return <img src={van.imageUrl} alt={van.name} width={100} height={100} />;
}
