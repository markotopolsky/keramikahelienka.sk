import type { MetadataRoute } from "next";
import { webUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    // The cart and checkout differ per visitor and have nothing to find
    rules: { userAgent: "*", allow: "/", disallow: ["/kosik", "/pokladna", "/en/kosik", "/en/pokladna"] },
    sitemap: `${webUrl}/sitemap.xml`,
  };
}
