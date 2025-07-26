/**
 * Utility to check if the code is running in a browser environment with DOM access.
 *
 * This is useful for preventing errors when code that depends on browser APIs
 * (like window, document, localStorage, etc.) runs during server-side rendering (SSR).
 *
 * @returns {boolean} True if running in a browser with DOM access, false otherwise
 *
 * @example
 * // Prevent accessing window during SSR
 * if (canUseDOM) {
 *   window.localStorage.setItem('key', 'value');
 * }
 *
 * @example
 * // Safely access browser APIs
 * const isOnline = canUseDOM ? navigator.onLine : true;
 *
 * @example
 * // Conditional rendering based on environment
 * const BrowserOnlyComponent = () => {
 *   if (!canUseDOM) return null;
 *   return <div>This only renders in the browser</div>;
 * };
 */
const canUseDOM =
	typeof window !== 'undefined' && typeof document !== 'undefined';
export default canUseDOM;
