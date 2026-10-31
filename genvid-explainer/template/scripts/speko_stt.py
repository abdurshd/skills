"""Speko batch STT: python speko_stt.py in.wav [provider/model|auto] [words] -> prints JSON. Language from VO_LANG (default uz); STT_NOLANG=1 lets the model detect it."""
import os, sys, json, uuid, subprocess, urllib.request, urllib.error
src = sys.argv[1]; route = sys.argv[2] if len(sys.argv) > 2 else "auto"
import tempfile
tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False, dir=os.environ.get("TMPDIR"))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", "-bitexact", tmp.name], check=True)
wav = open(tmp.name, "rb").read(); os.unlink(tmp.name)
meta = {} if os.environ.get("STT_NOLANG") else {"language": os.environ.get("VO_LANG", "uz")}; meta.update({"routing": {"mode": "auto", "objective": "quality"} if route == "auto" else {"mode": "explicit", "model": route}})
if len(sys.argv) > 3 and sys.argv[3] == "words": meta["options"] = {"word_timestamps": True}
b = uuid.uuid4().hex
body = (f"--{b}\r\nContent-Disposition: form-data; name=\"request\"\r\nContent-Type: application/json\r\n\r\n{json.dumps(meta)}\r\n"
        f"--{b}\r\nContent-Disposition: form-data; name=\"audio\"; filename=\"a.wav\"\r\nContent-Type: audio/wav\r\n\r\n").encode() + wav + f"\r\n--{b}--\r\n".encode()
req = urllib.request.Request(os.environ["SPEKO_BASE_URL"] + "/stt/transcriptions", data=body, method="POST",
    headers={"Authorization": "Bearer " + os.environ["SPEKO_API_KEY"], "Content-Type": f"multipart/form-data; boundary={b}", "Idempotency-Key": str(uuid.uuid4())})
try:
    with urllib.request.urlopen(req, timeout=300) as r:
        d = json.loads(r.read()); d["_route"] = r.headers.get("Speko-Provider", "") + "/" + r.headers.get("Speko-Model", "")
        print(json.dumps(d, ensure_ascii=False))
except urllib.error.HTTPError as e:
    print(json.dumps({"error": e.code, "body": e.read()[:400].decode(errors="replace")})); sys.exit(1)
