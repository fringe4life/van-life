import { Badge } from "~/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProgressiveImage } from "~/features/image/component/progressive-image";
import { VAN_CARD_IMG_SIZES } from "~/features/image/img-constants";
import { createWebPSrcSet } from "~/features/image/utils/create-optimized-src-set";
import { listImagePriorityProps } from "~/features/image/utils/list-image-priority-props";
import { CustomLink } from "~/features/navigation/components/custom-link";
import type { VanCardProps } from "~/features/vans/types";
import { toLowercaseVanType } from "~/features/vans/utils/validators";
import { lowercaseVanState } from "~/features/vans/utils/van-state-helpers";
import { VanBadge } from "./van-badge";
import { vanCard } from "./van-card-recipe";

const VanCard = ({
  van,
  link,
  action,
  imageIndex = 0,
  linkCoversCard = true,
  state,
}: VanCardProps) => {
  const { type, name, description, imageUrl } = van;

  const srcSet = createWebPSrcSet(imageUrl, {
    aspectRatio: "1:1",
    sizes: VAN_CARD_IMG_SIZES,
  });

  return (
    <div className="@container/card xs:scroll-sm scroll-md md:scroll-lg contain-content contain-inline-size [contain-intrinsic-size:auto_300px_auto_200px] [content-visibility:auto]">
      <Card
        className={vanCard({
          className:
            "relative grid @min-md/card:grid-cols-[200px_1fr_min-content] @min-md/card:grid-rows-2 @min-md/card:gap-4",
          state: lowercaseVanState(van),
        })}
        style={{ viewTransitionName: `card-${van.id}` }}
      >
        <CardHeader className="relative @min-md/card:col-start-1 @min-md/card:row-span-2">
          <VanBadge van={van} />
          <ProgressiveImage
            alt={description}
            className="aspect-square w-full rounded-md"
            height="200"
            key={imageUrl}
            sizes="(max-width: 300px) 250px, (max-width: 400px) 300px, 350px"
            src={imageUrl}
            srcSet={srcSet}
            width="200"
            {...listImagePriorityProps(imageIndex)}
          />
        </CardHeader>
        <CardFooter className="@min-md/card:col-span-2 @min-md/card:col-start-2 @min-md/card:row-span-2 grid-cols-subgrid grid-rows-subgrid @min-md/card:content-center">
          <CardTitle className="@min-md/card:col-start-2 @min-md/card:row-end-2 @min-md/card:self-start text-2xl">
            <CustomLink state={state} title={name} to={link}>
              {name}
              <span
                className="link-covers-card:absolute link-covers-card:inset-0 link-covers-card:h-full link-covers-card:w-full link-covers-card:overflow-hidden"
                data-link-covers-card={linkCoversCard}
              />
            </CustomLink>
          </CardTitle>
          {action}
          <Badge
            className="@min-md/card:-row-end-1"
            variant={toLowercaseVanType(type)}
          >
            {type}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
};

export { VanCard };
