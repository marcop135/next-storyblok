/**
 * Push storyblok/components.json and storyblok/stories/*.json to the space.
 *
 *   STORYBLOK_PERSONAL_ACCESS_TOKEN=... STORYBLOK_SPACE_ID=... node scripts/storyblok-push.mjs [--dry-run] [--draft]
 *
 * Writes go to the live space: components are created or replaced by name,
 * stories by slug, and published unless --draft is passed.
 */
import { loadSeed, syncSpace } from "./lib/storyblok-sync.mjs";

const token = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN?.trim();
const spaceId = process.env.STORYBLOK_SPACE_ID?.trim();
const region = (process.env.STORYBLOK_REGION || "eu").trim();
const dryRun = process.argv.includes("--dry-run");

if (!token || !spaceId) {
  console.error("Set STORYBLOK_PERSONAL_ACCESS_TOKEN and STORYBLOK_SPACE_ID.");
  process.exit(1);
}

const host = region === "eu" ? "mapi.storyblok.com" : `api-${region}.storyblok.com`;
const base = `https://${host}/v1/spaces/${spaceId}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(method, path, body) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    // Free plans allow about three Management API calls per second.
    await sleep(350);
    const res = await fetch(base + path, {
      method,
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429) continue;
    if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    return res.status === 204 ? {} : res.json();
  }
  throw new Error(`${method} ${path}: rate limited`);
}

await syncSpace({ request, ...loadSeed(), dryRun, publish: !process.argv.includes("--draft") });
console.log(dryRun ? "dry run complete" : "space in sync with storyblok/");
