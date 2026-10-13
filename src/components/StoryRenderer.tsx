import type { ISbStoryData, SbBlokData } from "@storyblok/react";
import {
  StoryblokLiveEditing,
  StoryblokStory,
} from "@storyblok/react/rsc";

import Page from "@/components/Page";
import type { PageBlok } from "@/components/types";

type Props = {
  story: ISbStoryData;
  source: "storyblok" | "mock";
};

export default function StoryRenderer({ story, source }: Props) {
  if (source === "mock") {
    return <Page blok={story.content as PageBlok & SbBlokData} mock />;
  }

  return (
    <>
      <StoryblokStory story={story} />
      <StoryblokLiveEditing story={story} />
    </>
  );
}
