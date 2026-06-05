import type { NavItem as NavItemData } from '../types';
import { CustomLink } from './custom-link';
import { CustomNavLink } from './custom-nav-link';

interface NavItemComponentProps {
	item: NavItemData;
}

const NavItem = ({ item }: NavItemComponentProps) => {
	switch (item.type) {
		case 'nav-link':
			return (
				<li>
					<CustomNavLink {...item.props}>{item.children}</CustomNavLink>
				</li>
			);

		case 'link':
			return (
				<li>
					<CustomLink {...item.props}>{item.children}</CustomLink>
				</li>
			);
		default:
			throw new Error(`Invalid item type: ${item satisfies never}`);
	}
};

export { NavItem };
