import { Suspense } from 'react';
import { Await, href } from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { UnsuccesfulState } from '~/components/unsuccesful-state';
import { VanCard } from '~/features/vans/components/van-card';
import { VanCardSkeleton } from '~/features/vans/components/van-card-skeleton';
import type { VanModel } from '~/generated/prisma/models';

interface HostVansSectionProps {
	vansPromise: Promise<VanModel[]>;
}

const HostVansSection = ({ vansPromise }: HostVansSectionProps) => (
	<Suspense
		fallback={
			<div className="grid-max mt-11">
				<VanCardSkeleton />
				<VanCardSkeleton />
				<VanCardSkeleton />
			</div>
		}
	>
		<Await
			errorElement={<UnsuccesfulState message="Something went wrong" />}
			resolve={vansPromise}
		>
			{(vans) => (
				<GenericComponent
					Component={VanCard}
					className="grid-max mt-11"
					emptyStateMessage="You are not currently renting any vans"
					errorStateMessage="Something went wrong"
					items={vans}
					renderProps={(item) => ({
						van: item,
						link: href('/host/vans/:vanSlug/:action?', {
							vanSlug: item.slug,
							action: 'edit',
						}),
						action: <p className="justify-self-end text-right">Edit</p>,
					})}
				/>
			)}
		</Await>
	</Suspense>
);

export { HostVansSection };
