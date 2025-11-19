import { Outlet } from 'react-router';

export default function AuthLayout() {
	return (
		<div className="grid items-center justify-center gap-4 sm:gap-6 md:gap-12">
			<Outlet />
		</div>
	);
}
