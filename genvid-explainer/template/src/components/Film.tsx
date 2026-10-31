import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { rand } from "../lib/anim";

/** Vignette plus animated film grain over the whole frame. */
export const Grain: React.FC<{ strength?: number }> = ({ strength = 0.07 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: strength, mixBlendMode: "overlay" }}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Still image with a slow camera move (push/pan) and optional parallax drift. */
export const KenBurns: React.FC<{
  src: string;
  dur: number;
  from?: number;
  zoom?: [number, number];
  pan?: [number, number, number, number];
  filter?: string;
  origin?: string;
}> = ({ src, dur, from = 0, zoom = [1.04, 1.18], pan = [0, 0, 0, 0], filter, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = zoom[0] + (zoom[1] - zoom[0]) * t;
  const x = pan[0] + (pan[2] - pan[0]) * t;
  const y = pan[1] + (pan[3] - pan[1]) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(s), translate: `${x}px ${y}px`, transformOrigin: origin, filter }}
      />
    </AbsoluteFill>
  );
};

/** Generated video clip, always zoomed enough to crop the corner watermark (origin picks what stays in frame). */
export const Clip: React.FC<{ src: string; scale?: number; origin?: string; filter?: string; playbackRate?: number; trimBefore?: number }> = ({
  src,
  scale = 1.08,
  origin = "30% 30%",
  filter,
  playbackRate = 1,
  trimBefore,
}) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Video src={staticFile(src)} muted playbackRate={playbackRate} trimBefore={trimBefore} objectFit="cover" style={{ width: "100%", height: "100%", scale: String(scale), transformOrigin: origin, filter }} />
  </AbsoluteFill>
);

/** Light streaks sweeping across the frame (used on hard cuts). */
export const Flash: React.FC<{ at: number; color?: string }> = ({ at, color = "#bff7f0" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 3, at, at + 10], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`, opacity: o, mixBlendMode: "screen" }} />;
};

/** Seeded random dots used as a subtle data-particle field. */
export const Particles: React.FC<{ n?: number; color?: string; speed?: number }> = ({ n = 60, color = "#19c3b1", speed = 0.6 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = rand(i) * 1920;
        const y = ((rand(i + 99) * 1180 - frame * speed * (0.4 + rand(i + 7))) % 1180 + 1180) % 1180 - 50;
        const r = 1 + rand(i + 3) * 2.5;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: color, opacity: 0.25 + rand(i + 5) * 0.5, boxShadow: `0 0 ${r * 4}px ${color}` }} />;
      })}
    </AbsoluteFill>
  );
};
