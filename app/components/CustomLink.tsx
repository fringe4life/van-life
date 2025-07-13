import { Link, type LinkProps } from 'react-router';

type CustomLinkProps = LinkProps;

export default function CustomLink({ children, to, ...rest }: CustomLinkProps) {
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
