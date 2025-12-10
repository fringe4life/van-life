import type { ReactElement, ReactNode } from 'react';
import { Activity, cloneElement, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog';
import type { Maybe } from '~/types/types';

type UseSheetDialogParams = {
	trigger: ReactElement | ((isOpen: boolean) => ReactElement);
	renderContent: (close: () => void) => ReactNode;
	className?: string;
	modal?: boolean;
	container?: Maybe<HTMLElement>;
	title: string;
};

export function useSheetDialog({
	trigger,
	renderContent,
	className = 'fixed top-0 right-0 z-50 flex h-dvh w-[80vw] flex-col bg-orange-50 p-6 shadow-lg md:hidden',
	modal = false,
	title,
}: UseSheetDialogParams) {
	const [isOpen, setIsOpen] = useState(false);

	const getTriggerElement = (pending?: boolean) => {
		const el =
			typeof trigger === 'function'
				? trigger(Boolean(pending ?? isOpen))
				: trigger;
		return cloneElement(el, {
			onClick: () => {
				setIsOpen((prev) => !prev);
			},
		} as React.HTMLAttributes<HTMLElement>);
	};

	const dialog = (
		<Activity mode={isOpen ? 'visible' : 'hidden'}>
			<Dialog modal={modal} onOpenChange={setIsOpen} open={isOpen}>
				<DialogTitle className="sr-only">{title}</DialogTitle>
				<DialogContent className={className} showCloseButton={false} unstyled>
					{renderContent(() => setIsOpen(false))}
				</DialogContent>
			</Dialog>
		</Activity>
	);

	return [getTriggerElement, dialog, isOpen, setIsOpen] as const;
}
