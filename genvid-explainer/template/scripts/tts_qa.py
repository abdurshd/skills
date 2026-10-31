"""Round-trip QA for narrator clips: Speko STT (gemini/gemini-3.5-transcribe) with VO_LANG AND language-less, compared word by
word with work/narration.json. Gemini TTS sometimes speaks the English direction aloud or repeats a sentence — catch
EXTRA words as well as missing ones. Prints OK/FAIL per clip; exit code 1 if any clip fails (regenerate it)."""
import difflib, json, os, re, subprocess, sys
N = json.load(open("work/narration.json"))
ids = sys.argv[1:] or list(N)
norm = lambda t: [w for w in re.sub(r"[^a-zʻ'’ʼ\s]", " ", t.lower().replace("’", "'").replace("ʻ", "'")).split() if w]
bad = 0
for k in ids:
    ref = norm(N[k]); outs = []
    for nolang in ("", "1"):
        env = dict(os.environ, STT_NOLANG=nolang) if nolang else dict(os.environ)
        r = subprocess.run([sys.executable, "scripts/speko_stt.py", f"work/tts/{k}.wav", "gemini/gemini-3.5-transcribe"], capture_output=True, text=True, env=env)
        try: outs.append(json.loads(r.stdout).get("text", ""))
        except Exception: outs.append("")
    worst = None
    for txt in outs:
        hyp = norm(txt); sm = difflib.SequenceMatcher(a=ref, b=hyp)
        extra = sum(j2 - j1 for op, i1, i2, j1, j2 in sm.get_opcodes() if op in ("insert", "replace") and (j2 - j1) > (i2 - i1))
        missing = sum(i2 - i1 for op, i1, i2, j1, j2 in sm.get_opcodes() if op in ("delete",))
        res = (round(sm.ratio(), 2), extra, missing, txt)
        if worst is None or res[1] + res[2] > worst[1] + worst[2]: worst = res
    ok = worst[1] <= 2 and worst[2] <= 2 and worst[0] >= 0.8
    bad += not ok
    print(("OK  " if ok else "FAIL"), k, f"ratio {worst[0]} extra {worst[1]} missing {worst[2]}", "|", worst[3][:160])
sys.exit(1 if bad else 0)
