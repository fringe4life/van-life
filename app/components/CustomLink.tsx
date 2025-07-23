import { Link, type LinkProps } from 'react-router';
import useIsPage from '~/hooks/useIsPage';

export default function CustomLink({
	children,
	to,
	className,
	...rest
}: Omit<LinkProps, 'style'>) {
	const { isPage } = useIsPage({ to });
	return (
		<Link
			to={to}
			className={`hover:underline ${className}`}
			{...rest}
			viewTransition
			style={{
				pointerEvents: isPage ? 'none' : 'auto',
			}}
		>
			{children}
		</Link>
	);
}
