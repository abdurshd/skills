import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import {loadFont as loadPlayfair} from "@remotion/google-fonts/PlayfairDisplay";
import {loadFont as loadSpecialElite} from "@remotion/google-fonts/SpecialElite";
import {loadFont as loadCaveat} from "@remotion/google-fonts/Caveat";
import {loadFont as loadInter} from "@remotion/google-fonts/Inter";

/**
 * genvid-collage template kit (copy into the Remotion project, then adapt).
 * Assets are expected under public/<ASSET_DIR>/img (cutouts, bg-paper.jpg, bg-jungle.jpg).
 *
 * Field-notes collage kit: aged paper, masking tape, red pen, rubber stamps
 * and photo cutouts that move "on twos" like stop-motion paper.
 */

const playfair = loadPlayfair("normal", {weights: ["700", "900"], subsets: ["latin"]});
loadPlayfair("italic", {weights: ["700"], subsets: ["latin"]});
const elite = loadSpecialElite("normal", {weights: ["400"], subsets: ["latin"]});
const caveat = loadCaveat("normal", {weights: ["700"], subsets: ["latin", "cyrillic"]});
const inter = loadInter("normal", {weights: ["500", "600", "700"], subsets: ["latin", "cyrillic"]});

export const fonts = {
  display: `${playfair.fontFamily}, Georgia, serif`,
  type: `${elite.fontFamily}, "Courier New", monospace`,
  hand: `${caveat.fontFamily}, "Bradley Hand", cursive`,
  ui: `${inter.fontFamily}, "Apple SD Gothic Neo", system-ui, sans-serif`,
};

export const ink = {
  paper: "#efe5cf",
  ink: "#1f1a14",
  red: "#c4372b",
  redDeep: "#a52a20",
  tape: "rgba(236, 222, 178, 0.86)",
  note: "#f7f0dc",
  jungle: "#0f1d14",
  night: "#101828",
  /** Product brand colour: replies, CTAs, "approved" stamps. */
  brand: "#00817b",
};

export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const springy = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Stop-motion clock: holds every frame twice. */
export const onTwos = (frame: number) => Math.floor(frame / 2) * 2;

export const p = (frame: number, from: number, dur: number, easing = easeOut) =>
  interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing});

/** Seconds → frames at 30 fps. */
export const s = (sec: number) => Math.round(sec * 30);

/** Folder under public/ that holds this film's assets. */
export const ASSET_DIR = "field-notes";
export const img = (name: string) => staticFile(`${ASSET_DIR}/img/${name}`);

/* ── Paper ──────────────────────────────────────────────────────────── */

/** Aged graph paper (generated scan) with a drawn grid fallback and a soft vignette. */
export const Paper: React.FC<{tint?: string; card?: boolean}> = ({tint, card}) => (
  <AbsoluteFill style={{background: ink.paper}}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(70,90,110,0.10) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(70,90,110,0.10) 1.5px, transparent 1.5px)",
        backgroundSize: "54px 54px",
      }}
    />
    <Img src={img("bg-paper.jpg")} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.9}} />
    {tint ? <AbsoluteFill style={{background: tint}} /> : null}
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(60,40,10,0.22) 100%)"}} />
    {card ? <div style={{position: "absolute", inset: 64, border: "3px double rgba(31,26,20,0.55)"}} /> : null}
  </AbsoluteFill>
);

/* ── Cutouts ────────────────────────────────────────────────────────── */

type CutoutProps = {
  src: string;
  /** Centre x and the y of the bottom edge, in px. */
  x: number;
  y: number;
  h: number;
  at?: number;
  from?: "pop" | "left" | "right" | "up" | "drop";
  /** Idle sway in degrees. */
  sway?: number;
  rot?: number;
  flip?: boolean;
  out?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
};

