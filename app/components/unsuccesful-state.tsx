type EmptyStateProps = {
	message: string;
	isError?: boolean;
};

export default function UnsuccesfulState({
	message,
	isError = false,
}: EmptyStateProps) {
	return (
		<div className="flex h-full w-full grow items-center" data-error={isError}>
			<p className="grow text-center error:text-red-500">{message}</p>
		</div>
	);
}
