import type { CSSProperties } from 'react';

interface HamburgerIconProps {
	className?: string;
	isOpen: boolean;
	size?: number;
}

/**
 * Animated SVG hamburger icon — 3 lines morph to an X and back.
 *
 * Transform math (size-derived, scale-independent):
 *   viewBox is 24×24; SVG renders at `size`×`size` CSS px → scale = size/24.
 *   Top line y=6, bottom line y=18, centre y=12 (all SVG units).
 *   Distance from outer line to centre in CSS px = 6 × (size/24) = size/4.
 *   transform-origin is pinned to the CSS pixel centre of the rendered SVG: (size/2, size/2).
 *   No transform-box needed — values are in absolute CSS px.
 */
const HamburgerIcon = ({
	isOpen,
	size = 20,
	className,
}: HamburgerIconProps) => {
	const originPx = size / 2; // CSS px centre of the rendered SVG
	const translatePx = size / 4; // CSS px to move outer line to centre (= 6 SVG units × scale)

	const outerLineStyle = (direction: 1 | -1): CSSProperties => ({
		transformOrigin: `${originPx}px ${originPx}px`,
		transition: 'transform 300ms ease',
		transform: isOpen
			? `translateY(${direction * translatePx}px) rotate(${direction * 45}deg)`
			: 'none',
	});

	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			height={size}
			stroke="currentColor"
			strokeLinecap="round"
			strokeWidth={2}
			viewBox="0 0 24 24"
			width={size}
		>
			{/* Top line: translates down to centre, rotates +45° */}
			<line style={outerLineStyle(1)} x1="3" x2="21" y1="6" y2="6" />
			{/* Middle line: fades out */}
			<line
				style={{ transition: 'opacity 200ms ease', opacity: isOpen ? 0 : 1 }}
				x1="3"
				x2="21"
				y1="12"
				y2="12"
			/>
			{/* Bottom line: translates up to centre, rotates -45° */}
			<line style={outerLineStyle(-1)} x1="3" x2="21" y1="18" y2="18" />
		</svg>
	);
};

export { HamburgerIcon };
