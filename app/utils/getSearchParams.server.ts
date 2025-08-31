/**
 * Server-only utility to extract search parameters from a URL string.
 * This function is designed to be used in loader functions to parse URL search parameters.
 */
export function getSearchParams(url: string): Record<string, string> {
	return Object.fromEntries(new URLSearchParams(url.split('?').at(1) ?? ''));
}
