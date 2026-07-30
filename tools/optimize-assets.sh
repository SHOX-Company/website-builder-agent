#!/usr/bin/env bash
# =============================================================================
# Tool: optimize-assets.sh
# Purpose: Compress and resize images or frame sequences for web delivery.
#          Outputs optimized files to the target directory.
#
# Interface:
#   --input   <path>    Source directory containing raw assets (required)
#   --output  <path>    Directory to write optimized assets into (required)
#   --type    <string>  Asset type: "image" or "frames" (default: "image")
#
# Usage (images):
#   bash tools/optimize-assets.sh \
#     --input ".tmp/images" \
#     --output "projects/my-site/public/images" \
#     --type image
#
# Usage (frame sequence):
#   bash tools/optimize-assets.sh \
#     --input ".tmp/frames/product-reveal" \
#     --output "projects/my-site/public/frames/product-reveal" \
#     --type frames
#
# Targets:
#   image:  < 200KB per file, WebP format, max width 1920px
#   frames: < 50KB per frame, WebP format, max width 1920px
#
# Requirements:
#   cwebp must be installed: brew install webp
#   ImageMagick must be installed: brew install imagemagick
#
# Notes:
#   - Output format is always WebP for smallest file size
#   - Original files in --input are NOT modified
#   - Run after extract-frames.sh, before committing to public/
# =============================================================================

set -euo pipefail

INPUT=""
OUTPUT=""
TYPE="image"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --input)  INPUT="$2";  shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    --type)   TYPE="$2";   shift 2 ;;
    *) echo "Unknown argument: $1" && exit 1 ;;
  esac
done

# Validate
if [[ -z "$INPUT" || -z "$OUTPUT" ]]; then
  echo "ERROR: --input and --output are required."
  echo "Usage: bash tools/optimize-assets.sh --input <dir> --output <dir> [--type image|frames]"
  exit 1
fi

if [[ ! -d "$INPUT" ]]; then
  echo "ERROR: Input directory not found: $INPUT"
  exit 1
fi

if ! command -v cwebp &>/dev/null; then
  echo "ERROR: cwebp is not installed. Run: brew install webp"
  exit 1
fi

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
  echo "ERROR: ImageMagick is not installed. Run: brew install imagemagick"
  exit 1
fi

CONVERT_CMD=$(command -v magick || command -v convert)

# Set quality based on type
if [[ "$TYPE" == "frames" ]]; then
  QUALITY=75
  MAX_WIDTH=1920
  TARGET_KB=50
else
  QUALITY=82
  MAX_WIDTH=1920
  TARGET_KB=200
fi

mkdir -p "$OUTPUT"

echo "Optimizing assets"
echo "  Input:   $INPUT"
echo "  Output:  $OUTPUT"
echo "  Type:    $TYPE"
echo "  Quality: $QUALITY"

PROCESSED=0
SKIPPED=0

for FILE in "$INPUT"/*.{png,jpg,jpeg,PNG,JPG,JPEG} 2>/dev/null; do
  [[ -f "$FILE" ]] || continue

  BASENAME=$(basename "$FILE")
  NAME="${BASENAME%.*}"
  OUT_FILE="$OUTPUT/${NAME}.webp"

  # Resize if wider than MAX_WIDTH, then convert to webp
  "$CONVERT_CMD" "$FILE" -resize "${MAX_WIDTH}x>" -quality 100 "/tmp/__opt_tmp.png"
  cwebp -q "$QUALITY" "/tmp/__opt_tmp.png" -o "$OUT_FILE" -quiet

  SIZE_KB=$(du -k "$OUT_FILE" | cut -f1)
  if [[ "$SIZE_KB" -gt "$TARGET_KB" ]]; then
    echo "  WARNING: $OUT_FILE is ${SIZE_KB}KB (target < ${TARGET_KB}KB)"
  fi

  PROCESSED=$((PROCESSED + 1))
done

rm -f /tmp/__opt_tmp.png

echo "Done. $PROCESSED files optimized → $OUTPUT"
echo "Skipped $SKIPPED files (not matching expected image formats)."
