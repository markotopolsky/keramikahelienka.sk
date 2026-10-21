// Prepares Cloudinary for uploads from /admin: the unsigned upload preset and one folder per
// section with photos (keramikahelienka/<section>), plus keramikahelienka/produkty.
// Usage: npm run setup:cloudinary
// Needs in .env.local: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
// CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (or CLOUDINARY_URL, which holds the last two).
const cloudinaryUrl = process.env.CLOUDINARY_URL ? new URL(process.env.CLOUDINARY_URL) : null;

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || cloudinaryUrl?.hostname;
const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const apiKey = process.env.CLOUDINARY_API_KEY || cloudinaryUrl?.username;
const apiSecret = process.env.CLOUDINARY_API_SECRET || (cloudinaryUrl && decodeURIComponent(cloudinaryUrl.password));

if (!cloud || !preset || !apiKey || !apiSecret) {
  console.error(
    "Chýbajú premenné v .env.local. Potrebné: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, " +
      "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (alebo CLOUDINARY_URL).",
  );
  process.exit(1);
}

const base = `https://api.cloudinary.com/v1_1/${cloud}`;
const auth = "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

async function api(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: auth,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: body ? new URLSearchParams(body).toString() : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

async function ensurePreset() {
  const list = await api("GET", "/upload_presets?max_results=500");
  const exists = (list.json?.presets ?? []).some((p) => p.name === preset);
  if (exists) {
    console.log(`✓ Upload preset "${preset}" už existuje.`);
    return;
  }
  const res = await api("POST", "/upload_presets", { name: preset, unsigned: "true" });
  if (res.ok) {
    console.log(`✓ Vytvorený unsigned upload preset "${preset}".`);
  } else {
    console.error(`✗ Preset "${preset}" sa nepodarilo vytvoriť:`, res.json?.error?.message ?? res.status);
    process.exitCode = 1;
  }
}

async function ensureFolder(path) {
  const res = await api("POST", `/folders/${path}`);
  if (res.ok) {
    console.log(`✓ Priečinok "${path}" pripravený.`);
  } else if (res.status === 409 || /exist/i.test(res.json?.error?.message ?? "")) {
    console.log(`✓ Priečinok "${path}" už existuje.`);
  } else {
    console.error(`✗ Priečinok "${path}" sa nepodarilo vytvoriť:`, res.json?.error?.message ?? res.status);
  }
}

const { SECTIONS, cloudinaryFolder } = await import("../lib/content-defaults.ts");

await ensurePreset();

await ensureFolder("keramikahelienka");
await ensureFolder(cloudinaryFolder("produkty"));
for (const s of SECTIONS) {
  if (s.images && Object.keys(s.images).length > 0) await ensureFolder(cloudinaryFolder(s.section));
}

console.log("\nHotovo. Nahrávanie fotiek z /admin je pripravené.");
