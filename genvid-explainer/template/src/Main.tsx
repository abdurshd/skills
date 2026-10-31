import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "./components/Captions";
import { Grain } from "./components/Film";
import { OVERLAP, SCENES, TOTAL, type Scene } from "./lib/timeline";
import { SCENE_COMPONENTS } from "./scenes";
import { C } from "./theme";

/** Each scene fades/zooms in over the previous one, which keeps running for OVERLAP extra frames. */
const Enter: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  if (first) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = interpolate(frame, [0, OVERLAP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: t, scale: String(1.06 - 0.06 * t), filter: t < 1 ? `blur(${(1 - t) * 14}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

// Gemini narration peaks near -1 dBFS, so voice sits at 0.85 and music under it; the mix then peaks around -0.7 dB.
const MUSIC_VOLUME = 0.095;
const MUSIC_FADE = Math.min(90, Math.floor(TOTAL / 3));

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {SCENES.map((s: Scene, i) => {
        const Comp = SCENE_COMPONENTS[s.id];
        const last = i === SCENES.length - 1;
        return (
          <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.duration + (last ? 0 : OVERLAP)}>
            <Enter first={i === 0}>{Comp ? <Comp /> : null}</Enter>
          </Sequence>
        );
      })}
      {SCENES.map((s) => (
        <Sequence key={`cap-${s.id}`} name={`captions ${s.id}`} from={s.from} durationInFrames={s.duration}>
          <Captions scene={s} />
        </Sequence>
      ))}
      {SCENES.map((s) => (
        <Sequence key={`vo-${s.id}`} name={`vo ${s.id}`} from={s.from + s.voiceAt} durationInFrames={s.voiceDur + 6}>
          <Audio src={staticFile(`vo/${s.id}.wav`)} volume={0.85} />
        </Sequence>
      ))}
      <Sequence name="music" durationInFrames={TOTAL}>
        <Audio
          src={staticFile("music/bed.mp3")}
          volume={(f) => interpolate(f, [0, 30, TOTAL - MUSIC_FADE, TOTAL], [0, MUSIC_VOLUME, MUSIC_VOLUME, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      <Grain />
    </AbsoluteFill>
  );
};
