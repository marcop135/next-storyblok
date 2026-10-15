import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchStory } from "@/lib/fetch-story";
import { mockHomeStory } from "@/lib/mock-story";

const { draftMode } = vi.hoisted(() => ({ draftMode: vi.fn() }));
vi.mock("next/headers", () => ({ draftMode }));
vi.mock("@/lib/storyblok", () => ({
  hasStoryblokToken: () => Boolean(process.env.STORYBLOK_DELIVERY_API_TOKEN?.trim()),
}));

beforeEach(() => {
  vi.stubEnv("STORYBLOK_DELIVERY_API_TOKEN", "test-token");
  vi.stubEnv("STORYBLOK_REGION", "eu");
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("STORYBLOK_VERSION", "draft");
  draftMode.mockResolvedValue({ isEnabled: false });
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => Response.json({ story: mockHomeStory })));
});

describe("content delivery", () => {
  it("never serves drafts to public production requests, even with a draft env setting", async () => {
    await fetchStory("home");
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(new URL(String(url)).searchParams.get("version")).toBe("published");
    expect(options).toMatchObject({ cache: "force-cache", next: { tags: expect.arrayContaining(["storyblok"]) } });
  });

  it("bypasses the cache for authenticated preview and preserves the locale", async () => {
    draftMode.mockResolvedValue({ isEnabled: true });
    await fetchStory("pricing", "de");
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(new URL(String(url)).searchParams.get("version")).toBe("draft");
    expect(new URL(String(url)).searchParams.get("language")).toBe("de");
    expect(options).toMatchObject({ cache: "no-store" });
    expect(options?.next).toBeUndefined();
  });

  it("can verify an unpublished story before enabling the preview cookie", async () => {
    await fetchStory("home", undefined, { version: "draft" });
    expect(new URL(String(vi.mocked(fetch).mock.calls[0][0])).searchParams.get("version")).toBe("draft");
  });

  it("uses the same story tag for every language and a different tag for another story", async () => {
    await fetchStory("home");
    await fetchStory("home", "de");
    await fetchStory("pricing");
    const tags = vi.mocked(fetch).mock.calls.map(([, options]) => options?.next?.tags);
    expect(tags[0]).toEqual(tags[1]);
    expect(tags[0]).not.toEqual(tags[2]);
  });

  it("uses offline fixtures only when no token is configured", async () => {
    vi.stubEnv("STORYBLOK_DELIVERY_API_TOKEN", "");
    expect(await fetchStory("home")).toMatchObject({ source: "mock" });
    expect(await fetchStory("missing")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("distinguishes an absent story from a CMS outage", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));
    expect(await fetchStory("missing")).toBeNull();
    vi.mocked(fetch).mockResolvedValueOnce(new Response("upstream failure", { status: 503 }));
    await expect(fetchStory("home")).rejects.toThrow("503");
  });

  it("does not turn a network failure into a missing page or leak the token", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("https://api.storyblok.com?token=test-token"));
    await expect(fetchStory("home")).rejects.toThrow("Storyblok request failed");
    await expect(fetchStory("home")).rejects.not.toThrow("test-token");
  });

  it("rejects malformed delivery responses", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(Response.json({ story: null }));
    await expect(fetchStory("home")).rejects.toThrow("Invalid Storyblok response");
  });
});
