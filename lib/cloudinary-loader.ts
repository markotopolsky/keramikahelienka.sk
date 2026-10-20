"use client";

// next/image loader: photos live on Cloudinary under keramikahelienka/<path below public/images, no extension>,
// uploaded by scripts/cloudinary-upload.mjs. Code keeps the "/images/..." paths, so the files in
// public/images stay a working local copy.
const CLOUD_NAME = "dl6xldrhk";

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/images/")) return `${src}?w=${width}`;
  const publicId = `keramikahelienka/${src.slice("/images/".length).replace(/\.\w+$/, "")}`;
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(",")}/${publicId}`;
}
