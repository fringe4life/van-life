import { type SubmitEventHandler, useId } from 'react';
import { Form } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/utils/utils';

export interface VanFormProps {
	errors?: string | string[];
	formDataDefaults?: Record<string, unknown>;
	handleSubmit: SubmitEventHandler<HTMLFormElement>;
	isPending: boolean;
}

const VanForm = ({
	handleSubmit,
	isPending,
	formDataDefaults,
	errors,
}: VanFormProps) => {
	const nameId = useId();
	const priceId = useId();
	const descriptionId = useId();
	const imageUrlId = useId();
	const typeId = useId();
	const discountId = useId();

	return (
		<div className="@container/form">
			<Form
				className={cn(
					'mt-6 grid gap-x-6 gap-y-4',
					'@min-xl/form:max-w-4xl @min-xl/form:grid-cols-2'
				)}
				method="POST"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={nameId}>Name</Label>
					<Input
						defaultValue={(formDataDefaults?.name as string | undefined) ?? ''}
						id={nameId}
						name="name"
						placeholder="Silver Bullet"
						type="text"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={priceId}>Price ($/day)</Label>
					<Input
						defaultValue={(formDataDefaults?.price as string | undefined) ?? ''}
						id={priceId}
						name="price"
						placeholder="100"
						type="number"
					/>
				</div>
				<div className="@min-xl/form:col-span-2 flex flex-col gap-1.5">
					<Label htmlFor={descriptionId}>Description</Label>
					<Textarea
						defaultValue={
							(formDataDefaults?.description as string | undefined) ?? ''
						}
						id={descriptionId}
						name="description"
						placeholder="The silver bullet can take you on an amazing adventure..."
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={imageUrlId}>Image URL</Label>
					<Input
						defaultValue={
							(formDataDefaults?.imageUrl as string | undefined) ?? ''
						}
						id={imageUrlId}
						name="imageUrl"
						placeholder="https://images.unsplash.com/"
						type="url"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={typeId}>Type</Label>
					<Input
						defaultValue={(formDataDefaults?.type as string | undefined) ?? ''}
						id={typeId}
						list={`${typeId}-list`}
						name="type"
						placeholder="simple or luxury or rugged"
						type="text"
					/>
					{/* react-doctor-disable-next-line*/}
					<datalist id={`${typeId}-list`}>
						{/* react-doctor-disable-next-line*/}
						<option value="luxury" />
						{/* react-doctor-disable-next-line*/}
						<option value="simple" />
						{/* react-doctor-disable-next-line*/}
						<option value="rugged" />
					</datalist>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={discountId}>Discount (%)</Label>
					<Input
						defaultValue={
							(formDataDefaults?.discount as string | undefined) ?? '0'
						}
						id={discountId}
						max={50}
						min={0}
						name="discount"
						placeholder="0"
						type="number"
					/>
				</div>
				{errors ? (
					<p className="col-span-full font-medium text-red-500 text-sm">
						{Array.isArray(errors) ? errors.join(', ') : errors}
					</p>
				) : null}
				<div className="col-span-full grid grid-cols-subgrid">
					<Button
						className="col-span-full @min-xl/form:col-start-2"
						disabled={isPending}
						type="submit"
					>
						Add your van
					</Button>
				</div>
			</Form>
		</div>
	);
};

export { VanForm };
