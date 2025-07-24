import { Menu, SidebarClose } from 'lucide-react';
import {
	type ComponentProps,
	type MouseEventHandler,
	useEffect,
	useRef,
	useState,
} from 'react';
import { href } from 'react-router';
import CustomLink from './CustomLink';
import CustomNavLink from './CustomNavLink';
import GenericComponent from './GenericComponent';
import NavItem from './NavItem';
import { Button } from './ui/button';

interface NavProps {
	hasToken: boolean;
}

const navLinkClassName: NonNullable<
	ComponentProps<typeof CustomNavLink>['className']
> = ({ isActive }) =>
	`transition-colors duration-250 px-2 py-1 rounded ${isActive ? 'underline' : ''} hover:bg-orange-400`;
const linkClassName: NonNullable<
	ComponentProps<typeof CustomLink>['className']
> = 'transition-colors duration-250 px-2 py-1 rounded hover:bg-orange-400';

type NavLinkLikeProps = ComponentProps<typeof CustomNavLink>;
type LinkLikeProps = ComponentProps<typeof CustomLink>;
type NavItemType =
	| {
			Component: typeof CustomNavLink;
			props: NavLinkLikeProps;
			children: string;
			key: string;
			show: boolean;
	  }
	| {
			Component: typeof CustomLink;
			props: LinkLikeProps;
			children: string;
			key: string;
			show: boolean;
	  };

export default function Nav({ hasToken }: NavProps) {
	const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
	const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);
	const animationTimeout = useRef<NodeJS.Timeout | null>(null);

	// Auto-close mobile nav on resize to desktop
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
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

	const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
		if (isNavOpen && !isAnimatingOut) {
			setIsAnimatingOut(true);
			animationTimeout.current = setTimeout(() => {
				setIsNavOpen(false);
				setIsAnimatingOut(false);
			}, 300);
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
			}, 300);
		}
	};

	// Show nav if open or animating out
	const showMobileNav = isNavOpen || isAnimatingOut;

	const navItems: NavItemType[] = [
		{
			Component: CustomNavLink,
			props: { to: href('/about'), className: navLinkClassName },
			children: 'About',
			key: 'about',
			show: true,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/host'), className: navLinkClassName },
			children: 'Host',
			key: 'host',
			show: hasToken,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/vans'), className: navLinkClassName },
			children: 'Vans',
			key: 'vans',
			show: true,
		},
		{
			Component: CustomNavLink,
			props: { to: href('/login'), className: navLinkClassName },
			children: 'Login',
			key: 'login',
			show: !hasToken,
		},
		{
			Component: CustomLink,
			props: { to: href('/signout'), className: linkClassName },
			children: 'Sign out',
			key: 'signout',
			show: !!hasToken,
		},
	].filter((item) => item.show);

	const mobileNavItems: NavItemType[] = navItems.map((item) => {
		if (item.Component === CustomNavLink) {
			return {
				...item,
				props: {
					...item.props,
					onClick: handleNavLinkClick,
				},
			};
		} else {
			// For CustomLink, ensure className is a string
			const { className, ...rest } = item.props;
			return {
				...item,
				props: {
					...rest,
					onClick: handleNavLinkClick,
					className: typeof className === 'string' ? className : linkClassName,
				},
			};
		}
	});

	return (
		<header className="flex items-center justify-between gap-3 px-2 py-9 sm:gap-6 sm:px-6">
			<h1 className="font-black text-xl xs:text-2xl uppercase">
				<CustomLink to={href('/')}>#vanlife</CustomLink>
			</h1>
			{/* Hamburger button: only visible below md */}
			<Button
				className="cursor-pointer md:hidden"
				onClick={handleClick}
				aria-label="Open menu"
			>
				<Menu />
			</Button>
			{/* Desktop nav */}
			<nav className="hidden md:block">
				<GenericComponent<NavItemType, ComponentProps<typeof NavItem>, 'ul'>
					as="ul"
					className="flex justify-end gap-3"
					Component={NavItem}
					items={navItems}
					renderProps={(item) => ({
						Component: item.Component,
						props: item.props,
						children: item.children,
					})}
					renderKey={(item) => item.key}
					emptyStateMessage="No nav items"
					wrapperProps={{}}
				/>
			</nav>
			{/* Mobile nav: only visible when open or animating out and below md */}
			{showMobileNav && (
				<>
					{/* Overlay with fade-in and fade-out animation */}
					<button
						type="button"
						aria-label="Close menu"
						tabIndex={0}
						onClick={handleClick}
						className={`mobile-overlay fixed inset-0 m-0 cursor-pointer appearance-none border-none p-0 md:hidden z-40${isAnimatingOut ? ' out' : ''}`}
						style={{ outline: 'none' }}
					/>
					{/* Sidebar with slide-in and slide-out animation */}
					<nav
						className={`fixed top-0 right-0 bottom-0 z-50 flex w-64 flex-col bg-orange-50 p-6 md:hidden mobile-sidebar${isAnimatingOut ? ' out' : ''}`}
					>
						<Button
							className="mb-6 self-end"
							onClick={handleClick}
							aria-label="Close menu"
						>
							<SidebarClose />
						</Button>
						<GenericComponent<NavItemType, ComponentProps<typeof NavItem>, 'ul'>
							as="ul"
							className="flex flex-col gap-4"
							Component={NavItem}
							items={mobileNavItems}
							renderProps={(item) => ({
								Component: item.Component,
								props: item.props,
								children: item.children,
							})}
							renderKey={(item) => item.key}
							emptyStateMessage="No nav items"
							wrapperProps={{}}
						/>
					</nav>
				</>
			)}
		</header>
	);
}
