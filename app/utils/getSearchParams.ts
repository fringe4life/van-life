export function getSearchParams(url: string) {
	return Object.fromEntries(new URLSearchParams(url.split('?').at(1) ?? ''));
}
