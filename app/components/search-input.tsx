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
import { searchUrlParsers } from "~/lib/parsers";
import { Input } from "./ui/input";

const SearchInput = () => {
  const [urlState, setUrlState] = useQueryStates(searchUrlParsers);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const search = e.currentTarget.value.trim();
    // Send immediate update if clearing the input, otherwise debounce
    startTransition(async () => {
      await setUrlState(
        {
          cursor: DEFAULT_CURSOR,
          direction: DEFAULT_DIRECTION,
          search: search || "",
        },
        {
          limitUrlUpdates:
            search === "" ? defaultRateLimit : debounce(DEFAULT_DEBOUNCE),
        }
      );
    });
  };

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      // Send immediate update on Enter key press
      const search = e.currentTarget.value;
      startTransition(async () => {
        await setUrlState(
          {
            cursor: DEFAULT_CURSOR,
            direction: DEFAULT_DIRECTION,
            search: search || "",
          },
          { limitUrlUpdates: undefined }
        );
      });
    }
  };

  return (
    <Input
      name="search"
      onChange={handleSearch}
      onKeyDown={handleKeyPress}
      placeholder="Modest Explorer"
      type="search"
      value={urlState.search || ""}
    />
  );
};

export { SearchInput };
