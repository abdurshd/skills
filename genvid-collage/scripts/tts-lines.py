#!/usr/bin/env python3
"""Synthesize one WAV per narration line and log provider request ids.

Usage:
  tts-lines.py --provider speko|elevenlabs|openai --voice VOICE_ID --model MODEL \
               --lines lines.json --out DIR [only-key ...]

lines.json maps file stems to text, e.g. {"01-habitat": "[whispers] Shh... don't move."}.
Keys come from env vars only: SPEKO_API_KEY, ELEVENLABS_API_KEY or OPENAI_API_KEY.
They are never printed. Gateway errors (5xx) are retried up to 3 times with a fresh
Idempotency-Key.
"""
import argparse, json, os, subprocess, sys, urllib.error, urllib.request, uuid


def request(url, body, headers):
    data = json.dumps(body).encode()
    for attempt in range(4):
        req = urllib.request.Request(url, data=data, headers={**headers, "Idempotency-Key": str(uuid.uuid4()), "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=240) as r:
                return r.read(), r.headers
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode(errors="replace")
            if e.code < 500 or attempt == 3:
                sys.exit(f"HTTP {e.code}: {msg}")
            print(f"  retry after HTTP {e.code}", flush=True)


def synth(provider, voice, model, text):
    """Return (pcm_s16le bytes, sample_rate, log dict)."""
    if provider == "speko":
        # Router: one key, explicit route to the chosen provider/model (no substitution).
        prov, _, mdl = model.partition(":")  # e.g. "elevenlabs:eleven_v4"
        body = {"input": text, "voice": voice,
                "audio": {"encoding": "pcm_s16le", "sample_rate_hz": 44100, "channels": 1},
                "routing": {"mode": "explicit", "provider": prov, "model": mdl}}
        pcm, h = request("https://router.speko.dev/v1/tts/speech", body, {"Authorization": f"Bearer {os.environ['SPEKO_API_KEY']}"})
        return pcm, 44100, {"request": h.get("Speko-Request-ID"), "attempt": h.get("Speko-Attempt-ID"), "model": h.get("Speko-Model")}
    if provider == "elevenlabs":
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=pcm_44100"
        pcm, h = request(url, {"text": text, "model_id": model}, {"xi-api-key": os.environ["ELEVENLABS_API_KEY"]})
        return pcm, 44100, {"request": h.get("request-id"), "model": model}
    if provider == "openai":
        body = {"model": model, "voice": voice, "input": text, "response_format": "pcm"}
        pcm, h = request("https://api.openai.com/v1/audio/speech", body, {"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"})
        return pcm, 24000, {"request": h.get("x-request-id"), "model": model}
    sys.exit(f"unknown provider {provider}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True)
    ap.add_argument("--voice", required=True)
    ap.add_argument("--model", required=True, help='speko: "provider:model", e.g. elevenlabs:eleven_v4')
    ap.add_argument("--lines", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("only", nargs="*")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    lines = json.load(open(a.lines))
    log = open(os.path.join(a.out, "tts-log.jsonl"), "a")
    for key, text in lines.items():
        if a.only and key not in a.only:
            continue
        pcm, rate, meta = synth(a.provider, a.voice, a.model, text)
        raw = os.path.join(a.out, f"{key}.pcm")
        open(raw, "wb").write(pcm)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(rate), "-ac", "1", "-i", raw,
                        "-ar", "44100", os.path.join(a.out, f"{key}.wav")], check=True)
        os.remove(raw)
        entry = {"line": key, "sec": round(len(pcm) / 2 / rate, 2), "provider": a.provider, **meta}
        log.write(json.dumps(entry) + "\n")
        print(entry, flush=True)


if __name__ == "__main__":
    main()
