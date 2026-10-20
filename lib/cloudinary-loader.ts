"use client";

// next/image loader. Code keeps the "/images/..." paths, so the files in public/images stay a working local copy.
import { cloudinaryUrl } from "@/lib/cloudinary";

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/images/")) return `${src}?w=${width}`;
  return cloudinaryUrl(src, ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`]);
}
