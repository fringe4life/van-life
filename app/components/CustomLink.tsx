import { Link, type LinkProps, useLocation } from 'react-router';

type CustomLinkProps = LinkProps;

export default function CustomLink({ children, to, ...rest }: CustomLinkProps) {
	const location = useLocation();
	const isPage = location.pathname === to;
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
