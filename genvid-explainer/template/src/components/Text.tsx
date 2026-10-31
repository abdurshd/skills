import { useCurrentFrame, useVideoConfig } from "remotion";
import { pop, prog } from "../lib/anim";
import { body, C, display } from "../theme";

/** Headline whose letters rise in one by one. */
export const RiseTitle: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  font?: string;
  stagger?: number;
  out?: number;
  style?: React.CSSProperties;
}> = ({ text, at, size = 120, color = C.text, font = display, stagger = 1.6, out, style }) => {
  const frame = useCurrentFrame();
  const fade = out === undefined ? 1 : 1 - prog(frame, out, out + 10);
  return (
    <div style={{ fontFamily: font, fontWeight: 800, fontSize: size, color, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "pre", opacity: fade, ...style }}>
      {[...text].map((ch, i) => {
        const t = prog(frame, at + i * stagger, at + i * stagger + 16);
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, translate: `0px ${(1 - t) * size * 0.5}px`, filter: `blur(${(1 - t) * 10}px)` }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};

/** Rounded chip label that springs in. */
export const Chip: React.FC<{
  text: string;
  at: number;
  color?: string;
  size?: number;
  out?: number;
  icon?: string;
  style?: React.CSSProperties;
}> = ({ text, at, color = C.teal, size = 40, out, icon, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at);
  const fade = out === undefined ? 1 : 1 - prog(frame, out, out + 10);
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: `${size * 0.32}px ${size * 0.6}px`,
        borderRadius: 999,
        border: `2px solid ${color}`,
        background: "rgba(4, 10, 14, 0.78)",
        boxShadow: `0 0 40px ${color}55, inset 0 0 20px ${color}22`,
        color: C.text,
        fontFamily: body,
        fontWeight: 800,
        fontSize: size,
        scale: String(0.6 + 0.4 * s),
        opacity: Math.min(1, s * 1.4) * fade,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon ? <span style={{ color, fontSize: size * 1.05 }}>{icon}</span> : null}
      {text}
    </div>
  );
};

/** Small uppercase label used as a section kicker. */
export const Kicker: React.FC<{ text: string; at: number; color?: string; style?: React.CSSProperties }> = ({ text, at, color = C.teal, style }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, at, at + 14);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: t, translate: `${(1 - t) * -30}px 0px`, ...style }}>
      <div style={{ width: 56 * t, height: 3, background: color, borderRadius: 2 }} />
      <span style={{ fontFamily: body, fontWeight: 800, fontSize: 30, letterSpacing: "0.22em", color, textTransform: "uppercase" }}>{text}</span>
    </div>
  );
};
