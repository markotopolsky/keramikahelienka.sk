"use client";

// next/image loader. Code keeps the "/images/..." paths, so the files in public/images stay a working local copy;
// photos uploaded in /admin come as res.cloudinary.com URLs and get the same transformations.
import { CLOUD_NAME, cloudinaryUrl } from "@/lib/cloudinary";

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const cloudinary = src.includes("res.cloudinary.com") || (src.startsWith("/images/") && CLOUD_NAME);
  if (!cloudinary) return `${src}?w=${width}`;
  return cloudinaryUrl(src, ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`]);
}
