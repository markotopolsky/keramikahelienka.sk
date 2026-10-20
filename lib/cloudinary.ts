// Photos live on Cloudinary under keramikahelienka/<path below public/images, no extension>,
// uploaded by scripts/cloudinary-upload.mjs.
export const CLOUD_NAME = "dl6xldrhk";

/** Cloudinary URL of a "/images/..." photo with the given transformations */
export function cloudinaryUrl(src: string, params: string[]) {
  const publicId = `keramikahelienka/${src.slice("/images/".length).replace(/\.\w+$/, "")}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(",")}/${publicId}`;
}
