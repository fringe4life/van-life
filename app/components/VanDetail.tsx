import { Badge } from "lucide-react";
import { cn } from "~/lib/utils";
import { badgeVariants } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import type { Van } from "~/generated/prisma/client";

export default function VanDetail({
  imageUrl,
  description,
  type,
  name,
  price,
}: Van) {
  return (
    <div className="@container/card-full">
      <Card className="@max-2xl/card-full:grid @max-2xl/card-full:grid-rows-[4fr_repeat(4,_auto)_auto] @max-2xl:/card-full:gap-4  @max-2xl/card-full:bg-green-500  @max-7xl/card-full:bg-indigo-500">
        <CardHeader>
          <img src={imageUrl} alt={description} />
        </CardHeader>
        <CardContent className=" @max-2xl/card-full:rows-span-4  @max-2xl/card-full:grid-rows-subgrid @max-2xl/card-full:row-start-2  @max-2xl/card-full:align-between">
          <Badge color={type} className="">
            {type}
          </Badge>
          <CardTitle className="">{name}</CardTitle>
          <p>{price}</p>
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="">
          <Button
            className={cn(
              badgeVariants({ variant: "SIMPLE" }),
              "@max-lg/card-full:w-full"
            )}
          >
            Rent this van
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
