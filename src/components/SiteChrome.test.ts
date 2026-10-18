import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, it, vi } from "vitest";

import { SiteFooter, SiteHeader, type ChromeCopy } from "@/components/SiteChrome";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname }));

const copy: Record<"en" | "de", ChromeCopy> = {
  en: { nav: [{ _uid: "a", label: "Pricing", href: "/pricing" }], footerNote: "Northline demo" },
  de: { nav: [{ _uid: "a", label: "Preise", href: "/de/pricing" }], footerNote: "Northline-Demo" },
};

beforeEach(() => usePathname.mockReset());

it("keeps German navigation on every German route, whatever page loaded first", () => {
  usePathname.mockReturnValue("/de/how-it-works");
  const html = renderToStaticMarkup(createElement(SiteHeader, { copy }));
  expect(html).toContain('href="/de/pricing"');
  expect(html).toContain(">Preise<");
  expect(html).toContain('href="/de"');
  expect(html).not.toContain('href="/pricing"');
});

it("switches the header and footer back to English on English routes", () => {
  usePathname.mockReturnValue("/blocks");
  const header = renderToStaticMarkup(createElement(SiteHeader, { copy }));
  const footer = renderToStaticMarkup(createElement(SiteFooter, { copy }));
  expect(header).toContain('href="/pricing"');
  expect(footer).toContain("Northline demo");
  expect(footer).toContain("Source on GitHub");
});
