import {
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";

import type { PageBlok } from "@/components/types";

export default function Page({ blok }: { blok: PageBlok }) {
  return (
    <main id="main" {...storyblokEditable(blok)}>
      {blok.body?.map((nested) =>
        blok.show_block_labels ? (
          <div className="labelled-block" key={nested._uid}>
            <div className="wrap">
              <p className="block-label">{nested.component}</p>
            </div>
            <StoryblokServerComponent blok={nested} />
          </div>
        ) : (
          <StoryblokServerComponent blok={nested} key={nested._uid} />
        ),
      )}
    </main>
  );
}
