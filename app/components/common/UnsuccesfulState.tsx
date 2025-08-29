import clsx from 'clsx';

type EmptyStateProps = {
	message: string;
	isError?: boolean;
};

export default function UnsuccesfulState({
	message,
	isError = false,
}: EmptyStateProps) {
	return (
		<div className="flex h-full w-full grow-1 items-center">
			<p
				className={clsx(
					true && 'grow-1 text-center',
					isError && 'text-red-500',
				)}
			>
				{message}
			</p>
		</div>
	);
}
