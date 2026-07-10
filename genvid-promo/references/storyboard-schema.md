# Storyboard contract

Create a machine-readable `storyboard.json` before final implementation.

```json
{
  "videoId": "product-promo",
  "title": "Product promo",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "timing": {
    "leadInSeconds": 0.45,
    "tailPaddingSeconds": 0.9,
    "transitionFrames": 14
  },
  "scenes": [
    {
      "id": "01-hook",
      "purpose": "Create curiosity",
      "narration": "What if your workflow answered before you asked?",
      "visualGoal": "Show the verified empty dashboard becoming active",
      "source": "src/components/Dashboard.tsx at deterministic demo state",
      "claims": [],
      "actions": [
        {
          "atSeconds": 0.4,
          "description": "Headline reveals"
        }
      ],
      "transition": "fade-through-color"
    }
  ]
}
```

Required top-level fields are `videoId`, positive `fps`, positive `width`, positive `height`, and a non-empty `scenes` array.

Every scene requires:

- unique stable `id` suitable for a filename;
- non-empty `narration` containing only spoken text;
- `visualGoal` describing what the viewer must understand;
- `purpose` describing the scene's role;
- `source` identifying the verified component, capture, source, or factual basis;
- `actions`, even when empty; and
- a transition choice or explicit straight cut.

Product skills should list factual `claims`. Teaching skills may use that field for sourced assertions. Onboarding skills should add `startState`, `userAction`, and `endState` per scene.

Keep action timestamps relative to the scene. After TTS generation, move any action beyond the measured scene duration or lengthen the scene intentionally.
