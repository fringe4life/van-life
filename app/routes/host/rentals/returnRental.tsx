import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import type { Route } from './+types/returnRental';
import { data } from 'react-router';
import { getHostRentedVan } from '~/db/host/getHostRentedVan';

export async function loader({ request, params }: Route.LoaderArgs) {
	await getSessionOrRedirect(request);

    const {rentId} = params

    if(!rentId) throw data('Rental not found', {status: 404})

        const rent = getHostRentedVan()
}

export async function action({request,params}: Route.ActionArgs) {
    
}

export default function ReturnRental() {
	return <section>
        <h2 className=''>Return this van</h2>
    </section>;
}
