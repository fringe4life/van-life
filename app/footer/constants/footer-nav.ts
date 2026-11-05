import { href, type LinkProps } from "react-router";

interface FooterLink {
  label: string;
  to: LinkProps["to"];
}

/**
 * Read once, on the footer, in the site's own vocabulary: rentals are priced by
 * the day, availability is per listing, and owners reach the same pages the
 * account nav does. Nothing here promises a feature the app does not have.
 */
const FOOTER_BLURB =
  "Camper van rentals booked by the day. Each listing shows the van's type, price and availability, so you can compare the fleet before you book. Owners list their vans here too, and manage rentals, payouts and reviews from their account.";

const exploreFooterLinks = [
  { label: "Home", to: href("/") },
  { label: "Vans", to: href("/vans") },
  { label: "About", to: href("/about") },
] as const satisfies readonly FooterLink[];

/* Same destinations the account nav uses — labels come from the pages, not from the `/host` prefix. */
const authenticatedFooterLinks = [
  { label: "Dashboard", to: href("/host") },
  { label: "Vans", to: href("/host/vans") },
  { label: "Rentals", to: href("/host/rental-activity") },
  { label: "Wallet", to: href("/host/wallet-activity") },
  { label: "Reviews", to: href("/host/review") },
] as const satisfies readonly FooterLink[];

const signedOutFooterLinks = [
  { label: "Log in", to: href("/login") },
] as const satisfies readonly FooterLink[];

export type { FooterLink };
export {
  authenticatedFooterLinks,
  exploreFooterLinks,
  FOOTER_BLURB,
  signedOutFooterLinks,
};
