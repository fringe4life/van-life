import { Menu, X } from 'lucide-react';
import { href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import { Button } from '~/components/ui/button';
import { useSheetDialog } from '~/features/navigation/hooks/use-sheet-dialog';
import {
	type NavItemType,
	toMobileNavItems,
} from '../utils/create-mobile-nav-items';
import { getNavItems } from '../utils/get-nav-items';
import CustomLink from './custom-link';
import NavItem from './nav-item';

type NavProps = {
	hasToken: boolean;
};

export default function Nav({ hasToken }: NavProps) {
	const navItems = getNavItems(hasToken);

	const [getTrigger, mobileDialog] = useSheetDialog({
		title: 'Mobile navigation',
		trigger: (isOpen) => (
			<Button
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
				className="relative z-[60] cursor-pointer bg-orange-400/50 md:hidden"
			>
				{isOpen ? <X /> : <Menu />}
			</Button>
		),
		renderContent: (close) => {
			const mobileNavItems: NavItemType[] = toMobileNavItems(navItems, close);

			return (
				<GenericComponent
					as="ul"
					Component={NavItem}
					className="grid h-full place-content-center gap-4 text-2xl"
					emptyStateMessage="No nav items"
					items={mobileNavItems}
					renderKey={(item) => item.key}
					renderProps={(item) => ({
						Component: item.Component,
						props: item.props,
						children: item.children,
					})}
				/>
			);
		},
		className:
			'fixed top-0 right-0 z-50 flex h-dvh w-[var(--mobile-menu-width)] flex-col bg-orange-50 p-6 shadow-lg md:hidden',
	});

	return (
		<header className="flex items-center justify-between gap-3 px-[var(--padding-inline)] py-9 sm:gap-6">
			<h1 className="font-black text-xl xs:text-2xl uppercase">
				<CustomLink to={href('/')}>#vanlife</CustomLink>
			</h1>
			{getTrigger()}
			{/* Desktop nav */}
			<nav className="hidden md:block">
				<GenericComponent
					as="ul"
					Component={NavItem}
					className="flex justify-end gap-3"
					emptyStateMessage="No nav items"
					items={navItems}
					renderKey={(item) => item.key}
					renderProps={(item) => ({
						Component: item.Component,
						props: item.props,
						children: item.children,
					})}
				/>
			</nav>
			{/* Mobile nav via sheet dialog */}
			{mobileDialog}
		</header>
	);
}
