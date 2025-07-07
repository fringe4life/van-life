import { href, Link } from "react-router";
import { buttonVariants } from "./ui/button";

type PaginationProps<T> = {
  itemsCount: number;
  limit: number;
  page: number;
  typeFilter: string | undefined;
  items: T[];
};

export default function Pagination<T>({
  itemsCount,
  items,
  typeFilter,
  limit,
  page,
}: PaginationProps<T>) {
  const hasPagesOfVans = itemsCount > items.length;
  let numberOfPages = 1;
  let listOfLinks = [];
  if (hasPagesOfVans) {
    numberOfPages = Math.ceil(itemsCount / limit);
  }
  for (let i = 0; i < numberOfPages; i++) {
    listOfLinks.push(
      <Link
        key={i}
        className={buttonVariants({
          variant: page === i + 1 ? "link" : "outline",
        })}
        to={{
          pathname: href("/vans"),
          search: `?page=${i + 1}&limit=${limit}&filter=${
            typeFilter ? typeFilter : ""
          }`,
        }}
      >
        {i + 1}
      </Link>
    );
  }
  return <section className="flex justify-center gap-6">{listOfLinks}</section>;
}
