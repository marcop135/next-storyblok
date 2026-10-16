import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import type { ReactNode } from "react";

import MatomoRouteTracker from "@/components/MatomoRouteTracker";
import StoryblokProvider from "@/components/StoryblokProvider";
import {
  OG_IMAGE,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  jsonLd,
} from "@/lib/site";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <StoryblokProvider>
      <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`}>
        <body>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <header className="site-header">
            <div className="wrap">
              <Link className="brand" href="/">
                Northline
              </Link>
              <nav className="nav" aria-label="Primary">
                <Link href="/">Home</Link>
                <Link href="/pricing">Pricing</Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <div className="wrap">
              <p>Northline demo · Next.js App Router · Storyblok</p>
              <nav className="footer-nav" aria-label="Footer">
                <a href={REPO_URL}>Source on GitHub</a>
                <Link href="/privacy">Privacy</Link>
                <a href="/llms.txt">llms.txt</a>
              </nav>
            </div>
          </footer>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Script src="/matomo.js" strategy="afterInteractive" />
          <MatomoRouteTracker />
        </body>
      </html>
    </StoryblokProvider>
  );
}
