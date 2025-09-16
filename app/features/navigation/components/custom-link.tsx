import { Link, type LinkProps } from 'react-router';
import useIsPage from '~/hooks/use-is-page';

export default function CustomLink({
	children,
	to,
	className,
	...rest
}: Omit<LinkProps, 'style'>) {
	const { isPage } = useIsPage({ to });
	return (
		<Link
			className={`hover:underline ${className}`}
			to={to}
			{...rest}
			prefetch="intent"
			style={{
				pointerEvents: isPage ? 'none' : 'auto',
			}}
			viewTransition
		>
			{children}
		</Link>
	);
}
