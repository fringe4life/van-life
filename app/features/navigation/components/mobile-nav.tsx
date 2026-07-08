import { useState } from 'react';
import { GenericComponent } from '~/components/generic-component';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';
import type { Items } from '~/features/pagination/types';
import type { NavItem as NavItemType } from '../types';
import { HamburgerIcon } from './hamburger-icon';
import { NavItem } from './nav-item';

interface MobileNavProps extends Items<NavItemType> {}
const renderMobileNavItemProps = (item: NavItemType, onClose: () => void) => {
	if (item.type === 'link') {
		return {
			item: {
				...item,
				props: { ...item.props, onClick: onClose },
			},
		};
	}

	return {
		item: {
			...item,
			props: { ...item.props, onClick: onClose },
		},
	};
};

const MobileNav = ({ items }: MobileNavProps) => {
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const renderProps = (item: NavItemType) =>
		renderMobileNavItemProps(item, handleClose);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
					<button
						aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
						className="relative z-50 cursor-pointer rounded p-1 transition-colors duration-250 hover:bg-orange-100 md:hidden"
						type="button"
					/>
				}
			>
				<HamburgerIcon isOpen={open} size={24} />
			</DialogTrigger>

			<DialogContent
				className="fixed top-(--header-height) right-0 bottom-0 left-auto flex w-(--mobile-menu-width) max-w-none translate-x-0 translate-y-0 flex-col items-center justify-center rounded-none bg-white p-0 shadow-2xl ring-0 data-closed:animate-slide-out-right data-open:animate-slide-in-right"
				overlayClassName="top-(--header-height) z-40 bg-black/60 data-closed:animate-overlay-fade-out data-open:animate-overlay-fade-in"
				showCloseButton={false}
			>
				<DialogTitle className="sr-only">Navigation</DialogTitle>

				<nav>
					<GenericComponent
						as="ul"
						Component={NavItem}
						className="flex flex-col items-center gap-6 text-lg"
						emptyStateMessage="No nav items"
						errorStateMessage="Something went wrong"
						items={items}
						renderProps={renderProps}
					/>
				</nav>
			</DialogContent>
		</Dialog>
	);
};

export { MobileNav };
