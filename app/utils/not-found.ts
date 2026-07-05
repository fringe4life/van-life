import { data } from 'react-router';

export function notFound(message = 'Not found'): never {
	throw data(message, { status: 404 });
}
