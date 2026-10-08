# Story and script

## The arc (80–120 s)

| # | Beat | Scene device | Example (AI customer-support agent) |
|---|---|---|---|
| 1 | **In the wild** (hook, under 8 s) | binoculars, foliage parting, character peeks | "Shh… don't move. There. In its natural habitat… the small business owner." |
| 2 | **Species card** | field-guide card, taped notes, arrows | "Ownerus exhaustus. Habitat: seven chat apps at once. Diet: cold coffee." |
| 3–6 | **Observations 1–4** (the pain, one per scene) | observation tag + one gag each | flood of DMs; the same question again and again; the 2 a.m. customer buying next door by morning; questions in three languages |
| 7 | **The weakness** (turning point) | card returns, magnifier sweep, stamp; music stops | "This species has one weakness… there is only one of them." |
| 8 | **Enter the product** | footage plus logo pin, radial reveal | "And now… enter Make Agent Fast! One agent, on every channel." |
| 9 | **How it works** | pinned real UI, handwritten checklist | "Paste your website. In about ten minutes it learns your prices, your hours, your answers… and only says what you approve." |
| 10 | **Proof in use** | pinned real UI slices, pills, stamp | "It replies in seconds, day or night, in up to four languages. It captures the lead. Books the visit. And when it isn't sure, it hands the chat to you, with the full context. No guessing." |
| 11 | **Payoff** | generated footage of the happy character, ticks | "And the owner? Finally… drinks the coffee while it's still hot." |
| 12 | **Observation complete** | binoculars over the footage, stamp | "Observation complete." |
| 13 | **CTA** | logo outro | "Make Agent Fast. Try it free for seven days." |

Swap the species for the product's real user: the overwhelmed recruiter, the landlord, the teacher grading at midnight. Each observation must be a real pain the product removes. The callback in the payoff (cold coffee becomes hot coffee) is what makes the ending land, so plant it in beat 2.

## Writing the lines

- Keep one line per scene. Short sentences, with ellipses (…) for documentary pauses. Read it aloud: a dry, delighted British naturalist.
- Use emotion tags only where the TTS model supports them, for example ElevenLabs v3/v4 `[whispers]`, `[curious]`, `[sighs]`, `[amused]`, `[confused]`, `[excited]`, `[serious]`, `[warmly]`. Use at most two per line.
- Avoid fragile words the model may drop or mangle:
  - Quoted one-word questions need surrounding pauses ("How much? … Price? … Cost, please?").
  - Write a pseudo-Latin name phonetically ("Owner-us exhaustus").
  - Put a lead-in before a brand reveal ("And now… enter …").
- Claims in the solution half must match the product exactly (channel names, language count, trial terms). Don't put a number on a benefit unless the product measures it.
- On-screen words should echo the narration's key noun at the moment it is spoken. They must not caption every word.

## Scene list format

For every scene, write down:
- **id**
- **VO line file**
- **lead-in frames** (`VO_AT`, 4–18)
- **background**
- **focal cutout**
- **beats**: a list of `phrase onset sec → visual event`
- **tail frames** (12; up to 30 after a turning-point stamp)
- **transition into the next scene**

Fill in the onsets only after measuring the generated audio.
