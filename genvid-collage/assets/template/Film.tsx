import React from "react";
import {AbsoluteFill, Sequence, interpolate, staticFile} from "remotion";
import {Audio} from "@remotion/media";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {ASSET_DIR, Filters, clamp} from "./kit";
import {ECHO_DUR, EchoScene, HOOK_DUR, HOOK_VO, HookScene, SPECIES_DUR, SpeciesScene, VO_AT} from "./scenes.example";

/**
 * genvid-collage composition skeleton.
 * One row per scene: its component, length, narration file, narration lead-in,
 * and how it is entered. Narration lives in public/<ASSET_DIR>/vo/<vo>.wav.
 * Register it in Root.tsx at 1080×1920, 30 fps, durationInFrames = FILM_DURATION.
 */

const T = 8; // transition frames

type Scene = {id: string; frames: number; Comp: React.FC; vo: string; voAt: number; cut?: "slide" | "fade"};

const SCENES: Scene[] = [
  {id: "hook", frames: HOOK_DUR, Comp: HookScene, vo: "01-hook", voAt: HOOK_VO},
  {id: "species", frames: SPECIES_DUR, Comp: SpeciesScene, vo: "02-species", voAt: VO_AT},
  {id: "echo", frames: ECHO_DUR, Comp: EchoScene, vo: "03-echo", voAt: VO_AT, cut: "slide"},
  // …observations, the weakness (turning point), the reveal, the product, the payoff, the CTA
];

const starts: number[] = [];
SCENES.forEach((_, i) => starts.push(i === 0 ? 0 : starts[i - 1] + SCENES[i - 1].frames - T));
export const FILM_DURATION = starts[starts.length - 1] + SCENES[SCENES.length - 1].frames;
const startOf = (id: string) => starts[SCENES.findIndex((sc) => sc.id === id)] ?? FILM_DURATION;

/**
 * Music: about 0.2 under the narration, a hard stop on the turning-point stamp, then back on
 * the product's name, about 0.45 in the voiceless CTA tail, and faded out at the end.
 * Set TURN/BACK from the measured onsets of those scenes' lines.
 */
const MUSIC = `music/your-track.mp3`;
const Music: React.FC = () => {
  const turn = startOf("weakness") + VO_AT + Math.round(4.48 * 30);
  const back = startOf("reveal") + 4 + Math.round(1.17 * 30);
  const tail = startOf("cta") + VO_AT + Math.round(3.76 * 30);
  const end = FILM_DURATION;
  return (
    <>
      <Sequence durationInFrames={Math.min(turn + 6, end)}>
        <Audio src={staticFile(MUSIC)} volume={(f) => interpolate(f, [0, 12, turn - 2, turn + 5], [0, 0.2, 0.2, 0], clamp)} />
      </Sequence>
      {back < end ? (
        <Sequence from={back}>
          <Audio src={staticFile(MUSIC)} trimBefore={60 * 30} volume={(f) => interpolate(f + back, [back, back + 8, tail, tail + 15, end - 45, end - 1], [0, 0.22, 0.22, 0.45, 0.45, 0], clamp)} />
        </Sequence>
      ) : null}
    </>
  );
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{background: "#000"}}>
    <Filters />
    <TransitionSeries>
      {SCENES.flatMap((sc, i) => {
        const items = [
          <TransitionSeries.Sequence key={sc.id} durationInFrames={sc.frames}>
            <sc.Comp />
            <Sequence from={sc.voAt}>
              <Audio src={staticFile(`${ASSET_DIR}/vo/${sc.vo}.wav`)} />
            </Sequence>
          </TransitionSeries.Sequence>,
        ];
        const next = SCENES[i + 1];
        if (next) {
          items.push(
            <TransitionSeries.Transition key={`${sc.id}-t`} presentation={next.cut === "slide" ? slide({direction: "from-right"}) : fade()} timing={linearTiming({durationInFrames: T})} />,
          );
        }
        return items;
      })}
    </TransitionSeries>
    <Music />
  </AbsoluteFill>
);
