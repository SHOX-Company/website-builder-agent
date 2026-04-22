import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "../public/images");
const OG_W = 1200;
const OG_H = 630;

// Bottom vignette + text overlay
function makeTextOverlay(title, subtitle) {
  return Buffer.from(`<svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(0,0,0,0.20)" />
      <stop offset="50%"  stop-color="rgba(0,0,0,0.05)" />
      <stop offset="72%"  stop-color="rgba(0,0,0,0.45)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.82)" />
    </linearGradient>
  </defs>
  <rect width="${OG_W}" height="${OG_H}" fill="url(#vignette)" />

  <text x="64" y="${OG_H - 86}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="62" font-weight="300"
    fill="white" opacity="0.97"
  >${title}</text>

  <rect x="64" y="${OG_H - 70}" width="320" height="1" fill="rgba(196,151,58,0.65)" />

  <text x="64" y="${OG_H - 42}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="18" font-weight="300"
    fill="rgba(196,151,58,0.90)" letter-spacing="4"
  >${subtitle.toUpperCase()}</text>
</svg>`);
}

async function gen({ src, dest, title, subtitle, gravity = "centre", preCropRight = 0 }) {
  // Optional: strip rightmost N pixels from source before scaling (removes UI artifacts)
  let source = src;
  if (preCropRight > 0) {
    const meta = await sharp(src).metadata();
    const croppedBuf = await sharp(src)
      .extract({ left: 0, top: 0, width: meta.width - preCropRight, height: meta.height })
      .toBuffer();
    source = croppedBuf;
  }

  await sharp(source)
    .resize(OG_W, OG_H, { fit: "cover", position: gravity })
    .composite([{ input: makeTextOverlay(title, subtitle), top: 0, left: 0 }])
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(dest);

  console.log(`✓ ${path.basename(dest)}`);
}

const DOWNLOADS = "/Users/theytyholiday/Downloads";

await gen({
  src: path.join(DOWNLOADS, "Screenshot_20260422-114354.png"),
  dest: path.join(IMAGES_DIR, "og-flutes.jpg"),
  title: "RootFlute",
  subtitle: "Rare Handcrafted Instruments",
  gravity: "centre",
});

await gen({
  src: path.join(DOWNLOADS, "Screenshot_20260422-114203.png"),
  dest: path.join(IMAGES_DIR, "og-community.jpg"),
  title: "RootFlute",
  subtitle: "Sacred Sound Community",
  gravity: "north",
  // Source is 479x634; play button is in the rightmost ~110px — strip it before scaling
  preCropRight: 110,
});

console.log("Done.");
