import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sfx } from "../components/Sfx";
import { Chip, RiseTitle } from "../components/Text";
import { lerp, prog } from "../lib/anim";
import { at } from "../lib/timeline";
import { Glow, GlowGrid, Pod, ServerRack } from "../three/models";
import { project } from "../three/project";
import { Stage } from "../three/Stage";
import { body, C, display, mono } from "../theme";

const ID = "s11_terms";
type V3 = [number, number, number];

const NODE_X = [-5, 0, 5];
const SLOT_X = [-1.25, 0, 1.25];
const podPos = (node: number, slot: number): V3 => [NODE_X[node] + SLOT_X[slot], 1.05, 0.5];

/** A worker machine: a platform with a short rack at the back. */
const Node: React.FC<{ x: number; frame: number; on: number; failed: number }> = ({ x, frame, on, failed }) => {
  const edge = failed > 0.5 ? C.red : C.teal;
  return (
    <group position={[x, (1 - on) * -3, 0]}>
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[4.2, 0.35, 3.2]} />
        <meshStandardMaterial color={failed > 0.5 ? "#2a0c0c" : "#0d1418"} metalness={0.6} roughness={0.35} />
      </mesh>
      {[1.6, -1.6].map((z) => (
        <mesh key={z} position={[0, 0.36, z]}>
          <boxGeometry args={[4.2, 0.03, 0.03]} />
          <meshBasicMaterial color={edge} />
        </mesh>
      ))}
      {[2.1, -2.1].map((ex) => (
        <mesh key={ex} position={[ex, 0.36, 0]}>
          <boxGeometry args={[0.03, 0.03, 3.2]} />
          <meshBasicMaterial color={edge} />
        </mesh>
      ))}
      <ServerRack frame={frame} units={5} position={[0, 0.35, -1.05]} scale={0.75} alarm={failed} seed={Math.round(x)} />
    </group>
  );
};

