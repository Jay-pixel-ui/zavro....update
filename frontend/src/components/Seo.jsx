import { Helmet } from "react-helmet-async";
import { SITE, IS_PRODUCTION, MARKETS } from "@/data/site";

export const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  email: SITE.email,
  telephone: SITE.phoneE164,
  description: SITE.description,
  identifier: { "@type": "PropertyValue", propertyID: "UEN", value: SITE.uen },
  address: { "@type": "PostalAddress", addressCountry: "SG" },
  areaServed: [...MARKETS.map((m) => (m.region ? { "@type": "Place", name: m.name } : { "@type": "Country", name: m.name, identifier: m.iso })), "Worldwide (remote)"],
  knowsLanguage: ["en"],
  location: { "@type": "Place", name: "Singapore", address: { "@type": "PostalAddress", addressCountry: "SG" } },
  contactPoint: { "@type": "ContactPoint", contactType: "sales", email: SITE.email, telephone: SITE.phoneE164, availableLanguage: ["en"] },
};

export const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { "@id": `${SITE.url}/#organization` },
};

const crumbLd = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${SITE.url}${c.to === "/" ? "/" : c.to}` })),
});

export default function Seo({ title, description, path = "/", type = "website", jsonLd = [], crumbs, image = SITE.ogImage, noindex = false }) {
  const url = `${SITE.url}${path === "/" ? "/" : path}`;
  const ld = crumbs ? [...jsonLd, crumbLd(crumbs)] : jsonLd;
  const img = /^https?:\/\//.test(image) ? image : `${SITE.url}${image}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {(!IS_PRODUCTION || noindex) && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1264" />
      <meta property="og:image:height" content="848" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en" />
      <link rel="alternate" hreflang="en" href={url} />
      <link rel="alternate" hreflang="x-default" href={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={title} />
      {ld.map((d, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(d)}</script>
      ))}
    </Helmet>
  );
}
