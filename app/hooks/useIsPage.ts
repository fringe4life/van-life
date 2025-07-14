import { type LinkProps, useLocation } from 'react-router';

export default function useIsPage({ to }: LinkProps) {
	const location = useLocation();

	const isPath = location.pathname === to;
	const isSearch = to.search === location.search;
	const isPage = isSearch && isPath;

	return { isPage };
}
