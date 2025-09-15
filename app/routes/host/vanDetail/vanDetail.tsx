import { useOutletContext } from 'react-router';
import type { VanModel } from '~/generated/prisma/models';

export default function VanDetail() {
	const van = useOutletContext<VanModel>();
	return (
		<article>
			<p className="font-bold">
				Name: <span className="font-normal">{van.name}</span>
			</p>
			<p className="my-4 font-bold">
				Category: <span className="font-normal capitalize">{van.type}</span>
			</p>
			<p className="min-w-full max-w-3xs font-bold">
				Description: <span className="font-normal">{van.description}</span>
			</p>
		</article>
	);
}
