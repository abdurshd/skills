import React from "react";
import {AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame} from "remotion";
import {Badge, Binoculars, Cutout, Note, ObsTag, Paper, PaperBubble, PenArrow, Scrawl, Stamp, clamp, fonts, img, ink, onTwos, p, s} from "./kit";

/**
 * Worked examples: the binocular hook, the species card, one observation,
 * and the helpers for pinning real product UI. Beat times are phrase onsets
 * (seconds into the scene's narration line) measured with phrase-onsets.sh.
 */

export const VO_AT = 6;
/** Frame of a beat `sec` seconds into this scene's narration line. */
export const at = (sec: number) => VO_AT + s(sec);

/** Replace the mark with the product's real logo component or <Img>. */
export const Seal: React.FC = () => <Badge mark={<div style={{width: 58, height: 58, background: ink.brand}} />} label="YOUR BRAND" />;

/* ── Shared backgrounds ────────────────────────────────────────────── */

export const Habitat: React.FC<{zoom?: [number, number]; dim?: number}> = ({zoom = [1.06, 1.14], dim = 0}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: ink.jungle, overflow: "hidden"}}>
      <Img src={img("bg-jungle.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", scale: `${interpolate(frame, [0, 300], zoom, clamp)}`}} />
      <AbsoluteFill style={{background: `rgba(5,12,8,${dim})`}} />
    </AbsoluteFill>
  );
};

/** Foreground leaf that sways on twos and swings away by `part` (0→1). */
export const Leaf: React.FC<{src: string; x: number; y: number; h: number; rot: number; flip?: boolean; part?: number; dir?: number}> = ({src, x, y, h, rot, flip, part = 0, dir = 1}) => {
  const frame = onTwos(useCurrentFrame());
  const sway = Math.sin(frame / 16 + x) * 1.6;
  return (
    <div style={{position: "absolute", left: x + part * 380 * dir, top: y, height: h, translate: "-50% -50%", rotate: `${rot + sway + part * 18 * dir}deg`, scale: flip ? "-1 1" : undefined, filter: "drop-shadow(0 20px 26px rgba(0,0,0,0.55)) brightness(0.82)"}}>
      <Img src={src} style={{height: "100%", width: "auto", display: "block"}} />
    </div>
  );
};

export const SpeciesHeader: React.FC<{title: string; kind: string; latin: string}> = ({title, kind, latin}) => {
  const frame = onTwos(useCurrentFrame());
  const k = p(frame, 0, 12);
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: k, translate: `0 ${(1 - k) * -30}px`}}>
      <div style={{fontFamily: fonts.display, fontWeight: 900, fontSize: 196, lineHeight: 0.9, color: ink.ink, filter: "url(#stamp-grain)"}}>{title}</div>
      <div style={{fontFamily: fonts.type, fontSize: 40, letterSpacing: "0.42em", color: ink.red, marginTop: 18}}>{kind}</div>
      <div style={{fontFamily: fonts.display, fontStyle: "italic", fontWeight: 700, fontSize: 40, color: "#4a4136", marginTop: 12}}>({latin})</div>
    </div>
  );
};

/* ── 1. Hook: the species in the wild (VO lead-in 18) ──────────────── */

export const HOOK_VO = 18;
export const HOOK_DUR = HOOK_VO + s(6.64) + 12;
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = p(frame, HOOK_VO + s(5.07), 22); // "…the small business owner."
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Habitat zoom={[1.18, 1.08]} />
      {/* "There." — the hero peeks out from behind the leaves */}
      <Cutout src={img("hero-peek.png")} x={560 + reveal * 20} y={1420 - reveal * 40} h={980} at={HOOK_VO + s(2.05)} from="up" sway={0.5} />
      <Leaf src={img("leaf-banana.png")} x={180} y={1330} h={1000} rot={-24} part={reveal} dir={-1} />
      <Leaf src={img("leaf-monstera.png")} x={900} y={1260} h={900} rot={28} flip part={reveal} dir={1} />
      <Leaf src={img("leaf-monstera.png")} x={300} y={520} h={700} rot={160} part={reveal} dir={-1} />
      <Leaf src={img("leaf-banana.png")} x={860} y={560} h={760} rot={200} flip part={reveal} dir={1} />
      <Binoculars />
      <Seal />
    </AbsoluteFill>
  );
};

/* ── 2. Species card ───────────────────────────────────────────────── */

