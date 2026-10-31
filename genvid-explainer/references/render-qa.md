# Render and QA

## Render

```bash
npx tsc --noEmit -p . && npx eslint src
rm -rf work/bundle && npx remotion bundle --out-dir=work/bundle
npx remotion render work/bundle <CompositionId> out/<slug>.mp4 --codec=h264 --crf=18 --audio-bitrate=192k --concurrency=5
```

Run the render in the background; a 3-minute video takes about 5 minutes on this Mac. Always rebundle after code or `public/` changes, because a stale bundle renders old assets.

## Picture check

Tile 16 frames spread across the whole duration and `Read` the result:

```bash
mkdir -p work/rv && i=0; for t in 2 6 14 26 38 50 62 74 86 98 110 122 134 146 160 176; do ffmpeg -v error -y -ss $t -i out/<slug>.mp4 -frames:v 1 -vf scale=480:-1 work/rv/$(printf %02d $i).png; i=$((i+1)); done
ffmpeg -v error -y -pattern_type glob -i 'work/rv/*.png' -vf tile=4x4 -frames:v 1 work/review.png
```

Adjust the timestamps to the real duration. Confirm the clips play (not black or frozen), captions match the voice, and no scene shows a blank or broken 3D canvas.

## Audio check

```bash
ffmpeg -hide_banner -i out/<slug>.mp4 -af ebur128=framelog=quiet -vn -f null - 2>&1 | grep -A1 Integrated
ffmpeg -hide_banner -i out/<slug>.mp4 -af volumedetect -vn -f null - 2>&1 | grep max_volume
```

Target: integrated −16 ± 1.5 LUFS, `max_volume` ≤ −0.5 dB. The template mix (voice 0.85, music 0.095, SFX 0.25–0.45) lands at about −16.5 LUFS with a −0.7 dB peak. If peaks hit 0 dB, find the seconds:

```bash
ffmpeg -hide_banner -i out/<slug>.mp4 -vn -af "asetnsamples=48000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.Peak_level:file=work/peaks.txt" -f null - 2>/dev/null
awk '/pts_time/{split($3,a,":");t=a[2]} /Peak_level/{split($0,b,"=");if(b[2]>-1.0)print t, b[2]}' work/peaks.txt
```

Peaks spread across the whole video mean the voice and music sum is too hot, so lower the voice/music volumes in `Main.tsx`. Peaks clustered at a few seconds point to a loud SFX there, so lower that `Sfx` volume. Then re-render.

## Delivery

`SendUserFile` with `display: "render"`. Files over 30 MB reach only the desktop app; say so. Offer a phone copy if wanted: `ffmpeg -i out/<slug>.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -c:a aac -b:a 128k out/<slug>-share.mp4`.
