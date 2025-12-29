import type { UnsuccesfulStateProps } from '~/types/types';

const UnsuccesfulState = ({ message, isError }: UnsuccesfulStateProps) => (
	<div
		className="grid h-full w-full items-center error:text-red-500"
		data-error={isError}
		data-unsuccessful
	>
		<p className="text-center">{message}</p>
	</div>
);
export { UnsuccesfulState };
