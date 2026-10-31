#!/bin/zsh
# Contact sheet for review: scripts/sheet.sh <composition> <frame> <frame> <frame> <frame>
# Renders four stills at half size and tiles them into work/sheet_<composition>.png.
# Each composition gets its own bundle (work/bundle_<composition>), so several coders can run sheets at once.
# REUSE=1 skips rebundling when no code changed since the last sheet of that composition.
set -e
cd "$(dirname "$0")/.."
comp=$1; shift
bundle=work/bundle_$comp
[[ -d $bundle && -z "$REUSE" ]] && rm -rf $bundle
[[ -d $bundle ]] || npx remotion bundle --out-dir=$bundle >/dev/null
for f in "$@"; do npx remotion still $bundle "$comp" "work/_s_${comp}_$f.png" --frame=$f --scale=0.5 --log=error; done
args=(); for f in "$@"; do args+=(-i "work/_s_${comp}_$f.png"); done
ffmpeg -v error -y "${args[@]}" -filter_complex "xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0" "work/sheet_$comp.png"
for f in "$@"; do rm "work/_s_${comp}_$f.png"; done
