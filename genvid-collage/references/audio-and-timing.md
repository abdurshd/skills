# Audio and timing

## Narration

1. Pick the most expressive current model the user's provider offers, for example ElevenLabs v4 (or v3) with audio tags. Pick a library voice that matches "warm British documentary narrator". Never imitate a real, named person.
2. Synthesize **one file per line** (`scripts/tts-lines.py`), as 44.1 kHz mono WAV. Per-line files let you regenerate a single line and give exact scene timing.
3. If the provider's own web app is blocked (an unpaid invoice, for example), say so. Never pay on the user's behalf. Use an alternative route the user has authorised, such as a router key already configured in their project.
4. **Verify every line** by transcribing it back (any STT; Gemini transcribe via Speko needs 16 kHz mono). Look for:
   - tags read aloud ("whispers"),
   - dropped short words ("Price?", "Enter"),
   - mangled names.
   A short phrase that is audible but missing from the transcript can be confirmed with silence detection instead of regenerating. Regenerate a line by rephrasing, adding pauses, or spelling a word phonetically.
5. Keep the request/attempt ids from the provider responses in a log file next to the audio.

## Beat sheet from real audio

Run `scripts/phrase-onsets.sh <dir>`. It prints each line's spoken intervals:

```
03-flood (11.44): [0.00-0.93] [1.58-2.11] [2.74-3.31] [3.71-4.30] …
```

Map them to words by reading the line. Then, in code: `at(sec) = VO_AT + round(sec*30)`. Visual entrances land 0–4 frames after an onset. The scene duration is `VO_AT + ceil(lineSec*30) + tail`.

## Music

- **Pixabay Content License tracks only**, and only if the track page does **not** say "Content ID Registered" (about 70 % of popular tracks do, and they get Reels muted or claimed) and does **not** say "AI generated". Check each page's text; fetch slowly (2 requests at a time with 1.5 s gaps) or Cloudflare blocks you.
- Style: playful pizzicato or sneaky-documentary for the problem half. A public-domain classic recorded by the uploader (for example Delibes' "Sylvia – Pizzicato") is ideal. It should open strongly in the first second.
- Mix: about 0.2 gain under the narration, fading in over 12 frames. **Hard stop** on the turning-point stamp, then restart (later in the track, or a brighter track) on the product's name. Raise it to about 0.45 in the voiceless CTA tail and fade the last 1.5 s.
- Log the file, track, artist, URL, licence, Content ID status, and date.

## Final mix

Render, then `scripts/finalize-audio.sh out.mp4`. It normalizes loudness to −14 LUFS integrated with a −1.5 dBTP ceiling and copies the video stream. Typical pre-normalization loudness is around −21 LUFS.
