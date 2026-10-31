import data from "../data/timeline.json";

export type Word = { w: string; s: number; e: number };
export type Scene = { id: string; from: number; duration: number; voiceAt: number; voiceDur: number; words: Word[] };

export const FPS = data.fps;
export const TOTAL = data.total;
export const SCENES = data.scenes as Scene[];
// Scenes overlap so the next one can dissolve over the last frames of the previous.
export const OVERLAP = 14;

export const scene = (id: string): Scene => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

const norm = (w: string) => w.toLowerCase().replace(/[^a-zʻ'’ʼ0-9]/g, "").replace(/[ʻ’ʼ]/g, "'");

/** Frame (relative to scene start) where the nth word starting with `prefix` begins. */
export const at = (id: string, prefix: string, nth = 0): number => {
  const p = norm(prefix);
  const hits = scene(id).words.filter((x) => norm(x.w).startsWith(p));
  const hit = hits[nth];
  if (!hit) throw new Error(`Word "${prefix}" (#${nth}) not found in ${id}`);
  return hit.s;
};

/** Frame where the nth word starting with `prefix` ends. */
export const atEnd = (id: string, prefix: string, nth = 0): number => {
  const p = norm(prefix);
  const hit = scene(id).words.filter((x) => norm(x.w).startsWith(p))[nth];
  if (!hit) throw new Error(`Word "${prefix}" (#${nth}) not found in ${id}`);
  return hit.e;
};
