import { DEFAULT_OG_IMAGE, SITE_NAME } from './constants';
import type { PageSeo } from './types';

export const SeoHead = ({ title, description, url, image }: PageSeo) => {
	const ogImage = image ?? DEFAULT_OG_IMAGE;

	return (
		<>
			<title>{title}</title>
			<meta content={description} name="description" />
			<link href={url} rel="canonical" />
			<meta content={title} property="og:title" />
			<meta content={description} property="og:description" />
			<meta content={ogImage} property="og:image" />
			<meta content={url} property="og:url" />
			<meta content="website" property="og:type" />
			<meta content={SITE_NAME} property="og:site_name" />
			<meta content="summary_large_image" name="twitter:card" />
			<meta content={title} name="twitter:title" />
			<meta content={description} name="twitter:description" />
			<meta content={ogImage} name="twitter:image" />
		</>
	);
};
