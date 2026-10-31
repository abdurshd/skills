import { C } from "../theme";

type P = { size?: number; color?: string; stroke?: number; style?: React.CSSProperties };
const svg = (size: number, style: React.CSSProperties | undefined, children: React.ReactNode, vb = "0 0 24 24") => (
  <svg width={size} height={size} viewBox={vb} fill="none" style={style}>
    {children}
  </svg>
);

export const Check: React.FC<P> = ({ size = 64, color = C.green, stroke = 2.6, style }) =>
  svg(size, style, <path d="M4 12.5l5 5L20 6.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />);

export const Cross: React.FC<P> = ({ size = 64, color = C.red, stroke = 2.6, style }) =>
  svg(size, style, <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={stroke} strokeLinecap="round" />);

export const Laptop: React.FC<P> = ({ size = 160, color = C.text, stroke = 1.4, style }) =>
  svg(size, style, (
    <>
      <rect x="4" y="4.5" width="16" height="11" rx="1.4" stroke={color} strokeWidth={stroke} />
      <path d="M2 18.5h20l-1.4 1.6H3.4z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
      <path d="M7 8h5M7 10.5h8M7 13h4" stroke={C.teal} strokeWidth={stroke} strokeLinecap="round" />
    </>
  ));

export const ServerIcon: React.FC<P & { led?: string }> = ({ size = 160, color = C.text, stroke = 1.4, led = C.teal, style }) =>
  svg(size, style, (
    <>
      {[3, 9.5, 16].map((y) => (
        <g key={y}>
          <rect x="4" y={y} width="16" height="5" rx="1" stroke={color} strokeWidth={stroke} />
          <circle cx="7" cy={y + 2.5} r="0.9" fill={led} />
          <path d={`M10 ${y + 2.5}h7`} stroke={color} strokeWidth={stroke * 0.7} strokeLinecap="round" opacity={0.6} />
        </g>
      ))}
    </>
  ));

export const Ship: React.FC<P> = ({ size = 160, color = C.text, stroke = 1.3, style }) =>
  svg(size, style, (
    <>
      <path d="M2 15h20l-3 5H5z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
      <path d="M15 15v-4h3v4" stroke={color} strokeWidth={stroke} />
      <path d="M2.5 22c1.5 0 1.5-.8 3-.8s1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8" stroke={C.teal} strokeWidth={stroke * 0.8} />
    </>
  ), "0 0 24 24");

export const Train: React.FC<P> = ({ size = 160, color = C.text, stroke = 1.3, style }) =>
  svg(size, style, (
    <>
      <rect x="2" y="13" width="20" height="5" rx="0.8" stroke={color} strokeWidth={stroke} />
      <circle cx="6" cy="19.5" r="1.4" stroke={color} strokeWidth={stroke} />
      <circle cx="18" cy="19.5" r="1.4" stroke={color} strokeWidth={stroke} />
      <path d="M1 22h22" stroke={C.teal} strokeWidth={stroke * 0.8} />
    </>
  ));

export const Truck: React.FC<P> = ({ size = 160, color = C.text, stroke = 1.3, style }) =>
  svg(size, style, (
    <>
      <path d="M2 18V15h13v3M15 18v-5h3.5l2.5 3v2" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
      <circle cx="6" cy="19" r="1.5" stroke={color} strokeWidth={stroke} />
      <circle cx="18" cy="19" r="1.5" stroke={color} strokeWidth={stroke} />
    </>
  ));

/** Box drawn as a small shipping container (used on top of ship/train/truck). */
export const MiniContainer: React.FC<P & { w?: number }> = ({ size = 160, color = C.teal, style }) =>
  svg(size, style, (
    <>
      <rect x="3" y="7" width="18" height="8" rx="0.6" fill={color} opacity={0.9} />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M${5 + i * 2} 8v6`} stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" />
      ))}
    </>
  ));

export const Eye: React.FC<P> = ({ size = 64, color = C.teal, stroke = 2, style }) =>
  svg(size, style, (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" stroke={color} strokeWidth={stroke} />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={stroke} />
    </>
  ));

export const Wrench: React.FC<P> = ({ size = 64, color = C.teal, stroke = 2, style }) =>
  svg(size, style, <path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.5-1.5a4 4 0 0 1-5-5l2.5 2.5 2-2z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />);

export const Play: React.FC<P> = ({ size = 64, color = C.teal, stroke = 2, style }) =>
  svg(size, style, <path d="M8 5.5v13l10.5-6.5z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />);

export const Moon: React.FC<P> = ({ size = 64, color = "#cfe3ff", style }) =>
  svg(size, style, <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill={color} />);

export const Person: React.FC<P> = ({ size = 32, color = C.text, style }) =>
  svg(size, style, (
    <>
      <circle cx="12" cy="7" r="4" fill={color} />
      <path d="M4 22c0-5 3.6-8 8-8s8 3 8 8z" fill={color} />
    </>
  ));

export const Send: React.FC<P> = ({ size = 64, color = C.teal, stroke = 2, style }) =>
  svg(size, style, <path d="M21 3L3 10.5l7 3 3 7L21 3zM10 13.5L21 3" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />);

export const Snail: React.FC<P> = ({ size = 64, color = C.amber, stroke = 1.8, style }) =>
  svg(size, style, (
    <>
      <circle cx="13" cy="12" r="5.5" stroke={color} strokeWidth={stroke} />
      <path d="M13 12a2 2 0 1 1 2-2" stroke={color} strokeWidth={stroke} />
      <path d="M2 18h17c2 0 3-1.5 3-3V10M20 10l-1.5-3M22 10l.5-3" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </>
  ));

export const Coin: React.FC<P> = ({ size = 64, color = C.amber, stroke = 2, style }) =>
  svg(size, style, (
    <>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={stroke} />
      <path d="M14.5 9c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6v1.5M12 16.5V18" stroke={color} strokeWidth={stroke * 0.8} strokeLinecap="round" />
    </>
  ));
