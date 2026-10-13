import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import StoryblokProvider from "@/components/StoryblokProvider";

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
  metadataBase: new URL("https://next-storyblok.marcopontili.com"),
  title: {
    default: "Northline",
    template: "%s · Northline",
  },
  description:
    "Localized marketing sites on Next.js App Router and Storyblok.",
  openGraph: {
    title: "next-storyblok",
    description:
      "Next.js App Router + Storyblok marketing-site ownership demo.",
    url: "https://next-storyblok.marcopontili.com",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <StoryblokProvider>
      <html lang="en" className={`${display.variable} ${sans.variable}`}>
        <body>
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
              Northline demo · Next.js App Router · Storyblok
            </div>
          </footer>
        </body>
      </html>
    </StoryblokProvider>
  );
}
