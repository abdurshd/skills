import { Composition, Folder } from "remotion";
import { FPS, SCENES, TOTAL } from "./lib/timeline";
import { Main } from "./Main";
import { SCENE_COMPONENTS } from "./scenes";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Explainer" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
      <Folder name="Scenes">
        {SCENES.filter((s) => SCENE_COMPONENTS[s.id]).map((s) => (
          <Composition key={s.id} id={s.id.replace(/_/g, "-")} component={SCENE_COMPONENTS[s.id]} durationInFrames={s.duration} fps={FPS} width={1920} height={1080} />
        ))}
      </Folder>
    </>
  );
};
