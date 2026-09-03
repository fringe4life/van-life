import { debounce, defaultRateLimit, useQueryStates } from "nuqs";
import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  startTransition,
} from "react";
import { DEFAULT_DEBOUNCE } from "~/constants/constants";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
} from "~/features/pagination/pagination-constants";
import { searchUrlParsers } from "~/features/pagination/parsers";
import { Input } from "./ui/input";

const SearchInput = () => {
  const [urlState, setUrlState] = useQueryStates(searchUrlParsers);

  const startSearch = (
    searchString: string,
    debounceMS: typeof defaultRateLimit
  ) => {
    startTransition(async () => {
      await setUrlState(
        {
          cursor: DEFAULT_CURSOR,
          direction: DEFAULT_DIRECTION,
          search: searchString,
        },
        {
          limitUrlUpdates: debounceMS,
        }
      );
    });
  };

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const search = e.currentTarget.value.trim().toLowerCase() || "";
    const isEmpty = search === "";
    // Send immediate update if clearing the input, otherwise debounce
    const debounceTime = isEmpty
      ? defaultRateLimit
      : debounce(DEFAULT_DEBOUNCE);
    startSearch(search, debounceTime);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      // Send immediate update on Enter key press
      const search = e.currentTarget.value.trim().toLowerCase() || "";
      startSearch(search, defaultRateLimit);
    }
  };

  return (
    <Input
      aria-label="Search vans"
      name="search"
      onChange={handleSearch}
      onKeyDown={handleKeyDown}
      placeholder="Modest Explorer"
      type="search"
      value={urlState.search}
    />
  );
};

export { SearchInput };
