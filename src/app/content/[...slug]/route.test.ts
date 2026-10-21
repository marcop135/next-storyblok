import { beforeEach, expect, it, vi } from "vitest";
import { GET } from "./route";
import { mockHomeStory } from "@/lib/mock-story";
const { fetchStory } = vi.hoisted(() => ({ fetchStory: vi.fn() }));
vi.mock("@/lib/fetch-story", () => ({ fetchStory }));
const request = (path: string) => GET(new Request("https://example.com/content/" + path, { headers: { cookie: "__prerender_bypass=editor" } }), { params: Promise.resolve({ slug: path.split("/") }) });

beforeEach(() => fetchStory.mockResolvedValue({ story: mockHomeStory, source: "storyblok" }));

it("forces published delivery, carries locale, and does not add a stale response cache", async () => {
  const response = await request("de/index.md");
  expect(fetchStory).toHaveBeenCalledWith("home", "de", { version: "published" });
  expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("link")).toContain("/de>; rel=\"canonical\"");
  expect(await response.text()).toContain("published representation");
});

it("keeps missing pages, private paths, non-page stories, and outages distinct", async () => {
  expect((await request("config.md")).status).toBe(404);
  expect(fetchStory).not.toHaveBeenCalled();
  fetchStory.mockResolvedValueOnce(null);
  expect((await request("missing.md")).status).toBe(404);
  fetchStory.mockResolvedValueOnce({ story: { content: { component: "config" } }, source: "mock" });
  expect((await request("private.md")).status).toBe(404);
  fetchStory.mockRejectedValueOnce(new Error("secret-token-in-upstream-url"));
  const response = await request("index.md");
  expect(response.status).toBe(503);
  expect(await response.text()).not.toContain("secret-token");
});

it("renders portal Markdown from its inventory without fetching a CMS story", async () => {
  const response = await request("for-agents.md");
  expect(response.status).toBe(200);
  expect(await response.text()).toContain("Trace a block to code");
  expect(fetchStory).not.toHaveBeenCalled();
});
