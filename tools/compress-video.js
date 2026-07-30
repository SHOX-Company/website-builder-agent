#!/usr/bin/env node
// =============================================================================
// Tool: compress-video.js
// Purpose: Compress a raw video for web hero autoplay.
//          Output: H.264, 1080p max on longest dimension, no audio, <15MB, loop-clean.
//
// Uses ffmpeg-static — NO system ffmpeg required.
// Run `npm install` in tools/ first (done automatically on first run).
//
// Usage (defaults — processes hero.MP4 in root-flute/public/video/):
//   node tools/compress-video.js
//
// Usage (explicit):
//   node tools/compress-video.js \
//     --input  projects/root-flute/public/video/hero.MP4 \
//     --output projects/root-flute/public/video/hero.mp4 \
//     --duration 30 \
//     --target-mb 14
//
// Options:
//   --input      <path>   Source video file
//   --output     <path>   Destination .mp4 file
//   --ss         <secs>   Start offset in source (default: 0, fast keyframe seek)
//   --duration   <secs>   Output duration in seconds from --ss (default: 30, 0 = full)
//   --target-mb  <mb>     Target file size ceiling in MB (default: 14)
//   --crf        <int>    Force CRF mode instead of two-pass (e.g. 26, 28, 30)
//   --fps        <int>    Output framerate (default: 24)
//   --dry-run             Show the ffmpeg command without running it
//
// Output settings:
//   Codec:      libx264 (H.264)  — universal browser support
//   Profile:    high / level 4.1 — required for iOS/Safari autoplay
//   Pixel fmt:  yuv420p          — required for web
//   Audio:      stripped (-an)   — muted autoplay
//   Faststart:  +faststart       — moov atom first for instant web playback
//   Scale:      1920px on longest dimension, lanczos filter
//   FPS:        24               — halves data vs 60fps source
// =============================================================================

const { execSync, spawnSync } = require("child_process");
const path  = require("path");
const fs    = require("fs");

// ─── Resolve root ─────────────────────────────────────────────────────────────
const TOOLS_DIR = __dirname;
const ROOT      = path.resolve(TOOLS_DIR, "..");

// ─── Parse CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag, defaultVal) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : defaultVal;
}
const DRY_RUN = args.includes("--dry-run");

const INPUT_DEFAULT = path.join(ROOT, "projects/root-flute/public/video/hero.MP4");
const INPUT  = path.resolve(getArg("--input",  INPUT_DEFAULT));
const OUTPUT = path.resolve(getArg("--output", path.join(path.dirname(INPUT), "hero.mp4")));

const DURATION   = parseInt(getArg("--duration",  "30"), 10);
const START_SS   = parseFloat(getArg("--ss",        "0"));
const TARGET_MB  = parseFloat(getArg("--target-mb", "14"));
const FPS        = parseInt(getArg("--fps",        "24"), 10);
const CRF_FORCE  = getArg("--crf", null);
const PASSLOG    = "/tmp/rf_ffmpeg2pass";
const TMP_OUTPUT = OUTPUT.replace(/\.mp4$/i, "_tmp.mp4");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const log  = (m) => console.log(`  ${m}`);
const ok   = (m) => console.log(`  ✓ ${m}`);
const warn = (m) => console.log(`  ⚠ ${m}`);
const die  = (m) => { console.error(`\n  ✗ ${m}\n`); process.exit(1); };

// ─── Auto-install ffmpeg-static if missing ─────────────────────────────────--
function ensureDeps() {
  const nm = path.join(TOOLS_DIR, "node_modules");
  if (!fs.existsSync(nm)) {
    log("Installing ffmpeg-static (first run, ~60MB download)...");
    execSync("npm install --cache /tmp/npm-cache", { cwd: TOOLS_DIR, stdio: "inherit" });
  }
}
ensureDeps();

const ffmpegPath  = require(path.join(TOOLS_DIR, "node_modules/ffmpeg-static"));
const ffprobeObj  = require(path.join(TOOLS_DIR, "node_modules/ffprobe-static"));
const ffprobePath = ffprobeObj.path || ffprobeObj;

// ─── Probe source video ───────────────────────────────────────────────────────
function probeVideo(inputPath) {
  const result = spawnSync(
    ffprobePath,
    ["-v", "quiet", "-print_format", "json", "-show_streams", "-show_format", inputPath],
    { encoding: "utf8" }
  );

  if (result.error)            die(`ffprobe process error: ${result.error.message}`);
  if (result.status !== 0)     die(`ffprobe exited ${result.status}.\nstderr: ${result.stderr}`);
  if (!result.stdout?.trim())  die("ffprobe returned empty output. Is the file valid?");

  try {
    return JSON.parse(result.stdout);
  } catch (e) {
    die(`ffprobe output could not be parsed as JSON.\nOutput: ${result.stdout.slice(0, 200)}`);
  }
}

