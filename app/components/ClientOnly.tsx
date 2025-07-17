import { type ReactNode, useEffect, useRef, useState } from 'react';

const ClientOnly = ({
	children,
}: {
	children: () => ReactNode | Promise<ReactNode>;
}) => {
	const isClient = useRef<boolean>(false);

	useEffect(() => {
		isClient.current = true;
	}, []);

	if (!isClient) {
		return null; // or a fallback UI
	}

	isClient.current = false;

	return children();
};

export default ClientOnly;
