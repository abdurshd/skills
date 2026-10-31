"""Speko TTS: python speko_tts.py OUT.wav "text" [provider/model|auto] [voice]. Language from VO_LANG (default uz)."""
import os, sys, json, uuid, wave, urllib.request, urllib.error
out, text = sys.argv[1], sys.argv[2]
route = sys.argv[3] if len(sys.argv) > 3 else "auto"
voice = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else None
SR = int(os.environ.get("TTS_SR", "48000"))
body = {"input": text, "language": os.environ.get("VO_LANG", "uz"), "audio": {"encoding": "pcm_s16le", "sample_rate_hz": SR, "channels": 1}}
body["routing"] = {"mode": "auto", "objective": "quality"} if route == "auto" else {"mode": "explicit", "model": route}
if voice: body["voice"] = voice
req = urllib.request.Request(os.environ["SPEKO_BASE_URL"] + "/tts/speech", data=json.dumps(body).encode(), method="POST",
    headers={"Authorization": "Bearer " + os.environ["SPEKO_API_KEY"], "Content-Type": "application/json", "Idempotency-Key": str(uuid.uuid4())})
try:
    with urllib.request.urlopen(req, timeout=180) as r:
        pcm = r.read(); h = {k: v for k, v in r.headers.items() if k.lower().startswith("speko")}
except urllib.error.HTTPError as e:
    print("ERR", route, e.code, e.read()[:300].decode(errors="replace")); sys.exit(1)
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)
print("OK", route, f"{len(pcm)/(2*SR):.2f}s", h.get("Speko-Provider"), h.get("Speko-Model"), h.get("Speko-Usage", ""))
