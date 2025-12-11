type EmptyStateProps = {
	message: string;
	isError?: boolean;
};

export default function UnsuccesfulState({
	message,
	isError = false,
}: EmptyStateProps) {
	return (
		<div
			className="grid h-full w-full items-center"
			data-error={isError}
			data-unsuccessful
		>
			<p className="text-center error:text-red-500">{message}</p>
		</div>
	);
}
