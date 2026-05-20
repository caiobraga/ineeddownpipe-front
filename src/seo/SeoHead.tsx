import { useEffect } from "react";
import type { Product } from "../types";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "./config";

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string
) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(
  rel: string,
  href: string,
  extra?: { type?: string; title?: string }
) {
  const selector = extra?.type
    ? `link[rel="${rel}"][type="${extra.type}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (extra?.type) el.type = extra.type;
    if (extra?.title) el.title = extra.title;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

interface Props {
  productCount?: number;
  products?: Product[];
}

export function SeoHead({ productCount = 0, products = [] }: Props) {
  useEffect(() => {
    const title =
      productCount > 0
        ? `${SITE_NAME} — ${productCount} BMW downpipes compared`
        : `${SITE_NAME} — BMW Downpipe Price Comparison`;

    document.title = title;
    document.documentElement.lang = "en-US";

    upsertLink("canonical", `${SITE_URL}/`);
    upsertLink("icon", SITE_LOGO_URL, { type: "image/png" });
    upsertLink("apple-touch-icon", SITE_LOGO_URL);
    upsertMeta("name", "description", SITE_DESCRIPTION);
    upsertMeta("name", "keywords", SITE_KEYWORDS);
    upsertMeta("name", "robots", "index, follow, max-image-preview:large");
    upsertMeta(
      "name",
      "googlebot",
      "index, follow, max-snippet:-1, max-image-preview:large"
    );

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", SITE_DESCRIPTION);
    upsertMeta("property", "og:url", SITE_URL);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("property", "og:image", SITE_LOGO_URL);
    upsertMeta("property", "og:image:alt", `${SITE_NAME} logo`);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:image", SITE_LOGO_URL);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", SITE_DESCRIPTION);

    upsertMeta("name", "application-name", SITE_NAME);
    upsertMeta("name", "theme-color", "#1d4ed8");

    upsertJsonLd("jsonld-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      about: {
        "@type": "Thing",
        name: "BMW turbo downpipes and performance exhaust",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    });

    upsertJsonLd("jsonld-org", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
      description: SITE_TAGLINE,
      areaServed: { "@type": "Country", name: "United States" },
    });

    if (products.length > 0) {
      upsertJsonLd("jsonld-itemlist", {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "BMW downpipes — price comparison",
        numberOfItems: products.length,
        itemListElement: products.slice(0, 30).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.title,
            brand: { "@type": "Brand", name: p.brand },
            offers: p.price
              ? {
                  "@type": "Offer",
                  price: p.price,
                  priceCurrency: p.currency || "USD",
                  url: p.url,
                  availability: "https://schema.org/InStock",
                }
              : undefined,
            url: p.url,
            category: "Automotive exhaust — downpipe",
          },
        })),
      });
    } else {
      document.getElementById("jsonld-itemlist")?.remove();
    }
  }, [productCount, products]);

  return null;
}
