import { NavLink, useSearchParams } from "react-router";
import useIsNavigating from "~/hooks/useIsNavigating";
import { getParamsClientSide } from "~/utils/getParamsClientSide";
import GenericComponent, {
  type GenericComponentProps,
} from "~/components/Container";
import clsx from "clsx";
import Pagination from "~/components/Pagination";
import type { ListItemProps } from "./ListItems";
import type { VanType } from "@prisma/client";
import ListItems from "./ListItems";

type HostVanPages = {
  variant: "host";
};

type VansPages<U> = {
  variant: "vans";
  listItem: ListItemProps<U>;
};

type VanPagesProps<T, P, U> = (HostVanPages | VansPages<U>) & {
  title: string;
  path: string;
  itemsCount: number;
} & GenericComponentProps<T, P>;

export default function VanPages<P, T, U>(props: VanPagesProps<T, P, U>) {
  const {
    path,
    items,
    itemsCount,
    title,
    Component,
    renderKey,
    renderProps,
    variant,
  } = props;
  // TODO: consider passing in this information
  const [searchParams] = useSearchParams();
  const { page, limit, type: typeFilter } = getParamsClientSide(searchParams);

  const { changingPage } = useIsNavigating();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-5.75 text-balance">{title}</h2>
      {variant === "vans" && (
        <p className="flex justify-between md:justify-start md:gap-6 mb-6">
          {
            <ListItems
              items={props.listItem.items}
              getKey={props.listItem.getKey}
              getRow={props.listItem.getRow}
            />
          }
          <NavLink to={path} className={(isActive) => isActive && "underline"}>
            Clear ilters
          </NavLink>
        </p>
      )}
      <GenericComponent
        className={clsx({
          "grid-max grid-max-medium mt-6": true,
          "opacity-75": changingPage,
        })}
        Component={Component}
        items={items}
        renderKey={renderKey}
        renderProps={renderProps}
      />
      <Pagination
        pathname={path}
        itemsCount={itemsCount}
        limit={limit}
        page={page}
        typeFilter={typeFilter}
      />
    </section>
  );
}
