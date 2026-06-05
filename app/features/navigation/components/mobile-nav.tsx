// biome-ignore lint/performance/noNamespaceImport: false positive — Dialog is a namespace
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { GenericComponent } from '~/components/generic-component';
import type { MobileNavProps } from '../types';
import { HamburgerIcon } from './hamburger-icon';
import { NavItem } from './nav-item';

const MobileNav = ({ items }: MobileNavProps) => {
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

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
						<GenericComponent
							as="ul"
							Component={NavItem}
							className="flex flex-col items-center gap-6 text-lg"
							emptyStateMessage="No nav items"
							errorStateMessage="Something went wrong"
							items={items}
							renderProps={(item) => {
								switch (item.type) {
									case 'link':
										return {
											item: {
												...item,
												props: { ...item.props, onClick: handleClose },
											},
										};
									case 'nav-link':
										return {
											item: {
												...item,
												props: { ...item.props, onClick: handleClose },
											},
										};
									default:
										throw new Error(
											`Invalid item type: ${item satisfies never}`
										);
								}
							}}
						/>
					</nav>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export { MobileNav };
