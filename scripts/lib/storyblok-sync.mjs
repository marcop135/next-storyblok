/**
 * Push the content model and seed stories in storyblok/ to a Storyblok space
 * through the Management API. Transport is injected, so the same plan runs
 * from the CLI (personal access token) or any other authenticated client.
 *
 * request(method, path, body) resolves to the parsed JSON response and throws
 * on a non-2xx status. Paths are relative to /v1/spaces/<space id>.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function loadSeed(root = "storyblok") {
  const components = JSON.parse(readFileSync(join(root, "components.json"), "utf8"));
  const stories = readdirSync(join(root, "stories"))
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(readFileSync(join(root, "stories", file), "utf8")));
  return { components, stories };
}

export async function syncSpace({
  request,
  components,
  stories,
  publish = true,
  dryRun = false,
  log = console.log,
}) {
  const { components: remote = [] } = await request("GET", "/components");
  const byName = new Map(remote.map((component) => [component.name, component]));

  // New components first, so updated whitelists never point at a missing block.
  const ordered = [...components].sort((a, b) => Number(byName.has(a.name)) - Number(byName.has(b.name)));
  for (const component of ordered) {
    const existing = byName.get(component.name);
    log(`${dryRun ? "would " : ""}${existing ? "update" : "create"} component ${component.name}`);
    if (dryRun) continue;
    if (existing) await request("PUT", `/components/${existing.id}`, { component });
    else await request("POST", "/components", { component });
  }

  for (const story of stories) {
    const found = await request("GET", `/stories?with_slug=${encodeURIComponent(story.slug)}`);
    const existing = found.stories?.[0];
    const payload = {
      story: { name: story.name, slug: story.slug, content: story.content },
      publish: publish ? 1 : 0,
    };
    log(`${dryRun ? "would " : ""}${existing ? "update" : "create"} story ${story.slug}${publish ? " and publish" : ""}`);
    if (dryRun) continue;
    if (existing) await request("PUT", `/stories/${existing.id}`, payload);
    else await request("POST", "/stories", payload);
  }
}
