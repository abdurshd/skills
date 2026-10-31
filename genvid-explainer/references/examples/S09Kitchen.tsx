import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip, KenBurns } from "../components/Film";
import { Cross, Eye, MiniContainer, Send, ServerIcon } from "../components/Icons";
import { Kazan } from "../components/Kazan";
import { Sfx } from "../components/Sfx";
import { Kicker, RiseTitle } from "../components/Text";
import { lerp, pop, prog } from "../lib/anim";
import { at } from "../lib/timeline";
import { body, C, display, mono } from "../theme";

const ID = "s09_kitchen";

/** "A = B" analogy card: a kitchen word mapped onto its computing twin. */
const Equation: React.FC<{ at: number; left: string; right: string; icon: React.ReactNode; style?: React.CSSProperties }> = ({ at: a, left, right, icon, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, a - 4, 14);
  const r = prog(frame, a + 6, a + 18);
  if (frame < a - 4) return null;
  return (
    <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 26, padding: "22px 34px", borderRadius: 28, background: "rgba(4,10,14,0.8)", border: `2px solid ${C.teal}88`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${C.teal}33`, scale: String(0.7 + 0.3 * s), opacity: Math.min(1, s * 1.4), ...style }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 60, color: C.amber }}>{left}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 60, color: C.muted }}>=</span>
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: r, translate: `${(1 - r) * 30}px 0px` }}>
        {icon}
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 60, color: C.teal }}>{right}</span>
      </div>
    </div>
  );
};

/** Small icon + label tag. */
const Tag: React.FC<{ at: number; text: string; icon: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ at: a, text, icon, color = C.teal, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, a - 3, 13);
  if (frame < a - 3) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 28px", borderRadius: 999, background: "rgba(4,10,14,0.82)", border: `2px solid ${color}`, boxShadow: `0 0 40px ${color}44`, scale: String(0.6 + 0.4 * s), opacity: Math.min(1, s * 1.4), transformOrigin: "left center", ...style }}>
      {icon}
      <span style={{ fontFamily: body, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};

export const S09Kitchen: React.FC = () => {
  const frame = useCurrentFrame();
  const center = at(ID, "osh");
  const pots = at(ID, "Qozonlar");
  const each = at(ID, "Har");
  const container = at(ID, "konteyner");
  const chef = at(ID, "Bosh");
  const notCook = at(ID, "damlamaydi");
  const watch = at(ID, "kuzatadi");
  const order = at(ID, "buyruq");
  const rule = at(ID, "Uning");
  const five = at(ID, "beshta");
  const ready = at(ID, "tayyor");

  const clipIn = prog(frame, each - 12, each + 2);
  const chefIn = prog(frame, chef - 12, chef + 2);
  const ruleIn = prog(frame, rule - 12, rule + 4);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* the plov center */}
      {clipIn < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clipIn }}>
          <KenBurns src="img/plov_center.png" dur={each} zoom={[1.15, 1.0]} origin="50% 60%" />
          <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(4,7,10,0.75), transparent 35%)" }} />
          <div style={{ position: "absolute", left: 120, top: 100 }}>
            <Kicker text="Tasavvur qiling" at={10} color={C.amber} />
            <div style={{ height: 18 }} />
            <RiseTitle text="Osh markazi" at={center} size={110} style={{ textShadow: "0 6px 40px rgba(0,0,0,0.8)" }} />
          </div>
          <Equation at={pots} left="Qozon" right="Server" icon={<ServerIcon size={72} />} style={{ left: 120, top: 640 }} />
        </AbsoluteFill>
      ) : null}

      {/* one kazan of plov = one container */}
      {clipIn > 0 && chefIn < 1 ? (
        <AbsoluteFill style={{ opacity: clipIn * (1 - chefIn) }}>
          <Clip src="clips/plov.mp4" scale={lerp(prog(frame, each - 12, chef), 1.08, 1.2)} origin="50% 40%" />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(4,7,10,0.7) 100%)" }} />
          <Equation at={container} left="Osh" right="Konteyner" icon={<MiniContainer size={90} />} style={{ left: 120, top: 640 }} />
        </AbsoluteFill>
      ) : null}

      {/* the head chef only watches and gives orders */}
      {chefIn > 0 && ruleIn < 1 ? (
        <AbsoluteFill style={{ opacity: chefIn * (1 - ruleIn) }}>
          <KenBurns src="img/head_chef.png" from={chef - 12} dur={rule - chef + 12} zoom={[1.0, 1.16]} origin="22% 35%" />
          <AbsoluteFill style={{ background: "linear-gradient(to right, transparent 40%, rgba(4,7,10,0.75) 75%)" }} />
          <div style={{ position: "absolute", right: 120, top: 120, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26 }}>
            <RiseTitle text="Bosh oshpaz" at={chef} size={96} style={{ textShadow: "0 6px 40px rgba(0,0,0,0.8)" }} />
            <Tag at={notCook} text="o'zi osh damlamaydi" icon={<Cross size={44} />} color={C.red} />
            <Tag at={watch} text="kuzatadi" icon={<Eye size={50} />} />
            <Tag at={order} text="buyruq beradi" icon={<Send size={46} />} color={C.amber} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* his one rule: five kazans always ready */}
      {ruleIn > 0 ? (
        <AbsoluteFill style={{ opacity: ruleIn }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #3a1d0855, ${C.bg} 70%)` }} />
          <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <Kicker text="Qoida" at={rule} color={C.amber} />
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, color: C.text, opacity: prog(frame, rule + 16, rule + 30) }}>
              doim <span style={{ color: C.amber }}>5 ta</span> qozon tayyor
            </div>
          </div>
          <div style={{ position: "absolute", top: 420, width: "100%", display: "flex", justifyContent: "center", gap: 30 }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const a = five - 6 + i * 6;
              const lit = prog(frame, a, a + 10);
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35 + 0.65 * prog(frame, rule + 10, rule + 24) }}>
                  <Kazan size={270} lit={lit} seed={i} style={{ filter: lit > 0.5 ? `drop-shadow(0 0 30px ${C.amber}66)` : undefined }} />
                  <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: lit > 0.5 ? C.amber : C.muted }}>#{i + 1}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 960, top: 810, translate: "-50% 0", fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.green, opacity: prog(frame, ready, ready + 12), padding: "10px 24px", border: `2px solid ${C.green}66`, borderRadius: 14, background: "rgba(4,10,14,0.7)" }}>
            tayyor: 5 / 5
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx at={center} name="reveal" volume={0.3} />
      <Sfx at={pots - 4} name="pebble" volume={0.4} />
      <Sfx at={each - 10} name="gust" volume={0.3} />
      <Sfx at={container - 4} name="pebble" volume={0.4} />
      <Sfx at={chef - 10} name="silk" volume={0.3} />
      <Sfx at={notCook} name="thunk" volume={0.3} />
      <Sfx at={watch} name="bubble" volume={0.3} />
      <Sfx at={order} name="bubble" volume={0.3} />
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={five - 6 + i * 6} name="tine" volume={0.22} />
      ))}
      <Sfx at={ready} name="chime" volume={0.35} />
    </AbsoluteFill>
  );
};
