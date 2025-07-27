/**
 * @abstract gets the amount of items to skip based on page number and amount of items per page
 * @param page pageNumber
 * @param limit how many items you want per page
 * @returns {number} the amount of items to skip
 */
export default function getSkipAmount(page: number, limit: number): number {
	return page === 1 ? 0 : (page - 1) * limit;
}
