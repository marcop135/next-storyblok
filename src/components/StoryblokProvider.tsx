"use client";

import type { ReactNode } from "react";

import { getStoryblokApi, hasStoryblokToken } from "@/lib/storyblok";

export default function StoryblokProvider({ children }: { children: ReactNode }) {
  if (hasStoryblokToken()) {
    getStoryblokApi();
  }
  return children;
}
