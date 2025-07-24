// Utility for CustomNavLink className
export default function navLinkClassName({
	isActive,
	isPending,
}: {
	isActive: boolean;
	isPending: boolean;
}) {
	return [
		'transition-colors duration-250 px-2 py-1 rounded hover:bg-orange-400 hover:text-white',
		isPending ? 'text-green-500' : '',
		isActive && !isPending ? 'underline' : '',
	]
		.filter(Boolean)
		.join(' ');
}
