# Asset generation

## Asset list (typical film)

| Kind | Count | Aspect | Notes |
|---|---|---|---|
| Hero character, full body | 1 + 6 poses | 9:16 | frazzled / asleep / confused with prop / panicking / relaxed with steaming mug / peeking waist-up |
| Secondary character (customer) | 2 poses | 9:16 | e.g. at night in pyjamas typing; daytime walking away with a shopping bag |
| Props | 5–7 | 1:1 | phone pile, alarm clock, magnifier, cold mug, two leaves (monstera, banana) |
| Backgrounds | 2 | 9:16 | aged graph paper scan; moody location (jungle or other habitat) with an empty middle |
| Start frames for clips | 2 | 9:16 | the payoff scene with the hero; an establishing drone shot of the setting |
| Video clips | 2 | 9:16, 8 s | made from the start frames; about 100 credits each on Veo 3.1 Quality |

## Prompt rules

- **Cutouts:** "Photorealistic full-body studio photo of …, entire body visible from head to shoes with empty space around, plain flat light-grey seamless studio background, soft even lighting, crisp clean edges, editorial magazine cutout look, 50mm, no text, no logos."
- **Hero first.** Generate 2 variations, pick the most expressive, then say: "Use that exact person as the character reference (same face, hair, glasses, outfit …)" for every pose. Restate the outfit in every prompt.
- Give the hero a **distinctive, consistent costume**: one strong colour plus a work garment (for example a mustard cardigan and a denim apron). That costume is the brand of the film.
- **Props:** "single object centred on a plain flat light-grey seamless background with soft shadow, 1:1".
- **Backgrounds:** "full frame, nothing in the middle". For paper: "flat top-down scan, faint grid lines, subtle coffee stains and paper fibres".
- **Start frames:** a cinematic photo with the hero from the reference, shallow depth of field, motivated light, and no readable signage or brand names.
- **Video prompt:** describe one calm action and a slow camera move, plus "realistic natural motion, no camera shake, no text". Use the generated image as the first frame for determinism.
- Never use real brands, logos, or real people's likenesses. Localize names, places, prices and currency for the target market.

## Driving a generator UI (lessons from Google Flow)

- Flow's agent panel takes free-form requests. **Typed newlines send the message early**, so write each request as one line.
- Set the defaults once in the panel's settings (9:16, x2, Nano Banana, Veo Quality). Image generations run without confirmation; video asks you to approve credits. Approve once. If it fails, retry once at most and tell the user.
- Don't navigate away from the tab while generating; a navigation can kill the job.
- **Downloads:** open each item in the full-screen viewer, then **Download → 2K Upscaled** (videos: 1080p). Wait for "Upscaling complete".
  - Do it with **real clicks, one at a time**. A scripted burst of downloads trips Chrome's "multiple automatic downloads" block for the whole site, and then even real clicks save nothing until someone allows the site in `chrome://settings/content/automaticDownloads`.
  - Upscales stall in background tabs (timer throttling); keep the tab in front.
  - If the agent can't click in the browser (some computer-use hosts grant browsers read-only), write a handoff for a human or another agent: one direct link per item plus the exact clicks. The batch "Download" on a list row gives 1K zips only.
- Files land in `~/Downloads`. If the agent's shell can't read that folder (macOS privacy), have the files moved into the project with an allowed mechanism (an AppleScript `cp`, or the user) instead of widening access.

## Background removal

- macOS: `swiftc -O scripts/lift.swift -o lift`, then `./lift in.jpg out.png`. It uses Vision's foreground-instance mask, gives near-studio-quality hair edges, and crops to the subject.
- Other hosts: any matting model (e.g. rembg/BiRefNet). Plain grey studio backgrounds make any tool work.
- Vision drops objects that don't touch the subject (phones in mid-air). Check every cutout on a red contact sheet (`scripts/contact-sheet.sh`). Accept the change or regenerate.
- Resize the cutouts to 1500 px on the long side (`sips -Z 1500`) to keep renders fast. Backgrounds go to 1920 px JPEG.

## Bookkeeping

Name the assets by role (`owner-asleep.png`, `prop-clock.png`, `bg-paper.jpg`, `clips/cafe.mp4`). Record the generator, model, account, credits and date in the project's licence log. Delete the raw downloads after the render is accepted.
