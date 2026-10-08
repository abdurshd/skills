# QA checklist

Render stills at each scene's entrance and key beat (bundle once, then `remotion still <bundle> <comp> f.png --frame=N --scale=0.4`), and stitch them into strips with `ffmpeg … hstack`.

**Visual**
- [ ] Every stamp is readable: on a paper label, not multiply-blended over a dark cutout, with ink grain light enough.
- [ ] The focal cutout's face is never covered by notifications or notes. Let busy bursts frame the subject; they must not bury it.
- [ ] No text crosses the safe area (y 150–1760) or collides with the badge.
- [ ] Handwritten scrawls finish writing before the scene cuts.
- [ ] No cutout shows a hard straight edge where the source photo ended. Hide it behind foliage or the frame edge.
- [ ] The generated clips are scaled enough to crop the generator watermark.
- [ ] The product UI is real (embedded components or faithful rebuilds), and jump-cut slices don't overlap.
- [ ] The CTA shows the brand, the slogan, the channel icons, the offer, and the domain.

**Audio**
- [ ] Every line was transcribed and matches the script; no tags were read aloud.
- [ ] Each visual beat lands on its word, checked at 2–3 sample frames per scene.
- [ ] The music is under the narration, silent at the turning point, back on the reveal, faded at the end.
- [ ] Integrated loudness is −14 LUFS ± 1 (`ffmpeg -i out.mp4 -af ebur128 -f null -`).

**Truth and hygiene**
- [ ] Every product claim is verified, with no invented metrics or ratings.
- [ ] No real brands or real people in the generated assets.
- [ ] The licence log is updated with the music, the images, the clips and the voice.
- [ ] Temporary stills, bundles and scratch audio are deleted. Raw downloads are deleted or flagged to the user.
- [ ] A preview copy under 30 MB exists if the film will be sent to a phone.
