import { Outlet } from 'react-router';

const AuthLayout = () => {
	return (
		<div className="grid h-full place-content-center gap-4 sm:gap-6 md:gap-12">
			<Outlet />
		</div>
	);
};
export default AuthLayout;
