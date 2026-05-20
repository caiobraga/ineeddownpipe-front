/** Public site URL (no trailing slash). Set VITE_SITE_URL in production builds. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL as string | undefined
)?.replace(/\/$/, "") || "https://ineeddownpipe.com";

export const SITE_NAME = "iNeedDownpipe";

/** Logo in /public — used for favicon, Open Graph, and header. */
export const SITE_LOGO_PATH = "/logo.png";

export const SITE_LOGO_URL = `${SITE_URL}${SITE_LOGO_PATH}`;

export const SITE_TAGLINE =
  "Compare BMW downpipe prices from top US retailers — free, no sign-up.";

export const SITE_DESCRIPTION =
  "Free BMW downpipe price comparison for the US market. Search and filter catless, catted, and turbo downpipes for N55, B58, S55, N20, and more from BimmerWorld, Turner Motorsport, IND, ARM, and Amazon.";

export const SITE_KEYWORDS = [
  "BMW downpipe",
  "downpipe price comparison",
  "BMW turbo downpipe",
  "N55 downpipe",
  "B58 downpipe",
  "S55 downpipe",
  "catless downpipe BMW",
  "catted downpipe",
  "BimmerWorld downpipe",
  "Turner Motorsport downpipe",
  "IND Distribution exhaust",
  "ARM Motorsports downpipe",
].join(", ");
