#!/usr/bin/env bash
# Contact sheet of images, in name order. Cutouts (PNG with alpha) sit on red so bad edges show.
# Usage: contact-sheet.sh <out.png> <cols> <image>...
set -euo pipefail
out="${1:?out.png}"; cols="${2:?columns}"; shift 2
tmp=$(mktemp -d); i=0
for f in "$@"; do
  i=$((i+1))
  ffmpeg -v error -y -f lavfi -i color=c=0xd04040:s=230x310 -i "$f" \
    -filter_complex "[1]scale=220:300:force_original_aspect_ratio=decrease[a];[0][a]overlay=(W-w)/2:(H-h)/2" \
    -frames:v 1 "$tmp/t$(printf %03d $i).png"
done
rows=$(( (i + cols - 1) / cols ))
ffmpeg -v error -y -pattern_type glob -i "$tmp/t*.png" -filter_complex "tile=${cols}x${rows}" -frames:v 1 "$out"
rm -rf "${tmp:?}"
echo "$out ($i images; order = argument order)"
