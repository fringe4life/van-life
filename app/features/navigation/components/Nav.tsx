import { Menu, X } from 'lucide-react';
import {
	type RefObject,
	startTransition,
	useEffect,
	useRef,
	useState,
} from 'react';
import { href } from 'react-router';
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts';
import GenericComponent from '~/components/GenericComponent';
import { Button } from '~/components/ui/button';
import { useSheetDialog } from '~/features/navigation/hooks/useSheetDialog';
import {
	type NavItemType,
	toMobileNavItems,
} from '../utils/createMobileNavItems';
import { getNavItems } from '../utils/getNavItems';
import CustomLink from './CustomLink';
import NavItem from './NavItem';

type NavProps = {
	hasToken: boolean;
};

const ANIMATION_DURATION_MS = 300;
const DEBOUNCE_MS = 150;
const TABLET_BREAKPOINT = 768;
export default function Nav({ hasToken }: NavProps) {
	const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);
	const animationTimeout = useRef<NodeJS.Timeout | null>(null);
	const headerRef = useRef<HTMLElement>(null);

	// Auto-close mobile nav on resize to desktop

	const handleResizeDebounced = useDebounceCallback(() => {
		if (window.innerWidth >= TABLET_BREAKPOINT) {
			close();
			setIsAnimatingOut(false);
			if (animationTimeout.current) {
				clearTimeout(animationTimeout.current);
			}
		}
	}, DEBOUNCE_MS);

	useResizeObserver({
		ref: headerRef as RefObject<HTMLElement>,
		onResize: handleResizeDebounced,
		box: 'border-box',
	});

	// Clean up timeout on unmount
	useEffect(() => {
		return () => {
			if (animationTimeout.current) {
				clearTimeout(animationTimeout.current);
			}
		};
	}, []);

	const handleNavLinkClick = () => {
		if (!isAnimatingOut) {
			setIsAnimatingOut(true);
			animationTimeout.current = setTimeout(() => {
				startTransition(() => close());
				setIsAnimatingOut(false);
			}, ANIMATION_DURATION_MS);
		}
	};

	const navItems = getNavItems(hasToken);

	const mobileNavItems: NavItemType[] = toMobileNavItems(
		navItems,
		handleNavLinkClick
	);

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
		renderContent: () => (
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
		),
		className: `fixed top-0 right-0 z-50 flex h-[100dvh] w-[80vw] flex-col bg-orange-50 p-6 shadow-lg md:hidden ${isAnimatingOut ? 'out' : ''}`,
	});

	return (
		<header
			className="flex items-center justify-between gap-3 px-[var(--padding-inline)] py-9 sm:gap-6"
			ref={headerRef}
		>
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
