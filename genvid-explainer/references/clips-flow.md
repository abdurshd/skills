# Veo 3.1 clips from Google Flow (Claude in Chrome)

Credits: **Veo 3.1 Fast = 20, Quality = 100** per 8 s clip. Spend only what the greenlight approved. The monthly balance shows in the account menu, and a "running low" banner appears near empty. Typical plan: one Quality hero shot (the cultural or emotional centrepiece) plus Fast shots for the hook action, the historical world and one establishing shot.

## Generate

1. Open `https://flow.google.com/` in a new tab, create a project, and use its agent panel (right side, "What do you want to create?").
2. Ask for exactly one clip and its cost:
   > Generate one video with Veo 3.1 Fast, 16:9, 8 seconds: <one continuous shot: subject, action, camera move, light, palette teal and amber>. No faces speaking, no text, no logos. Before generating, tell me the credit cost.
3. The agent restates the plan. Reply `Yes, generate it now.`
4. A permission card appears ("… costing 20 credits?") with Approve / Always approve / Reject. Use `find` for "Approve radio in the last … card" and click it. The first click often does not register: confirm that an "Approve" bubble and a "scheduled … waiting in the queue" message follow, and click again if not. Choose Approve, never Always approve.
5. Queue in the next request while one renders. Grid tiles show progress; a clip takes several minutes, longer under demand. Grid filter chips (Videos / Favorites) can hide finished tiles.

Write prompts so the key action happens mid-clip (3–5 s) with a clear moment, such as "a thumb taps a glowing teal button and light ripples out", so it can be synced to a narration word. Archival looks: "authentic 1950s black-and-white sepia archival film look, film grain and slight flicker".

## Download

Open the tile (it enters the editor) → download icon in the top bar (about (1187, 37) at a 1512 px wide viewport) → **1080p Upscaled**. Upscaling takes a minute or more, and a toast says "Upscaling complete, your video has been downloaded". The file lands in `~/Downloads/<Title>_<hash>_1080p.mp4`. Copy it with `osascript`:

```applescript
do shell script "ls -t ~/Downloads/*_1080p.mp4 | head -3"
do shell script "cp ~/Downloads/<file> <project>/public/clips/<name>.mp4"
```

Veo clips are 24 fps and 7.83 s long.

## Inspect before using

Tile six frames (`ffmpeg -ss <t> … -frames:v 1`, then `xstack`) and `Read` the sheet:

- **Watermark**: every clip carries "Veo" at the bottom right (x ≈ 1860–1900, y ≈ 1040–1060). Always play clips through `Clip`; its default `scale 1.08, origin "30% 30%"` crops the mark.
- **Artefacts**: Veo sometimes paints a black film-gate blotch or a warped hand. Crop it out with `scale` and `origin` (the dock clip used `scale 1.25–1.34, origin "60% 50%"` to drop a blotch at the left edge), or regenerate if it sits centre-frame.
- **Action time**: note when the key moment happens (for example the tap at 3.8 s). Sync it with `trimBefore={Math.round(actionSec * 30) - at(id, "word")}`.
- **Length**: to cover a section longer than 8 s, slow it with `playbackRate` (≥ 0.75 still looks natural), or cut to a still or 3D.

Close the Flow tab when done and report the credits spent and left.