/** A photo cutout pinned onto the scene: springs in, then breathes on twos. */
export const Cutout: React.FC<CutoutProps> = ({src, x, y, h, at = 0, from = "pop", sway = 0.8, rot = 0, flip, out, shadow = true, style}) => {
  const frame = onTwos(useCurrentFrame());
  const k = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: springy});
  const gone = out === undefined ? 0 : p(frame, out, 10, Easing.in(Easing.cubic));
  if (frame < at) return null;
  const seed = (src.length * 7) % 13;
  const idle = Math.sin((frame - at) / 9 + seed) * sway;
  const dx = from === "left" ? (1 - k) * -900 : from === "right" ? (1 - k) * 900 : 0;
  const dy = from === "up" ? (1 - k) * 900 : from === "drop" ? (1 - k) * -700 : 0;
  const sc = from === "pop" ? 0.55 + 0.45 * k : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        height: h,
        translate: `-50% -100%`,
        transformOrigin: "50% 100%",
        transform: `translate(${dx}px, ${dy + gone * 60}px) rotate(${rot + idle}deg) scale(${sc * (flip ? -1 : 1)}, ${sc})`,
        opacity: Math.min(1, k * 2) * (1 - gone),
        filter: shadow ? "drop-shadow(0 22px 22px rgba(30,20,8,0.30)) drop-shadow(0 3px 3px rgba(30,20,8,0.25))" : undefined,
        ...style,
      }}
    >
      <Img src={src} style={{height: "100%", width: "auto", display: "block"}} />
    </div>
  );
};

/* ── Tape, notes, tags ─────────────────────────────────────────────── */

export const Tape: React.FC<{w?: number; rot?: number; style?: React.CSSProperties}> = ({w = 130, rot = -4, style}) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: 40,
      background: ink.tape,
      rotate: `${rot}deg`,
      boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
      clipPath: "polygon(2% 8%, 8% 0, 16% 10%, 26% 2%, 38% 9%, 50% 1%, 62% 8%, 74% 0, 86% 9%, 94% 2%, 100% 10%, 98% 92%, 90% 100%, 80% 91%, 68% 99%, 56% 92%, 44% 100%, 32% 91%, 20% 99%, 10% 92%, 0 98%)",
      ...style,
    }}
  />
);

/** Torn paper label pinned top-left: "OBSERVATION 3 / The night shift". */
export const ObsTag: React.FC<{n: number | string; title: string; at?: number; dark?: boolean}> = ({n, title, at = 0, dark}) => {
  const frame = onTwos(useCurrentFrame());
  const k = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: springy});
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 170,
        padding: "22px 34px 20px",
        background: ink.note,
        rotate: `${-2.5 + (1 - k) * -8}deg`,
        scale: `${0.7 + 0.3 * k}`,
        opacity: k,
        transformOrigin: "0 0",
        boxShadow: dark ? "0 14px 30px rgba(0,0,0,0.5)" : "0 10px 22px rgba(60,40,10,0.22)",
        clipPath: "polygon(0 4%, 6% 0, 14% 3%, 30% 0, 52% 3%, 70% 0, 88% 2%, 100% 0, 99% 30%, 100% 62%, 98% 100%, 80% 97%, 60% 100%, 40% 96%, 18% 100%, 0 97%, 2% 60%)",
        zIndex: 20,
      }}
    >
      <div style={{fontFamily: fonts.type, fontSize: 26, letterSpacing: "0.18em", color: ink.red}}>{typeof n === "number" ? `OBSERVATION ${n}` : n}</div>
      <div style={{fontFamily: fonts.display, fontStyle: "italic", fontWeight: 700, fontSize: 62, color: ink.ink, lineHeight: 1.05, marginTop: 4}}>{title}</div>
      <Tape w={120} rot={8} style={{right: -44, top: -14}} />
    </div>
  );
};

/** A taped note: tiny typewriter label + handwritten value. */
export const Note: React.FC<{label: string; value?: string; valueAt?: number; at: number; x: number; y: number; w?: number; rot?: number}> = ({label, value, valueAt, at, x, y, w = 360, rot = 2}) => {
  const frame = onTwos(useCurrentFrame());
  const k = interpolate(frame, [at, at + 10], [0, 1], {...clamp, easing: springy});
  if (frame < at) return null;
  const vAt = valueAt ?? at + 8;
  const chars = value ? Math.floor(interpolate(frame, [vAt, vAt + value.length * 1.3], [0, value.length], clamp)) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "24px 26px 26px",
        background: ink.note,
        rotate: `${rot}deg`,
        scale: `${1.25 - 0.25 * k}`,
        opacity: k,
        boxShadow: "0 12px 24px rgba(60,40,10,0.22)",
      }}
    >
      <Tape w={110} rot={-3} style={{left: "50%", top: -20, marginLeft: -55}} />
      <div style={{fontFamily: fonts.type, fontSize: 25, letterSpacing: "0.12em", color: ink.ink, display: "flex", alignItems: "center", gap: 10}}>
        <span style={{width: 12, height: 12, borderRadius: 6, border: `2px solid ${ink.ink}`, display: "inline-block"}} />
        {label}
      </div>
      {value ? <div style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 56, color: ink.red, lineHeight: 1.05, marginTop: 8, minHeight: 58}}>{value.slice(0, chars)}</div> : null}
    </div>
  );
};

