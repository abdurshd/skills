import { Easing, interpolate, spring } from "remotion";
import { ease } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 between frame a and b with an ease-out curve. */
export const prog = (frame: number, a: number, b: number, curve: readonly [number, number, number, number] = ease.out) =>
  interpolate(frame, [a, b], [0, 1], { ...clamp, easing: Easing.bezier(...curve) });

export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/** Spring that starts at `start`, settles to 1. */
export const pop = (frame: number, fps: number, start: number, damping = 14, mass = 0.7) =>
  spring({ frame: frame - start, fps, config: { damping, mass } });

/** Fade in over `inF` frames from `a`, fade out over `outF` frames ending at `b`. */
export const window = (frame: number, a: number, b: number, inF = 10, outF = 10) =>
  interpolate(frame, [a, a + inF, b - outF, b], [0, 1, 1, 0], clamp);

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