export const SPECIES_DUR = VO_AT + s(7.92) + 12;
export const SpeciesScene: React.FC = () => (
  <AbsoluteFill>
    <Paper card />
    <SpeciesHeader title="OWNER" kind="SMALL BUSINESS" latin="Ownerus exhaustus" />
    <Cutout src={img("hero-frazzled.png")} x={330} y={1730} h={1150} at={2} />
    <Note label="HABITAT:" value="7 chat apps at once" at={at(2.67)} valueAt={at(3.62)} x={560} y={760} w={420} rot={2.5} />
    <PenArrow d="M 10 20 C 60 60, 90 80, 150 70" head={[150, 70, -10]} at={at(3.8)} w={200} h={120} style={{left: 420, top: 820}} />
    <Note label="DIET:" value="cold coffee" at={at(6.03)} valueAt={at(6.94)} x={600} y={1130} w={380} rot={-2} />
    <Cutout src={img("prop-mug-cold.png")} x={830} y={1640} h={250} at={at(6.94)} from="drop" sway={0} rot={6} />
    <Seal />
  </AbsoluteFill>
);

/* ── 3. An observation: the echo ───────────────────────────────────── */

const ECHO = ["price pls", "how much is it?", "얼마예요?", "сколько стоит?", "narxi qancha?", "¿precio?", "cost??", "price 🙏", "how much"];

export const ECHO_DUR = VO_AT + s(11.52) + 12;
export const EchoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const gridAt = at(7.31); // "The same question…"
  return (
    <AbsoluteFill>
      <Paper />
      <ObsTag n={2} title="The echo" at={4} />
      <PaperBubble text="How much?" at={at(3.39)} x={110} y={520} size={64} rot={-2} />
      <PaperBubble text="Price?" at={at(4.89)} x={560} y={640} size={64} rot={2} />
      <PaperBubble text="Cost, please?" at={at(5.95)} x={170} y={790} size={64} rot={-1} />
      {ECHO.map((t, i) => {
        const a = gridAt + i * 9; // one polaroid every 9 frames: "again, and again…"
        if (frame < a) return null;
        const k = p(onTwos(frame), a, 8);
        return (
          <div key={i} style={{position: "absolute", left: 70 + (i % 3) * 320, top: 1000 + Math.floor(i / 3) * 250, width: 290, height: 220, background: "#fffaf0", boxShadow: "0 10px 22px rgba(60,40,10,0.2)", rotate: `${((i * 37) % 9) - 4}deg`, scale: `${0.6 + 0.4 * k}`, opacity: k, padding: 18, boxSizing: "border-box"}}>
            <div style={{height: 130, background: "#e9e4d8", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <div style={{background: "#fff", borderRadius: 26, borderBottomLeftRadius: 6, padding: "12px 20px", fontFamily: fonts.ui, fontWeight: 600, fontSize: 30, color: ink.ink, whiteSpace: "nowrap"}}>{t}</div>
            </div>
          </div>
        );
      })}
      <Scrawl text="same. question." at={at(10.2)} x={480} y={1730} size={86} rot={-3} center />
      <Stamp text="again" at={at(10.83)} x={820} y={420} rot={8} size={70} paper />
      <Seal />
    </AbsoluteFill>
  );
};

/* ── Real product UI on paper ──────────────────────────────────────── */

/** Plays `children` from its own frame `offset`, only between parent frames [start, end). */
export const Slice: React.FC<{start: number; end?: number; offset: number; children: React.ReactNode}> = ({start, end, offset, children}) => (
  <Sequence from={start} durationInFrames={end === undefined ? undefined : end - start} layout="none">
    <Sequence from={-offset} layout="none">
      <AbsoluteFill>{children}</AbsoluteFill>
    </Sequence>
  </Sequence>
);

/** A full 1080×1920 product scene shrunk onto the paper, tilted and shadowed. */
export const Pinned: React.FC<{children: React.ReactNode; x: number; y: number; scale: number; rot?: number}> = ({children, x, y, scale, rot = -2}) => {
  const k = p(useCurrentFrame(), 0, 16);
  return (
    <div style={{position: "absolute", left: x, top: y, width: 1080, height: 1920, transformOrigin: "0 0", scale: `${scale * (0.8 + 0.2 * k)}`, rotate: `${rot}deg`, opacity: k, filter: "drop-shadow(0 30px 40px rgba(40,25,5,0.35))"}}>
      {children}
    </div>
  );
};
/* Usage: <Pinned x={-60} y={280} scale={0.7}>
 *          <Slice start={0} end={150} offset={50}><RealDmScene /></Slice>
 *          <Slice start={150} offset={1228}><RealDmScene /></Slice>   // jump-cut to a later moment
 *        </Pinned> */
