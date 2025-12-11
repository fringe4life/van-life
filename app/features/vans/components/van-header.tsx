import type { ComponentPropsWithoutRef } from 'react';

const VanHeader = ({ children }: ComponentPropsWithoutRef<'h2'>) => (
	<h2 className="font-bold text-3xl">{children}</h2>
);

export default VanHeader;
