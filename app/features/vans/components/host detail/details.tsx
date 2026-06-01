import { useVanDetailCard } from './context';

/**
 * Details sub-component - displays van name, category, and description
 */
function Details() {
	const van = useVanDetailCard();
	const { name, type, description } = van;

	return (
		<article>
			<p className="font-bold">
				Name: <span className="font-normal">{name}</span>
			</p>
			<p className="my-4 font-bold">
				Category: <span className="font-normal capitalize">{type}</span>
			</p>
			<p className="min-w-full max-w-3xs font-bold">
				Description: <span className="font-normal">{description}</span>
			</p>
		</article>
	);
}

export { Details };
