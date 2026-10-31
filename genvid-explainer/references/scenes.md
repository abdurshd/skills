# Building scenes

Worked scenes to borrow patterns from: [examples/S06Shipping.tsx](examples/S06Shipping.tsx) (archival clip → modern clip → 3D object → icon row), [examples/S09Kitchen.tsx](examples/S09Kitchen.tsx) (stills, Quality clip, equations, an SVG prop), [examples/S11Terms.tsx](examples/S11Terms.tsx) (3D nodes with HTML labels via `project()`, a camera fly-in, a code card, a live status counter). [examples/Kazan.tsx](examples/Kazan.tsx) shows a frame-driven SVG prop with fire and steam.

## Anatomy

- One file per narration id: `src/scenes/SNNName.tsx`, registered in `src/scenes/index.ts` under the id (`s06_shipping: S06Shipping`) by the director before coding starts. Root then also exposes it as composition `s06-shipping` (hyphens). Scene-only helpers go in `src/scenes/parts/<id>_*.tsx`.
- Frames are scene-relative. Get beat frames from the narration: `const truck = at(ID, "yuk", 1)` is the second word starting with "yuk". Read the scene's word list in `src/data/timeline.json` before choosing the prefix and `nth`; a prefix matches every inflection.
- Drive everything from `useCurrentFrame()` with `prog(frame, a, b)` (eased 0→1), `lerp`, `pop` (spring) and `rand(seed)`. Show and hide layers with `{x > 0 && x < 1 ? … : null}` plus opacity, so finished layers stop rendering.
- The next scene dissolves in over the last 14 frames of this one (`OVERLAP`), so every scene must read complete from frame 0. Captions sit at the bottom (about y 960–1040), so keep key content above y ≈ 900.
- Add `Sfx` on beats (`thunk` for objects landing, `pebble`/`bubble` for chips, `emblem`/`reveal` for hero reveals, `buzzer` for failures, `chime`/`ding` for success, `gust`/`silk` for camera moves, `finale` at the end). Volumes 0.25–0.45. Valid names are the `SfxName` union.

## Toolkit (read the file for props)

- `components/Film.tsx`: `KenBurns` (still with push and pan), `Clip` (Veo clip with watermark crop, `trimBefore`, `playbackRate`), `Flash`, `Particles`, `Grain`.
- `components/Text.tsx`: `RiseTitle` (letter rise), `Chip` (springy pill, absolute-positioned through `style`), `Kicker` (small uppercase section label).
- `components/Icons.tsx`: line icons (Check, Cross, Laptop, ServerIcon, Ship, Train, Truck, MiniContainer, Eye, Wrench, Play, Moon, Person, Send, Snail, Coin). Add topic icons in the same style: a 24-unit viewBox stroke SVG with a `size`/`color` prop.
- `three/Stage.tsx`: full-frame `ThreeCanvas` with studio lights, fog and contact shadows. Props: `camera`, `target`, `fov`, `fog`, `shadows`.
- `three/models.tsx`: `ShippingContainer` (doors open 0→1), `ServerRack` (LEDs, `alarm`), `ShipWheel`, `Pod`, `GlowGrid` (floor), `Glow` (additive halo sprite). Build new topic models from boxes, cylinders and tori with `meshStandardMaterial` (metalness/roughness) plus emissive accents.
- `three/project.ts`: `project(worldPoint, camera, target, fov)` returns 1920x1080 screen coordinates. Use it to place HTML labels on 3D objects.

## Remotion 3D rules (each was a real failure)

- The camera is set during render inside `Stage`. Animate it only through the `camera` / `target` / `fov` props computed from the frame.
- No `@react-three/postprocessing`: bloom renders blank under headless ANGLE. Use `Glow` sprites and emissive materials.
- `interpolate` rejects `Infinity` in ranges; use `1e6` for "never".
- Keep mesh counts sane: a 17×14×2 container grid rendered fine with one plain box (plus an edge strip) per container. Full models are for heroes only.
- To push a 3D subject to one side of the frame for text, offset camera and target together (`camera=[x+…]`, `target=[x, …]`). Moving the object instead changes its perspective.

## Review loop (every scene)

```bash
scripts/sheet.sh s06-shipping 60 200 270 330            # rebundles, renders 4 stills at half size → work/sheet_s06-shipping.png
REUSE=1 scripts/sheet.sh s07-container 40 120 200 300  # reuse the bundle when no code changed since
```

Pick frames at each beat's peak (word frame + ~15) and `Read` the sheet. Check for:

- text overlapping text, 3D objects or busy photo areas; labels clipped at frame edges
- 3D objects cut off, too small, or leaving half the frame empty
- anything appearing before its word, or a layer lingering after its beat
- small text (under ≈ 30 px at full size) and low-contrast text over photos (add a gradient or panel)
- the same composition held for more than ~5 s

Fix and re-sheet until clean. Sheets are test artefacts; delete them at wrap-up.
