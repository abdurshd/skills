import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { body, C } from "../theme";
import type { Scene, Word } from "../lib/timeline";

// Groups words into short caption lines (max ~6 words, broken at sentence ends).
const group = (words: Word[]) => {
  const lines: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const end = /[.?!:,]$/.test(w.w);
    if (cur.length >= 6 || (end && cur.length >= 3) || /[.?!]$/.test(w.w)) {
      lines.push(cur);
      cur = [];
    }
  }
  if (cur.length) lines.push(cur);
  return lines;
};

/** Word-by-word captions, active word in teal. Frames are relative to the scene. */
export const Captions: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const lines = group(scene.words);
  const idx = lines.findIndex((l, i) => {
    const next = lines[i + 1];
    return frame >= l[0].s - 4 && (!next || frame < next[0].s - 4);
  });
  if (idx < 0) return null;
  const line = lines[idx];
  const last = line[line.length - 1];
  const opacity = interpolate(frame, [line[0].s - 4, line[0].s + 2, last.e + 14, last.e + 22], [0, 1, 1, idx === lines.length - 1 ? 0 : 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 64, pointerEvents: "none" }}>
      <div
        style={{
          opacity,
          fontFamily: body,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.2,
          color: C.text,
          padding: "14px 28px",
          borderRadius: 18,
          background: "rgba(3, 7, 10, 0.62)",
          backdropFilter: "blur(10px)",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          maxWidth: 1500,
          textAlign: "center",
        }}
      >
        {line.map((w, i) => {
          const active = frame >= w.s - 1 && frame < w.e + 2;
          const spoken = frame >= w.s - 1;
          return (
            <span key={i} style={{ color: active ? C.teal : spoken ? C.text : "rgba(242,246,247,0.55)" }}>
              {w.w}
              {i < line.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
