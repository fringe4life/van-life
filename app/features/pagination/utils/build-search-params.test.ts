import { describe, expect, it } from 'bun:test';
import { buildVanQueryString, buildVanUrl } from './build-search-params';

const baseParams = {
	cursor: 'abc123',
	limit: 20,
} as const;

describe('buildVanQueryString', () => {
	it('serializes required pagination params', () => {
		const query = buildVanQueryString(baseParams);

		expect(query).toContain('limit=20');
	});

	it('omits inactive optional filters', () => {
		const query = buildVanQueryString({
			...baseParams,
			types: [],
			excludeInRepair: false,
			onlyOnSale: false,
			search: '   ',
		});

		expect(query).not.toContain('types=');
		expect(query).not.toContain('excludeInRepair=');
		expect(query).not.toContain('onlyOnSale=');
		expect(query).not.toContain('search=');
	});

	it('includes active optional filters', () => {
		const query = buildVanQueryString({
			...baseParams,
			types: ['simple', 'rugged'],
			excludeInRepair: true,
			onlyOnSale: true,
			search: '  camper  ',
		});

		expect(query).toContain('types=simple,rugged');
		expect(query).toContain('excludeInRepair=true');
		expect(query).toContain('onlyOnSale=true');
		expect(query).toContain('search=camper');
	});

	it('does not include a leading question mark', () => {
		expect(buildVanQueryString(baseParams).startsWith('?')).toBe(false);
	});
});

describe('buildVanUrl', () => {
	it('joins baseUrl with query string', () => {
		const url = buildVanUrl({
			...baseParams,
			baseUrl: '/vans',
		});

		expect(url).toBe('/vans?cursor=abc123&limit=20');
	});

	it('returns baseUrl alone when query serializes empty', () => {
		const url = buildVanUrl({
			cursor: '',
			limit: 10,
			baseUrl: '/vans',
		});

		expect(url).toBe('/vans');
	});
});
