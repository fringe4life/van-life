import { generateSitemap } from '@forge42/seo-tools/sitemap';
import { href } from 'react-router';
import { getSiteOrigin } from '~/features/seo/get-site-origin.server';
import { getVanSlugsForSitemap } from '~/features/seo/queries/sitemap.server';
import type { Route } from './+types/sitemap.xml';

const formatLastMod = (date: Date) => date.toISOString().split('T')[0];

export const loader = async ({ request }: Route.LoaderArgs) => {
	const origin = getSiteOrigin(request);
	const vans = await getVanSlugsForSitemap();

	const sitemap = await generateSitemap({
		domain: origin,
		routes: [
			{
				url: href('/'),
				changefreq: 'weekly',
				priority: 1,
			},
			{
				url: href('/about'),
				changefreq: 'monthly',
				priority: 0.8,
			},
			{
				url: href('/vans'),
				changefreq: 'daily',
				priority: 0.9,
			},
			...vans.map((van) => ({
				url: href('/vans/:vanSlug', { vanSlug: van.slug }),
				lastmod: formatLastMod(van.createdAt),
				changefreq: 'weekly' as const,
				priority: 0.7 as const,
			})),
		],
	});

	return new Response(sitemap, {
		headers: {
			'Cache-Control': 'public, max-age=3600',
			'Content-Type': 'application/xml',
		},
	});
};
