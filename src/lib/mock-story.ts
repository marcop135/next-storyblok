import type { ISbStoryData } from "@storyblok/react";

/** Local fallback so `npm run dev` works before a Storyblok space exists. */
export const mockHomeStory = {
  name: "Home",
  created_at: "2026-10-09T00:00:00.000Z",
  published_at: null,
  id: 1,
  uuid: "00000000-0000-0000-0000-000000000001",
  slug: "home",
  full_slug: "home",
  sort_by_date: null,
  position: 0,
  tag_list: [],
  is_startpage: true,
  parent_id: 0,
  meta_data: null,
  group_id: "00000000-0000-0000-0000-000000000001",
  first_published_at: null,
  release_id: null,
  lang: "default",
  path: null,
  alternates: [],
  default_full_slug: null,
  translated_slugs: null,
  content: {
    _uid: "page-home",
    component: "page",
    seo_title: "Northline — Localized marketing sites that ship",
    seo_description:
      "Northline helps product and marketing teams publish localized pages from one Storyblok-driven Next.js stack.",
    body: [
      {
        _uid: "hero-1",
        component: "hero",
        eyebrow: "Northline",
        headline: "Ship every market from one content model",
        subheadline:
          "Editors own copy and structure in Storyblok. Developers own the Next.js components, preview, and cache.",
        cta_label: "See pricing",
        cta_href: "/pricing",
      },
      {
        _uid: "grid-1",
        component: "feature_grid",
        headline: "Built for marketing-site ownership",
        features: [
          {
            _uid: "f1",
            component: "feature",
            title: "Block-based pages",
            text: "Hero, feature grid, and CTA band map 1:1 to Storyblok components. New sections are code, not CMS plugins.",
          },
          {
            _uid: "f2",
            component: "feature",
            title: "Editor-safe changes",
            text: "Publish in Storyblok. The app revalidates. No deploy for a headline tweak.",
          },
          {
            _uid: "f3",
            component: "feature",
            title: "Draft preview",
            text: "Visual Editor and draftMode show unpublished stories before they go live.",
          },
        ],
      },
      {
        _uid: "cta-1",
        component: "cta_band",
        headline: "Ready when your markets are",
        text: "Connect a Storyblok space, point the preview URL, and Northline pages stay CMS-owned from day one.",
        cta_label: "View pricing",
        cta_href: "/pricing",
      },
    ],
  },
} as unknown as ISbStoryData;

export const mockPricingStory = {
  name: "Pricing",
  created_at: "2026-10-09T00:00:00.000Z",
  published_at: null,
  id: 2,
  uuid: "00000000-0000-0000-0000-000000000002",
  slug: "pricing",
  full_slug: "pricing",
  sort_by_date: null,
  position: 1,
  tag_list: [],
  is_startpage: false,
  parent_id: 0,
  meta_data: null,
  group_id: "00000000-0000-0000-0000-000000000002",
  first_published_at: null,
  release_id: null,
  lang: "default",
  path: null,
  alternates: [],
  default_full_slug: null,
  translated_slugs: null,
  content: {
    _uid: "page-pricing",
    component: "page",
    seo_title: "Pricing — Northline",
    seo_description:
      "Simple plans for teams that want Storyblok-driven marketing pages without a CMS rebuild every quarter.",
    body: [
      {
        _uid: "hero-pricing",
        component: "hero",
        eyebrow: "Pricing",
        headline: "One content model. Every locale.",
        subheadline:
          "Start with the Starter space. Grow when markets and editors do. No per-page redesign tax.",
        cta_label: "Back home",
        cta_href: "/",
      },
      {
        _uid: "grid-pricing",
        component: "feature_grid",
        headline: "What you get",
        features: [
          {
            _uid: "p1",
            component: "feature",
            title: "Starter",
            text: "Home + pricing pages, draft preview, and publish webhooks on the free Storyblok Starter.",
          },
          {
            _uid: "p2",
            component: "feature",
            title: "Growth",
            text: "More locales, SEO fields per page, and on-demand revalidation as traffic climbs.",
          },
          {
            _uid: "p3",
            component: "feature",
            title: "Owner seat",
            text: "You keep the component map and the Vercel project. Editors keep the stories.",
          },
        ],
      },
      {
        _uid: "cta-pricing",
        component: "cta_band",
        headline: "Prefer a walkthrough?",
        text: "This page is the same block system as home. Swap copy in Storyblok and the route updates.",
        cta_label: "Go home",
        cta_href: "/",
      },
    ],
  },
} as unknown as ISbStoryData;

export function mockStoryForSlug(slug: string): ISbStoryData | null {
  if (slug === "home" || slug === "") {
    return mockHomeStory;
  }
  if (slug === "pricing") {
    return mockPricingStory;
  }
  return null;
}
