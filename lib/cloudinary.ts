// Photos live in two places:
// - "/images/..." paths from the code: files in public/images, mirrored on Cloudinary under
//   keramikahelienka/<path below public/images, no extension> by scripts/cloudinary-upload.mjs;
// - full https://res.cloudinary.com/... URLs of photos uploaded in /admin.
// Without NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME the "/images/..." paths are served from public/ as they are.
export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

/** Folder prefix of everything this site keeps on Cloudinary */
export const CLOUDINARY_PREFIX = "keramikahelienka";

const UPLOAD_MARKER = "/image/upload/";

function hasTransform(segment: string) {
  if (/^v\d+$/.test(segment)) return false;
  return /^[a-z]+_[^/]*$/.test(segment);
}

/** Puts transformations into a Cloudinary delivery URL, unless it already has some */
function withTransform(url: string, params: string[]) {
  const at = url.indexOf(UPLOAD_MARKER);
  if (at === -1) return url;
  const rest = url.slice(at + UPLOAD_MARKER.length);
  if (hasTransform(rest.split("/")[0])) return url;
  return `${url.slice(0, at + UPLOAD_MARKER.length)}${params.join(",")}/${rest}`;
}

/**
 * Cloudinary URL of a photo with the given transformations. Takes a "/images/..." path or a
 * res.cloudinary.com URL; anything else (and "/images/..." without a cloud name) is returned unchanged.
 */
export function cloudinaryUrl(src: string, params: string[]) {
  if (src.includes("res.cloudinary.com")) return withTransform(src, params);
  if (!src.startsWith("/images/") || !CLOUD_NAME) return src;
  const publicId = `${CLOUDINARY_PREFIX}/${src.slice("/images/".length).replace(/\.\w+$/, "")}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(",")}/${publicId}`;
}

/** Same as the reference project: c_limit, width, automatic quality and format */
export function optimizedImageUrl(url: string, width = 1600) {
  if (!url.includes("res.cloudinary.com")) return url;
  return withTransform(url, [`c_limit`, `w_${width}`, "q_auto", "f_auto"]);
}

async function upload(file: File, folder: string, resource: "image" | "auto", what: string) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Chýba NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME alebo NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resource}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let message = `Nahrávanie zlyhalo (HTTP ${res.status}).`;
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message;
    } catch {}
    throw new Error(message);
  }

  const json = (await res.json()) as { secure_url?: string };
  if (!json.secure_url) throw new Error(`Cloudinary nevrátil URL ${what}.`);
  return json.secure_url;
}

/** Uploads a photo straight from the browser with the unsigned preset; returns its secure_url */
export function uploadImage(file: File, folder: string) {
  return upload(file, folder, "image", "nahranej fotky");
}

/** Uploads a file (PDF) the same way */
export function uploadFile(file: File, folder: string) {
  return upload(file, folder, "auto", "nahraného súboru");
}