// ─── Build scale filter (portrait-safe) ──────────────────────────────────────
// 1920px cap applied to the LONGEST dimension, preserving aspect ratio.
// Portrait:  2160×3840 → 1080×1920
// Landscape: 3840×2160 → 1920×1080
// Square:    2160×2160 → 1920×1920
function buildScaleFilter(w, h, maxDim = 1920) {
  if (Math.max(w, h) <= maxDim) {
    // Already within limits — no upscaling, just ensure even dimensions
    return `scale=trunc(iw/2)*2:trunc(ih/2)*2`;
  }
  if (h >= w) {
    // Portrait or square — cap height
    return `scale=-2:${maxDim}:flags=lanczos`;
  } else {
    // Landscape — cap width
    return `scale=${maxDim}:-2:flags=lanczos`;
  }
}

// ─── Target bitrate calculation ───────────────────────────────────────────────
function targetKbps(targetMB, durationSec) {
  const targetBits = targetMB * 1024 * 1024 * 8 * 0.93; // 7% container headroom
  return Math.floor(targetBits / durationSec / 1000);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log("\n  Root Flute — Video Compressor");
console.log("  ────────────────────────────────────");

if (!fs.existsSync(INPUT)) {
  die(`Input file not found:\n       ${INPUT}`);
}

// ─── Safety: prevent overwriting source on case-insensitive filesystems ───────
// macOS APFS/HFS+ is case-insensitive: hero.MP4 === hero.mp4 at the OS level.
// If INPUT and OUTPUT resolve to the same path (ignoring case), abort immediately.
if (INPUT.toLowerCase() === OUTPUT.toLowerCase()) {
  die(
    `INPUT and OUTPUT resolve to the same file on a case-insensitive filesystem.\n` +
    `       INPUT:  ${INPUT}\n` +
    `       OUTPUT: ${OUTPUT}\n\n` +
    `       Fix: pass --output with a different name, e.g.:\n` +
    `         --output ${OUTPUT.replace(/\/([^/]+)$/, "/hero-web.mp4")}`
  );
}

const srcBytes = fs.statSync(INPUT).size;
if (srcBytes < 1024) {
  die(`Source file is only ${srcBytes} bytes — it may be corrupted or empty.\n` +
      `       Please restore the original file before compressing.`);
}
log(`Source:    ${INPUT}`);
log(`Size:      ${(srcBytes / 1024 / 1024).toFixed(0)}MB`);
log(`Output:    ${OUTPUT}`);
log("");

ok(`ffmpeg:    ${ffmpegPath}`);
ok(`ffprobe:   ${ffprobePath}`);
log("");

// Probe
log("Probing source...");
const probe = probeVideo(INPUT);
const videoStream = probe.streams.find((s) => s.codec_type === "video");
if (!videoStream) die("No video stream found in source file.");

const srcDuration = parseFloat(probe.format.duration || "0");
const srcWidth    = videoStream.width;
const srcHeight   = videoStream.height;
const fpsRaw      = videoStream.r_frame_rate || "30/1"; // e.g. "60/1"
const [fpNum, fpDen] = fpsRaw.split("/").map(Number);
const srcFps      = fpNum / (fpDen || 1);

ok(`Resolution: ${srcWidth}×${srcHeight} (${srcWidth < srcHeight ? "portrait 9:16" : "landscape"})`);
ok(`Framerate:  ${srcFps.toFixed(2)}fps → ${FPS}fps output`);
ok(`Duration:   ${srcDuration.toFixed(1)}s`);
log("");

// Determine clip duration
const clipDur = DURATION > 0 && DURATION < srcDuration ? DURATION : srcDuration;
if (START_SS > 0) {
  log(`Seek:      starting at ${START_SS}s`);
}
if (DURATION > 0 && DURATION < srcDuration) {
  log(`Trimming:  ${clipDur}s from ${START_SS}s (ends at ${START_SS + clipDur}s of ${srcDuration.toFixed(1)}s source)`);
} else {
  log(`Duration:  using full ${srcDuration.toFixed(1)}s from ${START_SS}s`);
}

// Scale filter
const scaleFilter = buildScaleFilter(srcWidth, srcHeight, 1920);
log(`Scale:     ${scaleFilter}`);

// Encode mode
const bitrateKbps = targetKbps(TARGET_MB, clipDur);
if (CRF_FORCE) {
  log(`Encode:    CRF ${CRF_FORCE} (manual, file size not guaranteed)`);
} else {
  log(`Encode:    two-pass @ ${bitrateKbps}kbps (target ≤${TARGET_MB}MB in ${clipDur}s)`);
}
log(`FPS:       ${FPS}`);
log("");

// ─── Build ffmpeg argument sets ───────────────────────────────────────────────
const commonArgs = [
  // -ss before -i: fast keyframe seek (input option)
  ...(START_SS > 0 ? ["-ss", String(START_SS)] : []),
  "-i", INPUT,
  // -t after -i: output duration limit from the seek point
  ...(clipDur < srcDuration ? ["-t", String(clipDur)] : []),
  "-vf", `${scaleFilter},fps=${FPS}`,
  "-c:v", "libx264",
  "-profile:v", "high",
  "-level:v",   "4.1",
  "-pix_fmt",   "yuv420p",
  "-preset",    "slow",
  "-an", // no audio
];

let pass1Args, pass2Args;

if (CRF_FORCE) {
  // Single-pass CRF → encode to tmp, then remux with faststart
  pass1Args = null;
  pass2Args = [
    "-y",
    ...commonArgs,
    "-crf", CRF_FORCE,
    TMP_OUTPUT,   // no faststart here — added in remux step
  ];
} else {
  // Two-pass bitrate targeting → encode to tmp, then remux with faststart
  // NOTE: -movflags +faststart cannot be combined with -pass 2 (both call
  //       their step "second pass" internally and conflict). We remux separately.
  pass1Args = [
    "-y",
    ...commonArgs,
    "-b:v", `${bitrateKbps}k`,
    "-pass", "1",
    "-passlogfile", PASSLOG,
    "-f", "null", "/dev/null",
  ];
  pass2Args = [
    "-y",
    ...commonArgs,
    "-b:v", `${bitrateKbps}k`,
    "-pass", "2",
    "-passlogfile", PASSLOG,
    TMP_OUTPUT,   // no faststart here — added in remux step below
  ];
}

// Step 3: remux tmp → final output with +faststart (stream copy, instant)
const remuxArgs = [
  "-y",
  "-i", TMP_OUTPUT,
  "-c", "copy",
  "-movflags", "+faststart",
  OUTPUT,
];

// ─── Dry run ──────────────────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log("  DRY RUN — commands:\n");
  if (pass1Args) {
    console.log(`  # Pass 1 — analysis\n  ${ffmpegPath} ${pass1Args.join(" ")}\n`);
  }
  console.log(`  # ${CRF_FORCE ? "Encode" : "Pass 2"} → tmp file\n  ${ffmpegPath} ${pass2Args.join(" ")}\n`);
  console.log(`  # Remux: add faststart (stream copy, no re-encode)\n  ${ffmpegPath} ${remuxArgs.join(" ")}\n`);
  process.exit(0);
}

