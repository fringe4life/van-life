import { createContext, use } from 'react';
import type { VanModel } from '~/generated/prisma/models';
import type { Maybe } from '~/types';

/**
 * Context for sharing van data within VanDetailCard compound component
 */
const VanDetailCardContext = createContext<Maybe<VanModel>>(null);

const useVanDetailCard = () => {
	const van = use(VanDetailCardContext);
	if (!van) {
		throw new Error(
			'VanDetailCard compound components must be used within VanDetailCard'
		);
	}
	return van;
};

export { useVanDetailCard, VanDetailCardContext };
