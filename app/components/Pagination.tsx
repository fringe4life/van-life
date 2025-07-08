import { Link } from "react-router";
import { buttonVariants } from "./ui/button";

type PaginationProps = {
  itemsCount: number;
  limit: number;
  page: number;
  typeFilter: string | undefined;
  pathname: string;
};

export default function Pagination({
  itemsCount,
  typeFilter,
  limit,
  page,
  pathname,
}: PaginationProps) {
  const numberOfPages = Math.ceil(itemsCount / limit);
  const listOfLinks = [];

  for (let i = 0; i < numberOfPages; i++) {
    const pageNumber = i + 1;
    const isPage = pageNumber === page;
    listOfLinks.push(
      <Link
        aria-label={`page ${pageNumber}`}
        aria-selected={isPage}
        key={i}
        className={buttonVariants({
          variant: isPage ? "link" : "outline",
        })}
        to={{
          pathname,
          search: `?page=${pageNumber}&limit=${limit}&filter=${
            typeFilter ? typeFilter : ""
          }`,
        }}
      >
        {pageNumber}
      </Link>
    );
  }
  return (
    <section className="flex justify-center gap-6 my-6">{listOfLinks}</section>
  );
}
