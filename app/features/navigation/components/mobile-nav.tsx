// biome-ignore lint/performance/noNamespaceImport: false positive — Dialog is a namespace
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import type { NavProps } from '../types';
import { toMobileNavItems } from '../utils/create-mobile-nav-items';
import { getNavItems } from '../utils/get-nav-items';
import { HamburgerIcon } from './hamburger-icon';
import { NavItem } from './nav-item';

const MobileNav = ({ hasToken }: NavProps) => {
	const [open, setOpen] = useState(false);
	const navItems = toMobileNavItems(getNavItems(hasToken), () =>
		setOpen(false)
	);

	return (
		<Dialog.Root onOpenChange={setOpen} open={open}>
			<Dialog.Trigger asChild>
				<button
					aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
					className="cursor-pointer rounded p-1 transition-colors duration-250 hover:bg-orange-100 md:hidden"
					type="button"
				>
					<HamburgerIcon isOpen={open} size={24} />
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 data-[state=closed]:animate-overlay-fade-out data-[state=open]:animate-overlay-fade-in" />
				<Dialog.Content
					aria-describedby={undefined}
					className="fixed inset-y-0 right-0 z-50 flex w-(--mobile-menu-width) flex-col items-center justify-center bg-white shadow-2xl data-[state=closed]:animate-slide-out-right data-[state=open]:animate-slide-in-right"
				>
					<Dialog.Title className="sr-only">Navigation</Dialog.Title>

					<Dialog.Close asChild>
						<button
							aria-label="Close navigation menu"
							className="absolute top-5 right-5 cursor-pointer rounded p-1 transition-colors duration-250 hover:bg-orange-100"
							type="button"
						>
							<HamburgerIcon isOpen size={24} />
						</button>
					</Dialog.Close>

					<nav>
						<ul className="flex flex-col items-center gap-6 text-lg">
							{navItems.map((item) => (
								<NavItem key={item.id} {...item} />
							))}
						</ul>
					</nav>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export { MobileNav };
