import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const body = loadManrope("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const display = loadUnbounded("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

export const C = {
  bg: "#04070a",
  panel: "#0b1218",
  line: "rgba(160, 220, 215, 0.16)",
  teal: "#19c3b1",
  tealDeep: "#0b7f74",
  amber: "#f5a524",
  red: "#ff4d4d",
  green: "#3ddc84",
  text: "#f2f6f7",
  muted: "#8fa3ab",
  sepia: "#d9c3a0",
  steel: "#6f8796",
};

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};
