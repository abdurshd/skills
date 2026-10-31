import json, re, torch, soundfile as sf, subprocess, numpy as np
from torchaudio.pipelines import MMS_FA as bundle
nar = json.load(open("work/narration.json"))
model = bundle.get_model(with_star=False).eval(); aligner = bundle.get_aligner(); tokenizer = bundle.get_tokenizer()
def norm(w):
    w = re.sub(r"[^a-z]", "", w.lower().replace("ʻ", "'").replace("’", "'"))
    return w or "a"
out = {}
for k, text in nar.items():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"work/tts/{k}.wav", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).copy(); wav = torch.from_numpy(a)[None]
    words = [w for w in text.replace("—", " ").split() if re.search(r"\w", w)]
    with torch.inference_mode(): em, _ = model(wav)
    spans = aligner(em[0], tokenizer([norm(w) for w in words]))
    r = wav.shape[1] / em.shape[1] / 16000
    out[k] = {"dur": len(a) / 16000, "words": [{"w": w, "s": round(sp[0].start * r, 3), "e": round(sp[-1].end * r, 3)} for w, sp in zip(words, spans)]}
    print(k, round(out[k]["dur"], 2), " ".join(f"{x['w']}@{x['s']:.1f}" for x in out[k]["words"][:8]))
json.dump(out, open("work/tts_words.json", "w"), ensure_ascii=False)
