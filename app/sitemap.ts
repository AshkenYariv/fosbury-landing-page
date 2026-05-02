import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fosbury.ai";

/**
 * v1 sitemap lists only the public landing page. Stub routes (verticals,
 * personas, changelog, docs) carry noindex and are intentionally omitted
 * until they have content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
