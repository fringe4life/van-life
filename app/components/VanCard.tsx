import type { Van } from '@prisma/client';
type VanCardProps = {
	van: Van;
	link: string;
	action: React.ReactElement;
};
