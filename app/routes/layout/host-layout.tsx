import { Outlet } from 'react-router';
import GenericComponent from '~/components/generic-component';
import { hostNavItems } from '~/features/host/constants/host-nav-items';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomNavLink from '~/features/navigation/components/custom-nav-link';
import navLinkClassName from '~/features/navigation/utils/nav-link-class-name';
import type { Route } from './+types/host-layout';
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export default function HostLayout() {
	return (
		<>
			<div className="grid grid-cols-1 contain-content">
				<GenericComponent
					as="ul"
					Component={CustomNavLink}
					className="mask-r-from-95% no-scrollbar mb-5 grid auto-cols-max grid-flow-col grid-rows-1 items-center gap-3 overflow-x-auto overscroll-x-contain py-3"
					emptyStateMessage="No nav links"
					errorStateMessage="Something went wrong"
					items={hostNavItems}
					renderKey={(item) => item.to}
					renderProps={(item) => ({
						...item,
						className: navLinkClassName,
					})}
				/>
			</div>
			<Outlet />
		</>
	);
}
