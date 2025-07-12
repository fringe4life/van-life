type EmptyStateProps = {
	message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
	return (
		<div className="flex ">
			<p>{message}</p>
		</div>
	);
}
