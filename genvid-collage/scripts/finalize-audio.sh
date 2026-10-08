#!/usr/bin/env bash
# Normalise a rendered video's audio to -14 LUFS / -1.5 dBTP; video stream is copied untouched.
# Usage: finalize-audio.sh <video.mp4> [preview]   ("preview" also writes <name>-preview.mp4 under ~30 MB)
set -euo pipefail
in="${1:?video.mp4}"; tmp="${in%.mp4}.norm.mp4"
ffmpeg -v error -y -i "$in" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000" -c:a aac -b:a 192k -movflags +faststart "$tmp"
mv "$tmp" "$in"
ffmpeg -i "$in" -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' || true
if [ "${2:-}" = "preview" ]; then
  ffmpeg -v error -y -i "$in" -c:v libx264 -preset slow -b:v 1700k -maxrate 2200k -bufsize 4000k \
    -c:a aac -b:a 128k -movflags +faststart "${in%.mp4}-preview.mp4"
  ls -la "${in%.mp4}-preview.mp4"
fi
