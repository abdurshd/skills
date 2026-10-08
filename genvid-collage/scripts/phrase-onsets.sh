#!/usr/bin/env bash
# Print the spoken intervals (seconds) of every narration file in a folder.
# Usage: phrase-onsets.sh <dir-with-wavs> [noise_dB=-36] [min_silence_s=0.16]
set -euo pipefail
dir="${1:?folder of .wav/.mp3 narration lines}"; noise="${2:--36}"; gap="${3:-0.16}"
for f in "$dir"/*.wav "$dir"/*.mp3; do
  [ -e "$f" ] || continue
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  printf '%s (%.2f): ' "$(basename "${f%.*}")" "$d"
  ffmpeg -v info -i "$f" -af "silencedetect=n=${noise}dB:d=${gap}" -f null - 2>&1 \
    | grep -o 'silence_\(start\|end\): [0-9.]*' \
    | awk -v D="$d" 'BEGIN{s=0} /start/{if ($2-s>0.05) printf "[%.2f-%.2f] ", s, $2} /end/{s=$2} END{if (D-s>0.05) printf "[%.2f-%.2f]", s, D; print ""}'
done
