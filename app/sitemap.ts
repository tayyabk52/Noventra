import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const root = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3010";
  return ["", "/privacy", "/terms", "/resources/ai-readiness"].map(route => ({ url: `${root}${route}`, changeFrequency: "monthly", priority: route ? .5 : 1 }));
}