export const S11Terms: React.FC = () => {
  const frame = useCurrentFrame();
  const server = at(ID, "server");
  const node = at(ID, "node");
  const pod = at(ID, "pod");
  const smallest = at(ID, "eng");
  const you = at(ID, "Siz");
  const write = at(ID, "yozasiz");
  const always = at(ID, "doim");
  const five = at(ID, "beshta");
  const copies = at(ID, "nusxa");
  const rest = at(ID, "Qolganini");
  const self = at(ID, "o'zi");

  // camera: wide → close on one pod → wide and shifted left for the spec card
  const zoomIn = prog(frame, smallest - 30, smallest + 6, [0.5, 0, 0.3, 1]);
  const zoomOut = prog(frame, you - 10, you + 24, [0.5, 0, 0.3, 1]);
  const z = zoomIn * (1 - zoomOut);
  const shift = prog(frame, you - 10, you + 24);
  const wide: V3 = [lerp(shift, 0, 4.2), lerp(shift, 7.5, 8.6), lerp(shift, 15, 18.5)];
  const close: V3 = [podPos(0, 0)[0] + 1.2, 2.4, 4.4];
  const cam: V3 = [lerp(z, wide[0], close[0]), lerp(z, wide[1], close[1]), lerp(z, wide[2], close[2])];
  const tgt: V3 = [lerp(z, lerp(shift, 0, 4.2), podPos(0, 0)[0]), lerp(z, 0.6, 1.1), lerp(z, 0, 0.5)];
  const FOV = 38;

  const failed = prog(frame, rest - 6, rest + 4);

  // pods: [node, slot, appear, gone]; the two on node 1 die and are rescheduled to nodes 0 and 2
  const pods: { n: number; s: number; a: number; gone?: number; from?: number }[] = [
    { n: 0, s: 0, a: pod - 4 },
    { n: 1, s: 0, a: pod, gone: rest },
    { n: 2, s: 0, a: pod + 4 },
    { n: 0, s: 1, a: five },
    { n: 1, s: 1, a: copies, gone: rest },
    { n: 0, s: 2, a: self - 20, from: 1 },
    { n: 2, s: 1, a: self - 12, from: 1 },
  ];
  const alive = pods.filter((p) => frame >= p.a + 8 && (p.gone === undefined || frame < p.gone)).length;

  const labelNode = (i: number) => project([NODE_X[i], -0.2, 1.8], cam, tgt, FOV);
  const podLabel = project([podPos(0, 0)[0], 2.1, 0.5], cam, tgt, FOV);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Stage camera={cam} target={tgt} fov={FOV} fog={[16, 50]} shadows={false}>
        <GlowGrid size={80} y={-0.01} />
        {NODE_X.map((x, i) => (
          <Node key={i} x={x} frame={frame} on={prog(frame, server - 10 + i * 4, server + 10 + i * 4)} failed={i === 1 ? failed : 0} />
        ))}
        {pods.map((p, k) => {
          const t = prog(frame, p.a, p.a + 14);
          if (t <= 0) return null;
          const dead = p.gone !== undefined ? prog(frame, p.gone, p.gone + 14) : 0;
          if (dead >= 1) return null;
          const end = podPos(p.n, p.s);
          let pos: V3 = [end[0], end[1] + (1 - t) * 2.5, end[2]];
          if (p.from !== undefined) {
            const start = podPos(p.from, k % 2);
            pos = [lerp(t, start[0], end[0]), lerp(t, start[1], end[1]) + Math.sin(t * Math.PI) * 2.2, end[2]];
          }
          return (
            <group key={k}>
              <Pod position={pos} scale={0.95 * (1 - dead * 0.6)} color={dead > 0 ? C.red : C.teal} inner={dead > 0 ? C.red : C.amber} opacity={1 - dead} />
              {p.from !== undefined && t < 1 ? <Glow position={pos} color={C.green} size={2.5} opacity={0.6} /> : null}
            </group>
          );
        })}
      </Stage>

      {/* node labels */}
      {NODE_X.map((_, i) => {
        const p = labelNode(i);
        const o = prog(frame, node - 4 + i * 4, node + 8 + i * 4) * (1 - z);
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y + 18, translate: "-50% 0", opacity: o, fontFamily: mono, fontWeight: 700, fontSize: 36, color: i === 1 && failed > 0.5 ? C.red : C.teal, letterSpacing: "0.1em" }}>
            NODE {i + 1}
          </div>
        );
      })}
      {frame >= node - 4 && frame < pod ? (
        <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 800, fontSize: 72, color: C.text, opacity: prog(frame, node - 4, node + 8) * (1 - prog(frame, pod - 10, pod)) }}>
          server = <span style={{ color: C.teal }}>node</span>
        </div>
      ) : null}
      {frame >= pod && frame < you ? (
        <div style={{ position: "absolute", left: podLabel.x, top: podLabel.y - 20, translate: "-50% -100%", fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.amber, padding: "8px 18px", borderRadius: 12, border: `2px solid ${C.amber}`, background: "rgba(4,10,14,0.8)", opacity: prog(frame, pod, pod + 10) * (1 - prog(frame, you - 12, you)) }}>
          POD
        </div>
      ) : null}
      {frame >= pod && frame < smallest - 20 ? (
        <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 800, fontSize: 64, color: C.text, opacity: prog(frame, pod + 6, pod + 18) * (1 - prog(frame, smallest - 30, smallest - 20)) }}>
          konteyner → <span style={{ color: C.amber }}>pod</span> ichida
        </div>
      ) : null}
      <Chip text="eng kichik bo'lak" at={smallest + 2} size={50} color={C.amber} out={you - 14} style={{ left: 220, top: 620 }} />

      {/* the spec you write */}
      {frame >= write - 12 ? (
        <div style={{ position: "absolute", right: 70, top: 150, width: 590, borderRadius: 26, background: "rgba(8,14,19,0.92)", border: `2px solid ${C.line}`, boxShadow: `0 30px 80px rgba(0,0,0,0.6)`, opacity: prog(frame, write - 12, write) * (1 - prog(frame, rest + 30, rest + 44)), overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 10, padding: "16px 22px", borderBottom: `1px solid ${C.line}`, alignItems: "center" }}>
            {[C.red, C.amber, C.green].map((col) => (
              <div key={col} style={{ width: 14, height: 14, borderRadius: 7, background: col, opacity: 0.8 }} />
            ))}
            <span style={{ marginLeft: 14, fontFamily: mono, fontSize: 26, color: C.muted }}>osh.yaml</span>
          </div>
          <div style={{ padding: "26px 30px", fontFamily: mono, fontWeight: 700, fontSize: 40, lineHeight: 1.7 }}>
            {[
              { t: "kind: Deployment", c: C.muted, a: write - 10 },
              { t: "name: osh-markazi", c: C.muted, a: write - 2 },
              { t: "replicas: 5", c: C.amber, a: always },
            ].map(({ t, c, a }) => {
              const k = prog(frame, a, a + 16);
              return (
                <div key={t} style={{ color: c, whiteSpace: "pre", background: t.startsWith("replicas") && frame >= copies ? `${C.amber}22` : undefined, borderRadius: 8 }}>
                  {t.slice(0, Math.round(t.length * k))}
                  {k > 0 && k < 1 ? <span style={{ color: C.teal }}>▌</span> : null}
                </div>
              );
            })}
          </div>
          <div style={{ padding: "0 30px 26px", fontFamily: body, fontWeight: 800, fontSize: 36, color: C.text, opacity: prog(frame, copies, copies + 12) }}>
            = doim <span style={{ color: C.amber }}>5 ta nusxa</span> ishlasin
          </div>
        </div>
      ) : null}
      {frame >= you - 6 && frame < write - 10 ? (
        <div style={{ position: "absolute", left: 120, top: 110, fontFamily: display, fontWeight: 800, fontSize: 60, color: C.text, opacity: prog(frame, you - 6, you + 8) * (1 - prog(frame, write - 22, write - 12)) }}>
          Siz faqat <span style={{ color: C.teal }}>nima kerak</span>ligini yozasiz
        </div>
      ) : null}

      {/* live status */}
      {frame >= five - 10 ? (
        <div style={{ position: "absolute", left: 120, top: 120, fontFamily: mono, fontWeight: 700, fontSize: 44, color: alive >= 5 ? C.green : C.red, padding: "10px 22px", borderRadius: 14, border: `2px solid ${alive >= 5 ? C.green : C.red}88`, background: "rgba(4,10,14,0.75)", opacity: prog(frame, five - 10, five) }}>
          ishlayapti: {alive}/5
        </div>
      ) : null}
      {frame >= self - 2 ? (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 220 }}>
          <RiseTitle text="Kubernetes o'zi bajaradi" at={self - 2} size={80} color={C.text} style={{ textShadow: `0 0 40px ${C.teal}88` }} />
        </AbsoluteFill>
      ) : null}

      <Sfx at={server - 10} name="thunk" volume={0.35} />
      <Sfx at={node} name="tine" volume={0.3} />
      <Sfx at={pod - 4} name="bubble" volume={0.35} />
      <Sfx at={smallest - 30} name="gust" volume={0.3} />
      <Sfx at={write - 10} name="silk" volume={0.25} />
      <Sfx at={always} name="pebble" volume={0.3} />
      <Sfx at={five} name="bubble" volume={0.3} />
      <Sfx at={copies} name="bubble" volume={0.3} />
      <Sfx at={rest - 6} name="buzzer" volume={0.35} />
      <Sfx at={self - 20} name="dispatch" volume={0.35} />
      <Sfx at={self + 2} name="chime" volume={0.35} />
    </AbsoluteFill>
  );
};
