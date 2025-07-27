import { type LinkProps, useLocation, useResolvedPath } from 'react-router';

/**
 * Custom hook to determine if the current location matches the given 'to' prop.
 *
 * Uses useResolvedPath to properly handle both string and object 'to' props.
 * If the resolved path includes search parameters, both pathname and search must match.
 * If the resolved path does not include search parameters, only pathname must match AND
 * the current location must also have no search parameters.
 *
 * @param {LinkProps} param0 - The link props containing the 'to' destination.
 * @returns {{ isPage: boolean }} - Whether the current location matches the 'to' prop.
 */
export default function useIsPage({ to }: LinkProps) {
	const location = useLocation();
	const resolved = useResolvedPath(to);

	const isPath = location.pathname === resolved.pathname;
	const resolvedHasSearch = Boolean(resolved.search && resolved.search !== '');
	const locationHasSearch = Boolean(location.search && location.search !== '');

	// If resolved path has search params, both pathname and search must match
	// If resolved path has no search params, pathname must match AND current location must also have no search params
	const isSearch = resolvedHasSearch
		? resolved.search === location.search
		: !locationHasSearch;

	const isPage = isPath && isSearch;

	return { isPage };
}
