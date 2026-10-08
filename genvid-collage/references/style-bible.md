# Style bible — documentary paper collage

The look is a wildlife-documentary field journal: real photo cutouts pinned onto aged paper and animated like stop-motion. The style earns the viewer's attention because it is *handmade-looking and specific*. Every frame has a texture, a joke, or a fact; nothing is a generic gradient with floating icons.

## Canvas

- 1080×1920, 30 fps. Keep text inside x 60–1020, y 150–1760; the platform UI covers the top and bottom.
- **Paper scenes:** an aged cream graph-paper scan with `mix-blend: multiply` over `#efe5cf`, a drawn 54 px grid as a fallback, and a soft brown vignette. Field-guide "cards" add a 3 px double rule inset 64 px.
- **Dark scenes** (wild, flood, night): a photo background such as a misty jungle or a navy night, darkened 40–60 %, with the paper scan at low opacity for grain.
- **Real footage scenes:** generated clips scaled 1.06+ (this hides the generator's watermark) with a slow push of 0.03–0.05 over the scene.
- **Persistent badge:** a round dark seal (128 px) with the brand mark and a tiny typewriter label, bottom-right on every scene except the final CTA.

## Type

| Role | Font (Google Fonts) | Use |
|---|---|---|
| Field-guide title | Playfair Display 900, slight ink grain | the species name, about 196 px |
| Subtitle | Special Elite, red, 0.4 em tracking | "SMALL BUSINESS", "OBSERVATION 3" |
| Latin name | Playfair Display 700 italic | "(Ownerus exhaustus)" |
| Handwriting | Caveat 700, red pen `#c4372b` | notes, checkmarks, "lead = gone" |
| UI / chat | Inter 600–700 | bubbles, pills, notifications |

## Recurring devices

- **Observation tag:** a torn-paper label pinned top-left, with "OBSERVATION n" in red typewriter over an italic display title. A tape strip sits on the corner. It springs in while rotating from −10° to −2.5°.
- **Taped note:** cream paper with a typewriter label ("HABITAT:") and a handwritten red value that writes on character by character (about 1.3 frames per char).
- **Pen arrow:** a red SVG path drawn with `strokeDashoffset`; the arrowhead appears once the path is 90 % drawn.
- **Rubber stamp:** uppercase Playfair 900 in a thick border, on a cream paper label for contrast. It slams down from 2.2× scale to 1× in 6 frames with an ease-in, then shakes for 10 frames. Ink grain comes from an SVG turbulence filter with a mild alpha erosion (matrix `-1.1 1.3`). **Never multiply-blend a stamp over a cutout**: red on a dark apron disappears.
- **Cutouts:** generated photos with the background lifted. Each springs in (scale 0.55→1 with overshoot, or slides from an edge), then idles with ±0.8° sway. Give each a double drop shadow, a large soft one plus a small contact one.
- **Binocular HUD:** two 440 px circles cut out of black, breathing ±6 px, with a blinking red dot and "OBSERVATION · 00:0s" counting in typewriter.
- **Chat on paper:** off-white bubbles with one sharp corner and soft shadow; the product's replies use the brand colour.
- **Notification burst:** iOS-style banners with real channel app icons. Each lands on the word that names it, and an unread badge counts up.
- **Polaroid grid:** a 3×3 grid of the same question in different wordings and languages, appearing every 9 frames ("again, and again").
- **Pinned product UI:** the real app screen in a phone frame, scaled about 0.7 and rotated ±2°, with a drop shadow. Jump-cut between moments of the real flow with gated slices; never fake the UI.
- **Ticks over footage:** white pills with green check circles, landing one by one on the spoken benefits.
- **Outro:** clean paper, the brand mark growing in, the wordmark, a one-line slogan, the channel icons, a CTA pill and the domain in typewriter, over slow paper confetti.

## Motion rules

1. **Animate on twos.** Hold every frame twice (`Math.floor(frame/2)*2`) for paper, cutouts, notes and scrawls. This single rule is most of the handmade feel. Keep the camera, the video and the stamps on ones.
2. **Overshoot easing** (`bezier(0.34,1.56,0.64,1)`) for things being pinned; **ease-out-expo** for reveals; **ease-in** for slams.
3. **One new thing per spoken phrase.** Schedule each entrance to a measured phrase onset (`at(sec)`), a few frames *after* the word starts, never before it.
4. **Transitions:** 8 frames. Slide from the right between consecutive observations; fade into and out of footage and the reveal. No other transition types.
5. **Turning point:** the music stops dead on the stamp before the reveal, then returns when the product's name is spoken. The silence is the hook for the second half.
6. **Never** use CSS animations or transitions, random per-frame jitter, or more than two moving focal points at once.

## Palette

Paper `#efe5cf`, ink `#1f1a14`, red pen `#c4372b`, note `#f7f0dc`, tape `rgba(236,222,178,.86)`, jungle `#0f1d14`, night `#101828`, plus the product's brand colour for replies, CTAs and "approved" stamps.
