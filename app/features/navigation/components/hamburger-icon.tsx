import type { CSSProperties } from 'react';

interface HamburgerIconProps {
	className?: string;
	isOpen: boolean;
	size?: number;
}

/**
 * Animated SVG hamburger icon — 2 bars morph to an X and back.
 *
 * Transform math (all values in SVG user units — px lengths in CSS
 * transforms on SVG child elements resolve against the user coordinate
 * system, so no size-derived scaling is needed; the icon stays correct
 * at any rendered `size`):
 *   viewBox is 24×24; top line y=8, bottom line y=16, centre y=12.
 *   Transform functions compose right-to-left, so with
 *   `rotate(...) translateY(...)` each line is first translated 4 units
 *   onto the centre line, then rotated ±45° in place about the view-box
 *   centre (12,12) — producing a symmetric X. (The reverse order rotates
 *   first about (12,12), sweeping the off-centre bars sideways.)
 */
const ROTATION_DEG = 45;
const LINE_OFFSET = 4; // user units from each line (y=8 / y=16) to centre (y=12)

const HamburgerIcon = ({
	isOpen,
	size = 20,
	className,
}: HamburgerIconProps) => {
	const lineStyle = (direction: 1 | -1): CSSProperties => ({
		transform: isOpen
			? `rotate(${direction * ROTATION_DEG}deg) translateY(${direction * LINE_OFFSET}px)`
			: 'none',
		transformBox: 'view-box',
		transformOrigin: 'center',
		// Spring on open (settle time needs the longer duration); quick ease on close
		transition: isOpen
			? 'transform 500ms var(--ease-spring)'
			: 'transform 250ms ease',
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
			{/* Top line: moves down to centre, rotates +45° in place */}
			<line style={lineStyle(1)} x1="3" x2="21" y1="8" y2="8" />
			{/* Bottom line: moves up to centre, rotates -45° in place */}
			<line style={lineStyle(-1)} x1="3" x2="21" y1="16" y2="16" />
		</svg>
	);
};

export { HamburgerIcon };
