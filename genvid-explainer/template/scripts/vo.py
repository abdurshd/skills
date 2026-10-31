"""Narration takes via Speko TTS. Usage: python scripts/vo.py [ids...]   Output: work/tts/<id>.wav (24 kHz).
Model/voice/language: VO_MODEL (gemini/gemini-3.8-flash-tts), VO_VOICE (Charon), VO_LANG (uz), VO_LANG_NAME (Uzbek).
Gemini sometimes speaks the English direction aloud, and STT drops that English, so the take's length decides:
a take > 4 s longer than expected (VO_SEC_PER_WORD, 0.52 for Uzbek) is cut at the longest pause between 4 s and 16 s;
otherwise only leading silence is trimmed. Verify every take with scripts/tts_qa.py."""
import json, os, subprocess, sys, numpy as np, soundfile as sf

N = json.load(open("work/narration.json"))
ids = sys.argv[1:] or list(N)
os.makedirs("work/tts", exist_ok=True)
MODEL = os.environ.get("VO_MODEL", "gemini/gemini-3.8-flash-tts")
VOICE = os.environ.get("VO_VOICE", "Charon")
LANG = os.environ.get("VO_LANG_NAME", "Uzbek")
WHO = "native Tashkent narrator" if LANG == "Uzbek" else f"native {LANG} narrator"
DIR = f"Read aloud in {LANG} like a calm, confident {WHO} of a science explainer, natural intonation and clear diction: "
DIR_OUT = f"Read aloud in {LANG} like a warm, friendly {WHO} closing a video, natural upbeat intonation: "
SPW = float(os.environ.get("VO_SEC_PER_WORD", "0.52"))
env = dict(os.environ, TTS_SR="24000")
PY = sys.executable


def envelope(a, sr):
    hop = int(0.02 * sr)
    return hop, np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a) - hop, hop)])


for k in ids:
    raw = f"work/tts/{k}_raw.wav"
    for attempt in range(3):
        r = subprocess.run([PY, "scripts/speko_tts.py", raw, (DIR_OUT if k.endswith("outro") else DIR) + N[k], MODEL, VOICE],
                           capture_output=True, text=True, env=env)
        if r.stdout.startswith("OK"):
            break
    else:
        sys.exit(f"{k}: TTS failed: {r.stdout}{r.stderr}")
    a, sr = sf.read(raw, dtype="float32")
    hop, env_ = envelope(a, sr)
    db = 20 * np.log10(env_ + 1e-9)
    expected = SPW * len(N[k].split())
    spoke_direction = len(a) / sr - expected > 4
    if spoke_direction:
        lo, hi = int(4 / 0.02), int(16 / 0.02)
        quiet = db[lo:hi] < -42
        best, run = (0, 0), 0
        for i, q in enumerate(list(quiet) + [False]):
            if q:
                run += 1
            else:
                if run > best[1] - best[0]:
                    best = (i - run, i)
                run = 0
        cut = max(0, (lo + best[1]) * hop - int(0.06 * sr))
    else:
        first = int(np.argmax(db > -40))
        cut = max(0, first * hop - int(0.05 * sr))
    voiced = np.where(db > -40)[0]
    end = min(len(a), (voiced[-1] + 1) * hop + int(0.12 * sr)) if len(voiced) else len(a)
    out = a[cut:end]
    sf.write(f"work/tts/{k}.wav", out, sr)
    os.remove(raw)
    flag = "" if 0.7 < (len(out) / sr) / expected < 1.35 else "  CHECK LENGTH"
    print(k, "direction-cut" if spoke_direction else "clean", f"raw {len(a)/sr:.2f}s -> {len(out)/sr:.2f}s (expected {expected:.1f}s){flag}")
