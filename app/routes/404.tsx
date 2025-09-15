import { href } from 'react-router';
import { buttonVariants } from '~/components/ui/button';
import CustomLink from '~/features/navigation/components/CustomLink';

export default function NotFound() {
	return (
		<section className="place-self-center">
			<h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl">
				Sorry, the page you were looking for was not found.
			</h2>
			<CustomLink
				className={buttonVariants({ variant: 'secondary' })}
				to={href('/')}
			>
				Return to home
			</CustomLink>
		</section>
	);
}
