import type { ISbStoryData, SbBlokData } from "@storyblok/react";
import {
  StoryblokServerComponent,
  StoryblokStory,
} from "@storyblok/react/rsc";

import Page from "@/components/Page";
import type { PageBlok } from "@/components/types";
import { registerStoryblokComponents } from "@/lib/storyblok";

type Props = {
  story: ISbStoryData;
  source: "storyblok" | "mock";
  preview?: boolean;
};

export default function StoryRenderer({ story, source, preview = false }: Props) {
  if (source === "mock") {
    return <Page blok={story.content as PageBlok & SbBlokData} mock />;
  }

  registerStoryblokComponents();
  if (preview) return <StoryblokStory story={story} />;
  // Public renders must not consume the SDK's process-wide live-editing cache.
  return <StoryblokServerComponent blok={story.content} />;
}
