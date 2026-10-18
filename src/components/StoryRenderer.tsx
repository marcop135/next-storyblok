import type { ISbStoryData } from "@storyblok/react";
import {
  StoryblokServerComponent,
  StoryblokStory,
} from "@storyblok/react/rsc";

import { registerStoryblokComponents } from "@/lib/storyblok";

type Props = {
  story: ISbStoryData;
  source: "storyblok" | "mock";
  preview?: boolean;
};

export default function StoryRenderer({ story, source, preview = false }: Props) {
  registerStoryblokComponents();
  if (preview && source === "storyblok") return <StoryblokStory story={story} />;
  // Public renders must not consume the SDK's process-wide live-editing cache.
  return <StoryblokServerComponent blok={story.content} />;
}
