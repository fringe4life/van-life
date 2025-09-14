import {
	Info,
	LogIn,
	LogOut,
	Menu,
	SidebarClose,
	Truck,
	User,
} from 'lucide-react';
import {
	type ComponentProps,
	type MouseEventHandler,
	type ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react';
import { href } from 'react-router';
import GenericComponent from '~/components/common/GenericComponent';
import navLinkClassName from '~/utils/navLinkClassName';
import { Button } from '../ui/button';
import CustomLink from './CustomLink';
import CustomNavLink from './CustomNavLink';
import NavItem from './NavItem';

type NavProps = {
	hasToken: boolean;
};

const linkClassName: NonNullable<
	ComponentProps<typeof CustomLink>['className']
> =
	'flex items-center gap-2 transition-colors duration-250 px-2 py-1 rounded hover:bg-orange-400 hover:text-white';

type NavLinkLikeProps = ComponentProps<typeof CustomNavLink>;
type LinkLikeProps = ComponentProps<typeof CustomLink>;
type NavItemType =
	| {
			Component: typeof CustomNavLink;
			props: NavLinkLikeProps;
			children: ReactElement;
			key: string;
			show: boolean;
	  }
	| {
			Component: typeof CustomLink;
			props: LinkLikeProps;
			children: ReactElement;
			key: string;
			show: boolean;
	  };

export default function Nav({ hasToken }: NavProps) {
	const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
	const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);
	const animationTimeout = useRef<NodeJS.Timeout | null>(null);

	// Auto-close mobile nav on resize to desktop
	const ANIMATION_DURATION_MS = 300;

	useEffect(() => {
		const TABLET_BREAKPOINT = 768;
		const handleResize = () => {
			if (window.innerWidth >= TABLET_BREAKPOINT) {
				setIsNavOpen(false);
				setIsAnimatingOut(false);
				if (animationTimeout.current) {
					clearTimeout(animationTimeout.current);
				}
			}
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Clean up timeout on unmount
	useEffect(() => {
		return () => {
			if (animationTimeout.current) {
				clearTimeout(animationTimeout.current);
			}
		};
	}, []);

	const handleClick: MouseEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	> = () => {
		if (isNavOpen && !isAnimatingOut) {
			setIsAnimatingOut(true);
			animationTimeout.current = setTimeout(() => {
				setIsNavOpen(false);
				setIsAnimatingOut(false);
			}, ANIMATION_DURATION_MS);
		} else if (!isNavOpen) {
			setIsNavOpen(true);
		}
	};

	const handleNavLinkClick = () => {
		if (isNavOpen && !isAnimatingOut) {
			setIsAnimatingOut(true);
			animationTimeout.current = setTimeout(() => {
				setIsNavOpen(false);
				setIsAnimatingOut(false);
			}, ANIMATION_DURATION_MS);
		}
	};

	// Show nav if open or animating out
	const showMobileNav = isNavOpen || isAnimatingOut;

	const navItems: NavItemType[] = [
		{
			Component: CustomNavLink,
			props: { to: href('/about'), className: navLinkClassName },
			children: (
				<>
					<Info className="aspect-square w-10" />
					<span>About</span>
				</>
			),
			key: 'about',
			show: true,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/host'), className: navLinkClassName },
			children: (
				<>
					<User className="aspect-square w-10" />
					<span>Host</span>
				</>
			),
			key: 'host',
			show: hasToken,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/vans'), className: navLinkClassName },
			children: (
				<>
					<Truck className="aspect-square w-10" />
					<span>Vans</span>
				</>
			),
			key: 'vans',
			show: true,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/login'), className: navLinkClassName },
			children: (
				<>
					<LogIn className="aspect-square w-10" />
					<span>Login</span>
				</>
			),
			key: 'login',
			show: !hasToken,
		},
		{
			Component: CustomLink,
			props: { to: href('/signout'), className: linkClassName },
			children: (
				<>
					<LogOut className="aspect-square w-10" />
					<span>Sign out</span>
				</>
			),
			key: 'signout',
			show: !!hasToken,
		},
	].filter((item) => item.show);

	const createMobileNavItem = (item: NavItemType) => {
		if (item.Component === CustomNavLink) {
			return {
				...item,
				props: {
					...item.props,
					onClick: handleNavLinkClick,
				},
			} as NavItemType;
		}
		// For CustomLink, ensure className is a string
		const { className, ...rest } = item.props;
		return {
			...item,
			props: {
				...rest,
				onClick: handleNavLinkClick,
				...(typeof className === 'string'
					? { className }
					: { className: linkClassName }),
			},
			Component: CustomLink,
		} as NavItemType;
	};

	const mobileNavItems: NavItemType[] = navItems.map(createMobileNavItem);

	return (
		<header className="flex items-center justify-between gap-3 px-[var(--padding-inline)] py-9 sm:gap-6">
			<h1 className="font-black text-xl xs:text-2xl uppercase">
				<CustomLink to={href('/')}>#vanlife</CustomLink>
			</h1>
			{/* Hamburger button: only visible below md */}
			<Button
				aria-label="Open menu"
				className="cursor-pointer bg-orange-400/50 md:hidden"
				onClick={handleClick}
			>
				<Menu />
			</Button>
			{/* Desktop nav */}
			<nav className="hidden md:block">
				<GenericComponent<NavItemType, ComponentProps<typeof NavItem>, 'ul'>
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
			{/* Mobile nav: only visible when open or animating out and below md */}
			{showMobileNav && (
				<>
					{/* Overlay with fade-in and fade-out animation */}
					<button
						aria-label="Close menu"
						className={`mobile-overlay fixed inset-0 z-40 m-0 cursor-pointer appearance-none border-none p-0 md:hidden ${isAnimatingOut ? 'out' : ''}`}
						onClick={handleClick}
						style={{ outline: 'none' }}
						tabIndex={0}
						type="button"
					/>
					{/* Sidebar with slide-in and slide-out animation */}
					<nav
						className={`mobile-sidebar fixed top-0 right-0 bottom-0 z-50 flex w-4/5 flex-col bg-orange-50 p-6 md:hidden ${isAnimatingOut ? 'out' : ''}`}
					>
						<Button
							aria-label="Close menu"
							className="mb-6 self-end"
							onClick={handleClick}
						>
							<SidebarClose />
						</Button>
						<GenericComponent<NavItemType, ComponentProps<typeof NavItem>, 'ul'>
							as="ul"
							Component={NavItem}
							className="flex h-full flex-col justify-center gap-4 text-2xl"
							emptyStateMessage="No nav items"
							items={mobileNavItems}
							renderKey={(item) => item.key}
							renderProps={(item) => ({
								Component: item.Component,
								props: item.props,
								children: item.children,
							})}
						/>
					</nav>
				</>
			)}
		</header>
	);
}
