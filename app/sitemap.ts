import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.kaleidoo.co.uk/",
      lastModified: new Date("2025-06-29"),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "en-GB": "https://www.kaleidoo.co.uk/",
          en:      "https://www.kaleidoo.co.uk/",
        },
      },
    },
  ];
}
