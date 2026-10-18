"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import LanguageSwitch from "@/components/LanguageSwitch";
import { defaultLocale, localeForPathname, type Locale } from "@/lib/i18n";
import { AUTHOR } from "@/lib/site";

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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const home = locale === defaultLocale ? "/" : `/${locale}`;

  // Close the small-screen menu after navigating or on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "de" ? "Zum Inhalt springen" : "Skip to content"}
      </a>
      <header className="site-header">
        <div className="wrap">
          <Link className="brand" href={home}>
            Next Story
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen(!open)}
          >
            <span className="menu-toggle__icon" aria-hidden="true" />
            <span className="visually-hidden">{locale === "de" ? "Menü" : "Menu"}</span>
          </button>
          <nav
            id="site-nav"
            className="nav"
            data-open={open}
            aria-label={locale === "de" ? "Hauptnavigation" : "Primary"}
          >
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
        <div>
          <p>{copy[locale].footerNote}</p>
          <p>
            {locale === "de" ? "Entwickelt und gepflegt von" : "Built and maintained by"}{" "}
            <a href={AUTHOR.url}>{AUTHOR.name}</a>
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <Link href="/privacy">Privacy</Link>
          <Link href="/for-agents">For agents</Link>
          <a href="/llms.txt">llms.txt</a>
        </nav>
      </div>
    </footer>
  );
}
