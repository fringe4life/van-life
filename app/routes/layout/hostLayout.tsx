import { href, Outlet } from 'react-router';
import CustomNavLink from '~/components/CustomNavLink';
import GenericComponent from '~/components/GenericComponent';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import navLinkClassName from '~/utils/navLinkClassName';
import type { Route } from './+types/hostLayout';

export const loader = async ({ request }: Route.ClientLoaderArgs) => {
	await getSessionOrRedirect(request);
};

const hostNavItems = [
	{ to: href('/host'), children: 'Dashboard', end: true },
	{ to: href('/host/income'), children: 'Income' },
	{ to: href('/host/vans'), children: 'Vans' },
	{ to: href('/host/review'), children: 'Reviews' },
	{ to: href('/host/add'), children: 'Add Van' },
	{ to: href('/host/money'), children: 'Add Money' },
	{ to: href('/host/rentals'), children: 'Rentals' },
];

export default function HostLayout() {
	return (
		<div className="mx-auto max-w-[calc(100dvw_-_1.75rem)]">
			<GenericComponent
				as="ul"
				className="mask-r-from-90% sm:mask-none no-scrollbar grid h-[3lh] auto-cols-max grid-flow-col grid-rows-1 gap-2 overflow-x-auto overscroll-x-contain pb-5 sm:gap-3"
				Component={CustomNavLink}
				items={hostNavItems}
				renderProps={(item) => ({
					to: item.to,
					...(item.end ? { end: true } : {}),
					className: navLinkClassName,
					children: item.children,
				})}
				renderKey={(item) => item.to}
				emptyStateMessage="No nav links"
				wrapperProps={{}}
			/>
			<Outlet />
		</div>
	);
}
