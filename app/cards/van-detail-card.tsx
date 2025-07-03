import { href, NavLink } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Van } from "~/generated/prisma/client";

type VanDetailCardProps = {
  van: Van;
  children: React.ReactElement;
};

export default function VanDetailCard({
  van: { imageUrl, id: vanId, price, name, type },
  children,
}: VanDetailCardProps) {
  return (
    <Card>
      <div>
        <img src={imageUrl} alt={name} />
      </div>
      <CardHeader>
        <Badge variant={type} />
        <CardTitle>{name}</CardTitle>
        <p>{price}</p>
        <div className="flex gap-6 ">
          <NavLink to={href("/host/vans/:vanId", { vanId })} end>
            Details
          </NavLink>
          <NavLink to={href("/host/vans/:vanId/pricing", { vanId })}>
            Pricing
          </NavLink>
          <NavLink to={href("/host/vans/:vanId/photos", { vanId })}>
            Photos
          </NavLink>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
