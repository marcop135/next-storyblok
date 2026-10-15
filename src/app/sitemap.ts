import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const paths = ["/", "/pricing", "/de", "/de/pricing", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
  }));
}
