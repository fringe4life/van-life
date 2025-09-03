import { useQueryState } from 'nuqs';
import { paginationZodParser } from '~/lib/parsers';

/**
 * Example component demonstrating how to use Zod schemas with nuqs
 * This shows how to manage complex pagination state as a single JSON object
 */
export default function PaginationWithZod() {
	// Using Zod schema to validate and parse pagination state
	const [paginationState, setPaginationState] = useQueryState(
		'pagination',
		paginationZodParser.withDefault({
			limit: 10,
			cursor: '',
			direction: 'forward',
			type: '',
		}),
	);

	const handleNextPage = () => {
		setPaginationState({
			...paginationState,
			direction: 'forward',
			cursor: 'next-cursor-id', // This would be the actual cursor
		});
	};

	const handlePreviousPage = () => {
		setPaginationState({
			...paginationState,
			direction: 'backward',
			cursor: 'previous-cursor-id', // This would be the actual cursor
		});
	};

	const handleLimitChange = (newLimit: number) => {
		setPaginationState({
			...paginationState,
			limit: newLimit,
			cursor: '', // Reset cursor when changing limit
		});
	};

	const handleTypeChange = (newType: string) => {
		setPaginationState({
			...paginationState,
			type: newType,
			cursor: '', // Reset cursor when changing type
		});
	};

	return (
		<div className="rounded-lg border p-4">
			<h3 className="mb-4 font-semibold text-lg">Pagination with Zod Schema</h3>

			<div className="mb-4 space-y-2">
				<p>
					<strong>Current State:</strong>
				</p>
				<pre className="rounded bg-gray-100 p-2 text-sm">
					{JSON.stringify(paginationState, null, 2)}
				</pre>
			</div>

			<div className="space-x-2">
				<button
					type="button"
					onClick={handlePreviousPage}
					className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={handleNextPage}
					className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
				>
					Next
				</button>
				<button
					type="button"
					onClick={() => handleLimitChange(20)}
					className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
				>
					Set Limit to 20
				</button>
				<button
					type="button"
					onClick={() => handleTypeChange('luxury')}
					className="rounded bg-purple-500 px-3 py-1 text-white hover:bg-purple-600"
				>
					Set Type to Luxury
				</button>
			</div>
		</div>
	);
}
