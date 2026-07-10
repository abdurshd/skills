# TTS providers and credentials

## Non-negotiable credential gate

The invocation must explicitly provide:

1. the provider choice; and
2. an API-key value or a named environment-variable/secret reference.

If either is absent, ask for both and pause. Do not search unrelated dotfiles for credentials, choose a provider silently, or print a discovered key. Prefer environment variables or a secret manager. Never write keys into source, manifests, logs, rendered props, Git history, or client-side bundles.

Acceptable examples:

- `provider=openai, key is in OPENAI_API_KEY`
- `provider=gemini, use GEMINI_API_KEY from .env.local`
- `provider=elevenlabs, secret reference is ELEVENLABS_API_KEY`

Treat a pasted raw key as sensitive: use it only for the requested generation, never echo it, and do not persist it unless the user explicitly requests a secure local environment file.

## Provider selection

Verify current models, SDKs, pricing, output formats, limits, and voice names using official provider documentation at execution time.

### OpenAI

Use the current official speech-generation API and supported SDK or REST format. It is a convenient choice when direct MP3/WAV output and instruction-steered delivery are available. Preserve the exact model and voice used. Request WAV when cross-provider consistency matters; MP3 is acceptable when the renderer and duration reader support it reliably.

### Gemini

Use the current `@google/genai` SDK, not deprecated Google generative-AI packages. Gemini TTS commonly returns base64 PCM audio; wrap it in a valid WAV container using the documented sample rate, channel count, and bit depth before saving. Use a TTS-specific model, not a general text model, and record that preview models may change. Gemini is useful for detailed direction, expressive tags, and multi-speaker lessons.

### Other providers

Use another provider only after confirming it supports server-side TTS, the requested language, commercial use, stable file output, and the required voice controls. Isolate its implementation behind the same `synthesize({text, instructions, voice, outFile})` boundary.

## Generation rules

- Generate one file per storyboard scene.
- Use deterministic filenames: `public/voiceover/<videoId>/<sceneId>.<ext>`.
- Skip existing files unless `--force` is explicitly selected.
- Retry transient failures with bounded exponential backoff.
- Fail on empty/invalid audio and do not update the manifest for failed scenes.
- Measure duration from the saved file.
- Use a temporary file and atomic rename so interrupted requests do not leave valid-looking partial audio.
- Keep narration instructions separate from spoken transcript so the model does not read direction aloud.
- Audition one representative scene before generating the whole video when changing provider or voice.

## Provider-neutral manifest

Prefer:

```json
{
  "videoId": "example",
  "provider": "gemini",
  "model": "verified-current-model",
  "voice": "selected-voice",
  "format": "wav",
  "scenes": {
    "01-hook": {
      "file": "public/voiceover/example/01-hook.wav",
      "durationSeconds": 4.82
    }
  }
}
```

Do not store the key or authorization headers in this file.
