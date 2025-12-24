export const getSlug = (text: string) =>
	text.trim().toLowerCase().replace(/ /g, '-');
