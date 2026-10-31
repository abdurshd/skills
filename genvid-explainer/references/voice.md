# Voice: generate, verify, align, time

Run from the project root with Speko loaded and `PY` set (see SKILL.md → Environment).

```bash
$PY scripts/vo.py s02_lead          # audition one line first; listen before doing all
$PY scripts/vo.py                   # all lines → work/tts/<id>.wav
$PY scripts/tts_qa.py               # STT round-trip; FAIL ids get regenerated
$PY scripts/vo.py s05_problem s09_kitchen && $PY scripts/tts_qa.py s05_problem s09_kitchen
mkdir -p public/vo && cp work/tts/s*.wav public/vo/   # final takes only (no *_raw)
$PY -W ignore scripts/align_tts.py  # word timings → work/tts_words.json (first run downloads the MMS model)
python3 scripts/timeline.py         # → src/data/timeline.json, prints per-scene seconds
```

## What goes wrong and how the scripts handle it

- **Gemini reads the English direction aloud.** It happens on many takes. `vo.py` spots it by length (more than 4 s over 0.52 s × words) and cuts at the longest pause between 4 and 16 s. The log line says `direction-cut` and should land near `expected`. `CHECK LENGTH` means the cut missed, so regenerate that id.
- **Repeated or dropped sentences.** `tts_qa.py` transcribes each take twice: once with `VO_LANG`, once with language detection off. It counts extra and missing words against `narration.json`. Regenerate failures; a third failure means rewording the sentence.
- **Very short lines (≤ 5 words)** can FAIL only because detection-off STT hears another language (for example Turkish for "Ko'rganingiz uchun rahmat"). If the Uzbek-mode transcript is right, listen once and accept it.
- **Other languages.** Set `VO_LANG` (ISO code), `VO_LANG_NAME` and `VO_SEC_PER_WORD`. Alignment normalises words to a–z, so it only suits Latin-script text; romanise other scripts before aligning.
- **Another voice or model.** Set `VO_VOICE` / `VO_MODEL` (Speko route `provider/model`). Audition before switching for a whole video.

## Timing

`timeline.py` gives each scene its voice plus padding: 0.4 s before and 0.6 s after by default, 1.4 s before the first line and 2.2 s after the last. For a scene that needs more visual room (a reveal, an outro), add it in `work/pads.json` as `{"s06_shipping": [0.5, 0.8]}` and re-run. If the total runs long, shorten the script; do not speed up the voice.

Whenever narration changes, re-run vo → qa → copy → align → timeline. Every `at()` frame in the scenes moves with it.
