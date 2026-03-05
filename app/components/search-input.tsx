import { debounce, defaultRateLimit, useQueryStates } from 'nuqs';
import {
	type ChangeEventHandler,
	type KeyboardEventHandler,
	startTransition,
} from 'react';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
} from '~/features/pagination/pagination-constants';
import { paginationParsers, searchParser } from '~/lib/parsers';
import { Input } from './ui/input';

// Constants for debounce timing
const SEARCH_DEBOUNCE_DELAY = 250; // milliseconds

const SearchInput = () => {
	const [query, setQuery] = useQueryStates(searchParser);
	const [, setSearchParams] = useQueryStates(paginationParsers);

	const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
		const search = e.currentTarget.value.trim();
		// Send immediate update if clearing the input, otherwise debounce
		startTransition(async () => {
			await setQuery(
				{ search: search || '' },
				{
					limitUrlUpdates:
						search === '' ? defaultRateLimit : debounce(SEARCH_DEBOUNCE_DELAY),
				}
			);
			// Reset cursor and direction when search changes
			startTransition(async () => {
				await setSearchParams({
					cursor: DEFAULT_CURSOR,
					direction: DEFAULT_DIRECTION,
				});
			});
		});
	};

	const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			// Send immediate update on Enter key press
			const search = e.currentTarget.value;
			startTransition(async () => {
				await setQuery(
					{ search: search || '' },
					{ limitUrlUpdates: undefined }
				);
				// Reset cursor and direction when search changes
				startTransition(async () => {
					await setSearchParams({
						cursor: DEFAULT_CURSOR,
						direction: DEFAULT_DIRECTION,
					});
				});
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
			value={query.search || ''}
		/>
	);
};

export { SearchInput };
