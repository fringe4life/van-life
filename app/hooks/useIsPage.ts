import { type LinkProps, useLocation, useResolvedPath } from 'react-router';

/**
 * Custom hook to determine if the current location matches the given 'to' prop.
 *
 * Uses useResolvedPath to properly handle both string and object 'to' props.
 * If the resolved path includes search parameters, both pathname and search must match.
 * If the resolved path does not include search parameters, only pathname must match.
 *
 * @param {LinkProps} param0 - The link props containing the 'to' destination.
 * @returns {{ isPage: boolean }} - Whether the current location matches the 'to' prop.
 */
export default function useIsPage({ to }: LinkProps) {
	const location = useLocation();
	const resolved = useResolvedPath(to);

	const isPath = location.pathname === resolved.pathname;
	const hasSearch = Boolean(resolved.search && resolved.search !== '');
	const isSearch = hasSearch ? resolved.search === location.search : true;
	const isPage = isPath && isSearch;

	return { isPage };
}