// ─── Execute ──────────────────────────────────────────────────────────────────
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

function runFfmpeg(label, ffArgs) {
  console.log(`  ${label}...`);
  const result = spawnSync(ffmpegPath, ffArgs, { stdio: "inherit" });
  if (result.error)        die(`ffmpeg process error: ${result.error.message}`);
  if (result.status !== 0) die(`ffmpeg exited with status ${result.status}`);
}

try {
  if (pass1Args) runFfmpeg("Pass 1/2 — analyzing (this may take a few minutes)", pass1Args);
  runFfmpeg(pass1Args ? "Pass 2/2 — encoding to temp file" : "Encoding to temp file", pass2Args);
  runFfmpeg("Remuxing: adding faststart for web (stream copy, instant)", remuxArgs);
} finally {
  // Clean up two-pass log files and temp file
  [`${PASSLOG}-0.log`, `${PASSLOG}-0.log.mbtree`].forEach((f) => {
    try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
  });
  try { if (fs.existsSync(TMP_OUTPUT)) fs.unlinkSync(TMP_OUTPUT); } catch {}
}

// ─── Report ───────────────────────────────────────────────────────────────────
const outBytes = fs.statSync(OUTPUT).size;
const outMB    = outBytes / 1024 / 1024;
const savings  = ((1 - outBytes / srcBytes) * 100).toFixed(0);

console.log("\n  ────────────────────────────────────");
ok(`Output:    ${OUTPUT}`);
ok(`File size: ${outMB.toFixed(1)}MB  (${savings}% smaller than source)`);
ok(`Duration:  ${clipDur}s`);
ok(`Faststart: enabled (web-ready)`);

if (outMB > TARGET_MB) {
  warn(`${(outMB - TARGET_MB).toFixed(1)}MB over the ${TARGET_MB}MB target. To reduce:`);
  warn(`  Shorter clip: --duration 20`);
  warn(`  More compression: --crf 30`);
} else {
  ok(`Under ${TARGET_MB}MB target ✓`);
}

console.log(`\n  Drop ${OUTPUT} is ready.`);
console.log(`  Verify loop at: http://localhost:3000\n`);
