import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip } from "../components/Film";
import { Coin, MiniContainer, Ship, Snail, Train, Truck } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { Chip, Kicker, RiseTitle } from "../components/Text";
import { lerp, pop, prog } from "../lib/anim";
import { at } from "../lib/timeline";
import { Glow, GlowGrid, ShippingContainer } from "../three/models";
import { Stage } from "../three/Stage";
import { body, C, display, mono } from "../theme";

const ID = "s06_shipping";

/** Odometer-style year that rolls up to its final digits. */
const RollingYear: React.FC<{ year: string; at: number; size: number }> = ({ year, at: a, size }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1, color: C.text, textShadow: `0 0 60px ${C.teal}66` }}>
      {[...year].map((d, i) => {
        const t = prog(frame, a + i * 4, a + 24 + i * 6, [0.2, 0.8, 0.2, 1]);
        const target = Number(d);
        const pos = lerp(t, target + 10, target);
        return (
          <div key={i} style={{ height: size, overflow: "hidden" }}>
            <div style={{ translate: `0px ${-((pos % 10) * size)}px` }}>
              {Array.from({ length: 11 }).map((_, k) => (
                <div key={k} style={{ height: size }}>{k % 10}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** A vehicle icon carrying the same teal container. */
const Carrier: React.FC<{ at: number; x: number; label: string; children: React.ReactNode; boxX?: number; boxY: number }> = ({ at: a, x, label, children, boxX = 0, boxY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, a, 16);
  const drop = pop(frame, fps, a + 8, 12);
  if (frame < a) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 300, width: 420, translate: `${(1 - s) * 400}px 0px`, opacity: Math.min(1, s * 1.5), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 340, height: 340 }}>
        {children}
        <div style={{ position: "absolute", left: `calc(50% + ${boxX}px)`, top: boxY, translate: `-50% ${(1 - drop) * -160}px`, opacity: drop }}>
          <MiniContainer size={130} />
        </div>
      </div>
      <div style={{ fontFamily: body, fontWeight: 800, fontSize: 42, color: C.text }}>{label}</div>
    </div>
  );
};

export const S06Shipping: React.FC = () => {
  const frame = useCurrentFrame();
  const sacks = at(ID, "qop-qop");
  const boxes = at(ID, "quti-quti");
  const hand = at(ID, "qo'lda");
  const slow = at(ID, "sekin");
  const costly = at(ID, "qimmat");
  const y1956 = at(ID, "Ming");
  const idea = at(ID, "oddiy");
  const same = at(ID, "bir", 2);
  const inside = at(ID, "Ichida");
  const ship = at(ID, "kema");
  const train = at(ID, "poyezd");
  const truck = at(ID, "yuk", 1);

  const oldOut = prog(frame, y1956 - 10, y1956 + 4);
  const portIn = prog(frame, y1956 - 10, y1956 + 4);
  const boxIn = prog(frame, same - 12, same + 4);
  const boxOut = prog(frame, ship - 30, ship - 10);
  const spin = prog(frame, same - 12, ship, [0.3, 0, 0.5, 1]);
  const doors = prog(frame, inside, inside + 30) * (1 - prog(frame, inside + 50, inside + 66));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* the old way: sacks and crates loaded by hand */}
      {oldOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - oldOut }}>
          <Clip src="clips/dock.mp4" playbackRate={0.77} scale={lerp(prog(frame, 0, y1956), 1.25, 1.34)} origin="60% 50%" filter={`sepia(0.35) brightness(${lerp(prog(frame, slow - 10, slow + 10), 0.95, 0.55)})`} />
          <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(4,7,10,0.7), transparent 28%)" }} />
          <Kicker text="1950-yillar" at={18} color={C.amber} style={{ position: "absolute", left: 110, top: 100 }} />
          <Chip text="qop-qop" at={sacks} size={46} color={C.sepia} out={slow - 10} style={{ left: 260, top: 340 }} />
          <Chip text="quti-quti" at={boxes} size={46} color={C.sepia} out={slow - 10} style={{ left: 1260, top: 420 }} />
          <Chip text="qo'lda" at={hand} size={46} color={C.sepia} out={slow - 10} style={{ left: 760, top: 600 }} />
          {frame >= slow - 4 ? (
            <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 140, paddingBottom: 120 }}>
              {[
                { a: slow, label: "sekin", icon: <Snail size={170} /> },
                { a: costly, label: "qimmat", icon: <Coin size={170} /> },
              ].map(({ a, label, icon }) => {
                const s = pop(frame, 30, a - 4, 11);
                return (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, scale: String(s), opacity: frame >= a - 4 ? 1 : 0 }}>
                    <div style={{ width: 260, height: 260, borderRadius: 130, background: "rgba(4,10,14,0.75)", border: `3px solid ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${C.amber}55` }}>{icon}</div>
                    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: C.amber }}>{label}</div>
                  </div>
                );
              })}
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* 1956: one simple idea */}
      {portIn > 0 && boxIn < 1 ? (
        <AbsoluteFill style={{ opacity: portIn * (1 - boxIn) }}>
          <Clip src="clips/port.mp4" filter="brightness(0.62) saturate(1.1)" />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120 }}>
            <RollingYear year="1956" at={y1956} size={250} />
            <div style={{ marginTop: 26, fontFamily: body, fontWeight: 800, fontSize: 52, color: C.text, opacity: prog(frame, idea, idea + 12), translate: `0px ${(1 - prog(frame, idea, idea + 12)) * 20}px` }}>
              oddiy bir <span style={{ color: C.teal }}>g'oya</span>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* the standard container in 3D */}
      {boxIn > 0 && boxOut < 1 ? (
        <AbsoluteFill style={{ opacity: boxIn * (1 - boxOut) }}>
          <Stage camera={[lerp(spin, -9, 7), lerp(spin, 4.5, 3), lerp(spin, 9, 10)]} target={[0, 0.6, 0]} fov={36} fog={[14, 40]}>
            <GlowGrid size={50} y={-1.3} />
            <ShippingContainer color={C.teal} doors={doors} position={[0, 0, 0]} rotation={[0, -0.3, 0]} />
            {doors > 0 ? <Glow position={[3.1, 0, -0.9]} color={C.amber} size={6 * doors} opacity={0.6} /> : null}
          </Stage>
          <AbsoluteFill style={{ padding: "100px 120px" }}>
            <RiseTitle text="bir xil o'lcham" at={same} size={92} />
            <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
              {["6 m", "2.4 m", "2.6 m"].map((d, i) => (
                <div key={d} style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.teal, padding: "8px 18px", border: `2px solid ${C.teal}66`, borderRadius: 12, background: "rgba(4,10,14,0.7)", opacity: prog(frame, same + 20 + i * 5, same + 32 + i * 5) }}>
                  {d}
                </div>
              ))}
            </div>
          </AbsoluteFill>
          <Chip text="ichida — istalgan yuk" at={inside + 8} size={44} color={C.amber} style={{ right: 140, top: 640 }} out={ship - 32} />
        </AbsoluteFill>
      ) : null}

      {/* any ship, train or truck carries it */}
      {frame >= ship - 30 ? (
        <AbsoluteFill style={{ opacity: prog(frame, ship - 30, ship - 12) }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.tealDeep}44, ${C.bg} 70%)` }} />
          <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 800, fontSize: 64, color: C.text, opacity: prog(frame, ship - 20, ship - 6) }}>
            Bitta quti — <span style={{ color: C.teal }}>istalgan transport</span>
          </div>
          <Carrier at={ship} x={150} label="Kema" boxX={-40} boxY={131}>
            <Ship size={340} />
          </Carrier>
          <Carrier at={train} x={750} label="Poyezd" boxY={103}>
            <Train size={340} />
          </Carrier>
          <Carrier at={truck} x={1350} label="Yuk mashinasi" boxX={-50} boxY={131}>
            <Truck size={340} />
          </Carrier>
        </AbsoluteFill>
      ) : null}

      <Sfx at={sacks} name="thunk" volume={0.35} />
      <Sfx at={boxes} name="thunk" volume={0.35} />
      <Sfx at={slow} name="pebble" volume={0.35} />
      <Sfx at={costly} name="ding" volume={0.3} />
      <Sfx at={y1956 - 2} name="impact" volume={0.5} />
      <Sfx at={same - 10} name="gust" volume={0.35} />
      <Sfx at={inside} name="glimmer" volume={0.3} />
      <Sfx at={ship} name="silk" volume={0.35} />
      <Sfx at={train} name="silk" volume={0.35} />
      <Sfx at={truck} name="silk" volume={0.35} />
    </AbsoluteFill>
  );
};
