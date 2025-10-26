import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import {
	isRouteErrorResponse,
	Links,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import { HTTP_MESSAGES, HTTP_STATUS } from './constants/http-constants';
import './app.css';

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		type: 'text/css',
		as: 'font',
		href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap&subset=latin,latin-ext',
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html
			className="max-w-dvw bg-neutral-50 md:[--padding-inline:3rem]"
			lang="en"
		>
			<head>
				<meta charSet="utf-8" />
				<link href="/camper-van.png" rel="icon" type="image/png" />
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<Links />
			</head>
			<body className="mx-auto grid min-h-dvh w-full max-w-layout grid-cols-1 grid-rows-[104px_1fr_100px] bg-orange-50">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<NuqsAdapter defaultOptions={{ clearOnDefault: true, shallow: false }}>
			<Outlet />
		</NuqsAdapter>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message =
			error.status === HTTP_STATUS.NOT_FOUND
				? HTTP_MESSAGES.NOT_FOUND
				: HTTP_MESSAGES.ERROR;
		details =
			error.status === HTTP_STATUS.NOT_FOUND
				? HTTP_MESSAGES.NOT_FOUND_DETAILS
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
// Test comment
// Another test comment
