"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import LanguageSwitch from "@/components/LanguageSwitch";
import { defaultLocale, localeForPathname, type Locale } from "@/lib/i18n";
import { REPO_URL } from "@/lib/site";

export type ChromeCopy = {
  nav: { _uid: string; label: string; href: string }[];
  footerNote: string;
};

/**
 * Header and footer pick their language from the current path on every
 * navigation. The root layout is not re-rendered on client-side navigation,
 * so a locale read on the server would stick to the first page loaded.
 */
function useLocale(): Locale {
  const locale = localeForPathname(usePathname() ?? "/");
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return locale;
}

export function SiteHeader({ copy }: { copy: Record<Locale, ChromeCopy> }) {
  const locale = useLocale();
  const home = locale === defaultLocale ? "/" : `/${locale}`;
  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "de" ? "Zum Inhalt springen" : "Skip to content"}
      </a>
      <header className="site-header">
        <div className="wrap">
          <Link className="brand" href={home}>
            Northline
          </Link>
          <nav className="nav" aria-label={locale === "de" ? "Hauptnavigation" : "Primary"}>
            {copy[locale].nav.map((link) => (
              <Link key={link._uid} href={link.href}>
                {link.label}
              </Link>
            ))}
            <LanguageSwitch current={locale} />
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter({ copy }: { copy: Record<Locale, ChromeCopy> }) {
  const locale = useLocale();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>{copy[locale].footerNote}</p>
        <nav className="footer-nav" aria-label="Footer">
          <a href={REPO_URL}>{locale === "de" ? "Quellcode auf GitHub" : "Source on GitHub"}</a>
          <Link href="/privacy">Privacy</Link>
          <a href="/llms.txt">llms.txt</a>
        </nav>
      </div>
    </footer>
  );
}
