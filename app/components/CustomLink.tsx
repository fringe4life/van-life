import { Link, type LinkProps, useLocation } from 'react-router';

export default function CustomLink({
	children,
	to,
	...rest
}: Omit<LinkProps, 'style'>) {
	const location = useLocation();
	const isPage = location.pathname === to.toString();
	return (
		<Link
			to={to}
			{...rest}
			viewTransition
			prefetch="viewport"
			style={{
				pointerEvents: isPage ? 'none' : 'auto',
			}}
		>
			{children}
		</Link>
	);
}
