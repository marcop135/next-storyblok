import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import type { ReactNode } from "react";

import LanguageSwitch from "@/components/LanguageSwitch";
import MatomoRouteTracker from "@/components/MatomoRouteTracker";
import StoryblokProvider from "@/components/StoryblokProvider";
import {
  OG_IMAGE,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  jsonLdFor,
} from "@/lib/site";
import { fetchSiteConfig, requestLocale } from "@/lib/site-config";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "next-storyblok: Next.js and Storyblok marketing demo",
    template: "%s · Northline",
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
    title: "next-storyblok: Next.js and Storyblok marketing demo",
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await requestLocale();
  const config = await fetchSiteConfig(locale);
  const nav = config?.header_nav?.length ? config.header_nav : fallbackNav;
  const home = locale === "en" ? "/" : `/${locale}`;
  return (
    <StoryblokProvider>
      <html lang={locale} data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`}>
        <body>
          <a className="skip-link" href="#main">
            {locale === "de" ? "Zum Inhalt springen" : "Skip to content"}
          </a>
          <header className="site-header">
            <div className="wrap">
              <Link className="brand" href={home}>
                Northline
              </Link>
              <nav className="nav" aria-label={locale === "de" ? "Hauptnavigation" : "Primary"}>
                {nav.map((link) => (
                  <Link key={link._uid} href={link.href}>
                    {link.label}
                  </Link>
                ))}
                <LanguageSwitch current={locale} />
              </nav>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <div className="wrap">
              <p>{config?.footer_note || "Northline demo · Next.js App Router · Storyblok"}</p>
              <nav className="footer-nav" aria-label="Footer">
                <a href={REPO_URL}>{locale === "de" ? "Quellcode auf GitHub" : "Source on GitHub"}</a>
                <Link href="/privacy">Privacy</Link>
                <a href="/llms.txt">llms.txt</a>
              </nav>
            </div>
          </footer>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFor(locale)) }}
          />
          <Script src="/matomo.js" strategy="afterInteractive" />
          <MatomoRouteTracker />
        </body>
      </html>
    </StoryblokProvider>
  );
}
