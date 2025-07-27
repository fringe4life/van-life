import { href } from 'react-router';
import CustomLink from '~/components/navigation/CustomLink';
import { buttonVariants } from '~/components/ui/button';

export default function NotFound() {
	return (
		<section className="place-self-center">
			<h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl">
				Sorry, the page you were looking for was not found.
			</h2>
			<CustomLink
				to={href('/')}
				className={buttonVariants({ variant: 'secondary' })}
			>
				Return to home
			</CustomLink>
		</section>
	);
}