/** Hand-drawn red pen arrow that draws itself. */
export const PenArrow: React.FC<{d: string; at: number; head: [number, number, number]; w?: number; h?: number; style?: React.CSSProperties; color?: string}> = ({d, at, head, w = 300, h = 200, style, color = ink.red}) => {
  const frame = onTwos(useCurrentFrame());
  const k = p(frame, at, 12);
  if (frame < at) return null;
  const [hx, hy, ha] = head;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: "absolute", overflow: "visible", ...style}}>
      <path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      <g transform={`translate(${hx} ${hy}) rotate(${ha})`} opacity={k > 0.9 ? 1 : 0}>
        <path d="M0 0 L-26 -14 M0 0 L-24 16" stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
};

/** Red rubber stamp that slams down. */
export const Stamp: React.FC<{text: React.ReactNode; at: number; x: number; y: number; rot?: number; size?: number; color?: string; boxed?: boolean; paper?: boolean}> = ({text, at, x, y, rot = -8, size = 92, color = ink.red, boxed = true, paper}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const k = interpolate(frame, [at, at + 6], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const shake = frame - at < 10 ? Math.sin((frame - at) * 2.4) * (10 - (frame - at)) * 0.9 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% -50%`,
        rotate: `${rot}deg`,
        scale: `${2.2 - 1.2 * k}`,
        opacity: 0.15 + 0.85 * k,
        transform: `translate(${shake}px, ${shake * 0.6}px)`,
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        color,
        padding: boxed ? "14px 28px 18px" : 0,
        border: boxed ? `8px solid ${color}` : undefined,
        borderRadius: 10,
        whiteSpace: "nowrap",
        background: paper ? ink.note : undefined,
        boxShadow: paper ? "0 16px 30px rgba(40,25,5,0.35)" : undefined,
        textAlign: "center",
        zIndex: 30,
      }}
    >
      <div style={{filter: "url(#stamp-grain)"}}>{text}</div>
    </div>
  );
};

/** SVG filters shared by the film (ink grain on stamps). */
export const Filters: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <filter id="stamp-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.3" result="m" />
      <feComposite in="SourceGraphic" in2="m" operator="in" />
    </filter>
  </svg>
);

/* ── Chat on paper ─────────────────────────────────────────────────── */

export const PaperBubble: React.FC<{
  text: React.ReactNode;
  at: number;
  x: number;
  y: number;
  w?: number;
  side?: "left" | "right";
  tone?: "paper" | "agent" | "link";
  size?: number;
  rot?: number;
  avatar?: React.ReactNode;
}> = ({text, at, x, y, w, side = "left", tone = "paper", size = 44, rot = 0, avatar}) => {
  const frame = onTwos(useCurrentFrame());
  const k = interpolate(frame, [at, at + 10], [0, 1], {...clamp, easing: springy});
  if (frame < at) return null;
  const bg = tone === "agent" ? ink.brand : tone === "link" ? "#eef3fb" : "#fffaf0";
  const fg = tone === "agent" ? "#fff" : ink.ink;
  return (
    <div style={{position: "absolute", left: x, top: y, display: "flex", gap: 18, alignItems: "flex-end", flexDirection: side === "right" ? "row-reverse" : "row", rotate: `${rot}deg`, opacity: k, scale: `${0.6 + 0.4 * k}`, transformOrigin: side === "right" ? "100% 100%" : "0 100%"}}>
      {avatar}
      <div
        style={{
          maxWidth: w ?? 700,
          padding: "22px 30px 24px",
          background: bg,
          color: fg,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.22,
          letterSpacing: "-0.01em",
          borderRadius: 34,
          borderBottomLeftRadius: side === "left" ? 8 : 34,
          borderBottomRightRadius: side === "right" ? 8 : 34,
          boxShadow: "0 14px 28px rgba(60,40,10,0.18), 0 2px 4px rgba(60,40,10,0.12)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ── Brand ─────────────────────────────────────────────────────────── */

/** Persistent round badge (the film's "seal"). */
export const Badge: React.FC<{mark: React.ReactNode; label: string; corner?: "br" | "tr"}> = ({mark, label, corner = "br"}) => (
  <div
    style={{
      position: "absolute",
      right: 56,
      ...(corner === "br" ? {bottom: 70} : {top: 70}),
      width: 128,
      height: 128,
      borderRadius: 64,
      background: "#13221b",
      border: "3px solid rgba(239,229,207,0.85)",
      boxShadow: "0 0 0 5px #13221b, 0 10px 24px rgba(0,0,0,0.35)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      zIndex: 50,
    }}
  >
    <div style={{width: 58, height: 58, borderRadius: 12, overflow: "hidden"}}>{mark}</div>
    <div style={{fontFamily: fonts.type, fontSize: 13, letterSpacing: "0.14em", color: "#efe5cf"}}>{label}</div>
  </div>
);

/* ── Binoculars ────────────────────────────────────────────────────── */

/** Twin-lens binocular mask with a REC readout. */
export const Binoculars: React.FC<{label?: string; t0?: number}> = ({label = "OBSERVATION", t0 = 2}) => {
  const frame = useCurrentFrame();
  const sec = Math.floor(frame / 30) + t0;
  const breathe = Math.sin(frame / 20) * 6;
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
        <defs>
          <mask id="bino">
            <rect width={1080} height={1920} fill="white" />
            <circle cx={330} cy={860 + breathe} r={440} fill="black" />
            <circle cx={750} cy={860 + breathe} r={440} fill="black" />
          </mask>
          <radialGradient id="lensL" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.82" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.85} />
          </radialGradient>
        </defs>
        <circle cx={330} cy={860 + breathe} r={442} fill="url(#lensL)" />
        <circle cx={750} cy={860 + breathe} r={442} fill="url(#lensL)" />
        <rect width={1080} height={1920} fill="#050806" mask="url(#bino)" />
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: fonts.type, fontSize: 30, letterSpacing: "0.3em", color: "rgba(239,229,207,0.85)"}}>
        <span style={{display: "inline-block", width: 18, height: 18, borderRadius: 9, background: "#e0352b", marginRight: 16, opacity: frame % 30 < 18 ? 1 : 0.25, translate: "0 1px"}} />
        {label} · 00:{String(sec).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/* ── Misc ──────────────────────────────────────────────────────────── */

/** Handwritten red caption, written on. */
export const Scrawl: React.FC<{text: string; at: number; x: number; y: number; size?: number; rot?: number; color?: string; center?: boolean}> = ({text, at, x, y, size = 72, rot = -4, color = ink.red, center}) => {
  const frame = onTwos(useCurrentFrame());
  if (frame < at) return null;
  const n = Math.floor(interpolate(frame, [at, at + text.length * 1.4], [0, text.length], clamp));
  return (
    <div style={{position: "absolute", left: x, top: y, rotate: `${rot}deg`, fontFamily: fonts.hand, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", translate: center ? "-50% 0" : undefined, textShadow: "0 1px 0 rgba(255,255,255,0.4)"}}>
      {text.slice(0, n)}
    </div>
  );
};

/** Jittered paper confetti for the outro. */
export const Confetti: React.FC<{n?: number}> = ({n = 26}) => {
  const frame = onTwos(useCurrentFrame());
  const colors = ["#c4372b", "#00817b", "#e8b33c", "#6f54ef", "#1f1a14"];
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {Array.from({length: n}).map((_, i) => {
        const x = random(`cx${i}`) * 1080;
        const speed = 2 + random(`cs${i}`) * 3;
        const y = ((random(`cy${i}`) * 2100 + frame * speed) % 2100) - 120;
        const r = random(`cr${i}`) * 360 + frame * (random(`cw${i}`) - 0.5) * 6;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: 18, height: 26, background: colors[i % colors.length], rotate: `${r}deg`, opacity: 0.75}} />;
      })}
    </AbsoluteFill>
  );
};
