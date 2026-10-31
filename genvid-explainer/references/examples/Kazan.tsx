import { useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Flat kazan on a fire. `lit` brings up the flame and steam; `burnt` turns it into a smoking red failure. */
export const Kazan: React.FC<{ size?: number; lit?: number; burnt?: number; seed?: number; style?: React.CSSProperties }> = ({ size = 200, lit = 1, burnt = 0, seed = 0, style }) => {
  const frame = useCurrentFrame() + seed * 17;
  const flame = (0.85 + Math.sin(frame * 0.5) * 0.1 + Math.sin(frame * 1.3) * 0.05) * lit * (1 - burnt);
  const rice = burnt > 0.5 ? "#3a2a22" : C.amber;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <defs>
        <radialGradient id={`fire${seed}`} cx="50%" cy="100%" r="70%">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.4" stopColor={C.amber} />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* steam or smoke */}
      {[0, 1, 2].map((k) => {
        const t = ((frame * 0.02 + k / 3) % 1);
        const x = 38 + k * 12 + Math.sin(frame * 0.05 + k * 2) * 4;
        const smoke = burnt > 0.3;
        return (
          <circle key={k} cx={x} cy={40 - t * 34} r={4 + t * 7} fill={smoke ? "#555" : "#e8f4f2"} opacity={(1 - t) * (smoke ? 0.7 * burnt : 0.35 * lit)} />
        );
      })}
      {/* fire */}
      <ellipse cx="50" cy="90" rx={26 * flame + 0.01} ry={14 * flame + 0.01} fill={`url(#fire${seed})`} opacity={flame > 0 ? 1 : 0} />
      {/* bowl */}
      <path d="M12 52 Q50 98 88 52 Z" fill="#14191d" stroke={burnt > 0.5 ? C.red : "#2b343b"} strokeWidth="2.4" />
      <ellipse cx="50" cy="52" rx="38" ry="8" fill="#0d1114" stroke={burnt > 0.5 ? C.red : "#3a454d"} strokeWidth="2.4" />
      <ellipse cx="50" cy="52.5" rx="33" ry="5.6" fill={rice} opacity={0.35 + 0.65 * Math.max(lit, burnt)} />
      {/* handles */}
      <path d="M10 50 h-5 M90 50 h5" stroke="#3a454d" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};
