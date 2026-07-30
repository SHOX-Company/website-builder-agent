#!/usr/bin/env bash
# =============================================================================
# Tool: extract-frames.sh
# Purpose: Extract frames from a video file using ffmpeg.
#          Output is a numbered sequence of PNG files in the target directory.
#
# Interface:
#   --input   <path>   Path to source video file (required)
#   --output  <path>   Directory to write frames into (required)
#   --fps     <int>    Frames per second to extract (default: 24)
#
# Usage:
#   bash tools/extract-frames.sh \
#     --input ".tmp/product-reveal.mp4" \
#     --output ".tmp/frames/product-reveal" \
#     --fps 24
#
# Output:
#   .tmp/frames/product-reveal/frame_0001.png
#   .tmp/frames/product-reveal/frame_0002.png
#   ...
#
# Requirements:
#   ffmpeg must be installed: brew install ffmpeg
#
# Notes:
#   - Higher FPS = smoother animation but more files and larger bundle
#   - Recommended: 24 FPS for most scroll animations
#   - Reduce to 12 FPS if frame count exceeds 200
#   - After extraction, run optimize-assets.sh before committing frames
# =============================================================================

set -euo pipefail

INPUT=""
OUTPUT=""
FPS=24

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --input)  INPUT="$2";  shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    --fps)    FPS="$2";    shift 2 ;;
    *) echo "Unknown argument: $1" && exit 1 ;;
  esac
done

# Validate
if [[ -z "$INPUT" || -z "$OUTPUT" ]]; then
  echo "ERROR: --input and --output are required."
  echo "Usage: bash tools/extract-frames.sh --input <video> --output <dir> [--fps <int>]"
  exit 1
fi

if [[ ! -f "$INPUT" ]]; then
  echo "ERROR: Input file not found: $INPUT"
  exit 1
fi

if ! command -v ffmpeg &>/dev/null; then
  echo "ERROR: ffmpeg is not installed. Run: brew install ffmpeg"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT"

echo "Extracting frames from: $INPUT"
echo "Output directory:       $OUTPUT"
echo "FPS:                    $FPS"

ffmpeg -i "$INPUT" -vf "fps=$FPS" "$OUTPUT/frame_%04d.png" -hide_banner -loglevel error

FRAME_COUNT=$(ls "$OUTPUT"/*.png 2>/dev/null | wc -l | tr -d ' ')
echo "Done. $FRAME_COUNT frames extracted to $OUTPUT"

if [[ "$FRAME_COUNT" -gt 200 ]]; then
  echo "WARNING: $FRAME_COUNT frames is a lot. Consider reducing --fps or trimming the source video."
fi
