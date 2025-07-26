export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_FILTER = '';
export const DEFAULT_CURSOR = undefined;

export const MIN_ADD = 10;
export const MAX_ADD = 100000;

export const VAN_CARD_IMG_SIZES = [200, 250, 300, 350, 500] as const;

export const VAN_DETAIL_IMG_SIZES = [300, 450, 600, 750, 1000] as const;

export const ABOUT_IMG =
	'https://images.unsplash.com/photo-1503516353893-4bc5bd56f50d?w=1000&q=80&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbXBlcnZhbnxlbnwwfDB8MHx8fDI%3D';
// 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbXBpbmd8ZW58MHx8MHx8fDI%3D';

export const ABOUT_IMG_SIZES = [300, 450, 600, 750, 1000] as const;

// Home page image sizes optimized for aspect ratio and device sizes
// Mobile: aspect-[1/1.5] (portrait), Desktop: aspect-video (16:9 landscape)
// Considering max container width of 5xl (1024px) and various screen sizes
export const HOME_IMG_SIZES = [400, 600, 800, 1000, 1200, 1400] as const;

// Separate sizes for mobile (portrait) and desktop (landscape) aspect ratios
export const HOME_MOBILE_IMG_SIZES = [300, 450, 600] as const;
export const HOME_DESKTOP_IMG_SIZES = [800, 1000, 1200, 1400] as const;

export const HOME_IMG_URL =
	'https://images.unsplash.com/photo-1671783181591-55f8e18fbb21?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtcGVydmFuJTIwc2l0ZXxlbnwwfDB8MHx8fDI%3D';

export const HOST_VAN_DETAIL_IMG_SIZES = [200, 250, 300, 400] as const;
