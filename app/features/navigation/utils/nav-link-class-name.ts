import type { NavLinkClassNameProps } from '~/features/navigation/types';

// Utility for CustomNavLink className
export const navLinkClassName = ({
	isActive,
	isPending,
}: NavLinkClassNameProps) =>
	[
		'flex items-center gap-2 transition-colors duration-250 px-2 py-1 rounded hover:bg-orange-400 hover:text-white',
		isPending ? 'text-green-500' : '',
		isActive && !isPending ? 'underline' : '',
	]
		.filter(Boolean)
		.join(' ');
