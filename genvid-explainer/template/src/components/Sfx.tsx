import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

export type SfxName =
  | "bubble" | "buzzer" | "chime" | "crest" | "ding" | "dispatch" | "emblem" | "finale" | "glimmer"
  | "gust" | "impact" | "pebble" | "reveal" | "ripple" | "silk" | "thunk" | "tine";

/** One-shot sound effect at a scene-relative frame. */
export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number }> = ({ at, name, volume = 0.35 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={150} layout="none" name={`sfx:${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
