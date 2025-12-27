import type { UnsuccesfulStateProps } from '~/types/types';

export const UnsuccesfulState = ({
	message,
	isError = false,
}: UnsuccesfulStateProps) => (
	<div
		className="grid h-full w-full items-center"
		data-error={isError}
		data-unsuccessful
	>
		<p className="text-center error:text-red-500">{message}</p>
	</div>
);
export default UnsuccesfulState;
