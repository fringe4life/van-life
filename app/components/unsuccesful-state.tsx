type EmptyStateProps = {
	message: string;
	isError?: boolean;
};

export const UnsuccesfulState = ({
	message,
	isError = false,
}: EmptyStateProps) => (
	<div
		className="grid h-full w-full items-center"
		data-error={isError}
		data-unsuccessful
	>
		<p className="text-center error:text-red-500">{message}</p>
	</div>
);
export default UnsuccesfulState;
