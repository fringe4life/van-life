type EmptyStateProps = {
	message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
	return (
		<div className="flex h-full w-full grow-1 items-center ">
			<p className="grow-1 text-center">{message}</p>
		</div>
	);
}
