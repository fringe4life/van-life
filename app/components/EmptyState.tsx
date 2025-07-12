type EmptyStateProps = {
	message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
	return (
		<div className="flex h-full w-full grow-1 items-center justify-center">
			<p>{message}</p>
		</div>
	);
}
