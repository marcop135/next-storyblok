import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import MatomoRouteTracker from "@/components/MatomoRouteTracker";
import AgentTools from "@/components/AgentTools";
import { SiteFooter, SiteHeader, type ChromeCopy } from "@/components/SiteChrome";
import StoryblokProvider from "@/components/StoryblokProvider";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  jsonLdFor,
} from "@/lib/site";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import { fetchSiteConfig, requestLocale } from "@/lib/site-config";

import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Next Story: Next.js and Storyblok headless CMS demo",
    template: "%s · Next Story",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Marco Pontili", url: "https://marcopontili.com" }],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Next Story: Next.js and Storyblok headless CMS demo",
    description: SITE_DESCRIPTION,
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
};

const fallbackNav = [
  { _uid: "nav-how", label: "How it works", href: "/how-it-works" },
  { _uid: "nav-blocks", label: "Blocks", href: "/blocks" },
  { _uid: "nav-pricing", label: "Pricing", href: "/pricing" },
];

/** Header and footer copy for every locale, so client navigation can switch language without a reload. */
async function chromeCopy(): Promise<Record<Locale, ChromeCopy>> {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const config = await fetchSiteConfig(locale);
      const prefix = locale === defaultLocale ? "" : `/${locale}`;
      const nav = config?.header_nav?.length
        ? config.header_nav.map(({ _uid, label, href }) => ({ _uid, label, href }))
        : fallbackNav.map((link) => ({ ...link, href: prefix + link.href }));
      const footerNote = config?.footer_note || "Next Story demo · Next.js App Router · Storyblok";
      return [locale, { nav, footerNote }] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<Locale, ChromeCopy>;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await requestLocale();
  const copy = await chromeCopy();
  return (
    <StoryblokProvider>
      <html lang={locale} data-scroll-behavior="smooth" className={sans.variable}>
        <body>
          <SiteHeader copy={copy} />
          {children}
          <SiteFooter copy={copy} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFor(locale)) }}
          />
          <Script src="/matomo.js" strategy="afterInteractive" />
          <MatomoRouteTracker />
          <AgentTools />
        </body>
      </html>
    </StoryblokProvider>
  );
}
