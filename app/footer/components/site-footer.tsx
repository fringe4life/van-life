import { href } from "react-router";
import { CopyrightYear } from "~/components/copyright-year";
import { CustomLink } from "~/components/links/custom-link";
import { ThemeToggle } from "~/navigation/components/theme-toggle";
import {
  authenticatedFooterLinks,
  exploreFooterLinks,
  FOOTER_BLURB,
  type FooterLink,
  signedOutFooterLinks,
} from "../constants/footer-nav";
import {
  blurbClassName,
  brandFrameClassName,
  copyrightClassName,
  ctaClassName,
  footerBandClassName,
  footerGridClassName,
  footerLinkClassName,
  footerTrackClassName,
  glassPanelClassName,
  groupClassName,
  groupLabelClassName,
  imprintRowClassName,
  linkClusterClassName,
  listClassName,
  vanArtClassName,
  wordmarkClassName,
} from "../styles";

interface FooterGroupProps {
  id: string;
  label: string;
  links: readonly FooterLink[];
}

const FooterGroup = ({ id, label, links }: FooterGroupProps) => (
  <nav aria-labelledby={id} className={groupClassName}>
    <h2 className={groupLabelClassName} id={id}>
      {label}
    </h2>
    <ul className={listClassName}>
      {links.map(({ label: linkLabel, to }) => (
        <li key={linkLabel}>
          <CustomLink className={footerLinkClassName} to={to}>
            {linkLabel}
          </CustomLink>
        </li>
      ))}
    </ul>
  </nav>
);

interface SiteFooterProps {
  hasToken: boolean;
}

const SiteFooter = ({ hasToken }: SiteFooterProps) => (
  <footer className={footerBandClassName}>
    <div className={footerTrackClassName}>
      <div className={footerGridClassName}>
        <div className={brandFrameClassName}>
          {/*
           * The market illustration keeps its own linework but loses its colour:
           * the artwork's green is not in the palette, and orange is the page's
           * only accent. Eager because a short page shows the footer on arrival.
           */}
          <img
            alt=""
            className={vanArtClassName}
            decoding="sync"
            fetchPriority="high"
            height={1200}
            loading="eager"
            src="/rvMask.min.svg"
            width={1200}
          />
          <div className={glassPanelClassName}>
            <p className={wordmarkClassName}>#vanlife</p>
            <CustomLink className={ctaClassName} to={href("/host/vans")}>
              List your van
            </CustomLink>
          </div>
        </div>

        <p className={blurbClassName}>{FOOTER_BLURB}</p>

        <div className={linkClusterClassName}>
          <FooterGroup
            id="footer-explore"
            label="Explore"
            links={exploreFooterLinks}
          />
          <FooterGroup
            id="footer-account"
            label="Account"
            links={hasToken ? authenticatedFooterLinks : signedOutFooterLinks}
          />
        </div>
      </div>

      <div className={imprintRowClassName}>
        <p className={copyrightClassName}>
          &copy;
          <CopyrightYear /> #vanlife
        </p>
        <ThemeToggle instance="footer" />
      </div>
    </div>
  </footer>
);

export { SiteFooter };
