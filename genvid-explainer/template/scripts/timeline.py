"""Build src/data/timeline.json from work/tts_words.json: per-scene start/duration in frames (30 fps).
Optional work/pads.json {"<id>": [before_s, after_s]} gives a scene more visual breathing room around its line."""
import json, os

FPS = 30
W = json.load(open("work/tts_words.json"))
ids = list(W)
PAD = {ids[0]: (1.4, 0.8), ids[-1]: (0.4, 2.2)}
if os.path.exists("work/pads.json"):
    PAD.update({k: tuple(v) for k, v in json.load(open("work/pads.json")).items()})
t, scenes = 0.0, []
for k, v in W.items():
    pre, post = PAD.get(k, (0.4, 0.6))
    dur = pre + v["dur"] + post
    scenes.append({"id": k, "from": round(t * FPS), "duration": round(dur * FPS), "voiceAt": round(pre * FPS),
                   "voiceDur": round(v["dur"] * FPS),
                   "words": [{"w": x["w"], "s": round((pre + x["s"]) * FPS), "e": round((pre + x["e"]) * FPS)} for x in v["words"]]})
    t += dur
json.dump({"fps": FPS, "total": round(t * FPS), "scenes": scenes}, open("src/data/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"total {t:.1f}s", [(s["id"], round(s["duration"] / FPS, 1)) for s in scenes])
