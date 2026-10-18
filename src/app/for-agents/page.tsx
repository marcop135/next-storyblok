import type { Metadata } from "next";

import { OG_IMAGE, REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const title = "For agents";
const description =
  "How AI agents read Next Story: server-rendered HTML, llms.txt, sitemap, hreflang, and JSON-LD. No public API, MCP, or login.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/for-agents" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title,
    description,
    url: "/for-agents",
    images: [OG_IMAGE],
  },
};

const surfaces = [
  ["/llms.txt", "Site map, docs links, and what each page shows."],
  ["/sitemap.xml", "Every published page in English and German, built from the Storyblok Links API."],
  ["/robots.txt", "Crawl rules and content signals: search and AI input yes, AI training no."],
  ["/", "Server-rendered HTML with JSON-LD (WebSite, SoftwareSourceCode, Person) and hreflang alternates."],
];

export default function ForAgentsPage() {
  return (
    <main id="main" className="wrap prose">
      <h1>For agents</h1>
      <p>
        Discovery notes for {SITE_NAME} at {SITE_URL.replace("https://", "")},
        a Next.js App Router demo whose pages come from Storyblok blocks.
      </p>

      <h2>How to read the site</h2>
      <ol>
        <li>
          Start at <a href="/llms.txt">/llms.txt</a> for the page list and docs.
        </li>
        <li>
          Fetch any page as plain HTML: content is rendered on the server, so
          no JavaScript is needed to read it.
        </li>
        <li>
          German routes live under <code>/de</code>; each page links its other
          language through <code>hreflang</code>.
        </li>
        <li>
          For how it is built, read the <a href={REPO_URL}>source on GitHub</a>,
          starting with <code>docs/architecture.md</code>.
        </li>
      </ol>

      <h2>Surfaces</h2>
      <ul>
        {surfaces.map(([path, purpose]) => (
          <li key={path}>
            <a href={path}>
              <code>{path}</code>
            </a>
            : {purpose}
          </li>
        ))}
      </ul>

      <h2>What this is not</h2>
      <ul>
        <li>No public API, hosted MCP, or WebMCP tools.</li>
        <li>
          <code>/api/preview</code> and <code>/api/revalidate</code> serve
          Storyblok only and require a secret.
        </li>
        <li>No accounts, API keys, or OAuth.</li>
      </ul>
    </main>
  );
}
