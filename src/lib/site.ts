export const SITE_URL = "https://nextstory.marcopontili.com";
export const SITE_NAME = "Next Story";
export const REPO_URL = "https://github.com/marcop135/next-storyblok";
export const SITE_DESCRIPTION =
  "Next.js App Router marketing site driven by Storyblok blocks: draft preview, publish webhooks, and localized cache refresh.";

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Next Story: Next.js App Router and Storyblok marketing-site demo",
};

export const AUTHOR = {
  name: "Marco Pontili",
  url: "https://marcopontili.com",
  email: "marco.pontili@gmail.com",
};

export const jsonLdFor = (inLanguage: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage,
      publisher: { "@id": `${SITE_URL}/#author` },
      about: { "@id": `${SITE_URL}/#code` },
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${SITE_URL}/#code`,
      name: "Next Story",
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      codeRepository: REPO_URL,
      programmingLanguage: "TypeScript",
      runtimePlatform: "Next.js",
      license: "https://opensource.org/license/mit",
      author: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: AUTHOR.name,
      url: AUTHOR.url,
      sameAs: ["https://github.com/marcop135"],
    },
  ],
});
