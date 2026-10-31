import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";
import * as THREE from "three";
import { C } from "../theme";

type V3 = [number, number, number];

/** Points the camera from the scene's frame-driven math. Applied during render (not in an effect)
 * because ThreeCanvas renders the frame before child effects run. */
const Camera: React.FC<{ position: V3; target: V3; fov: number }> = ({ position, target, fov }) => {
  const { camera } = useThree();
  camera.position.set(...position);
  camera.lookAt(...target);
  const cam = camera as THREE.PerspectiveCamera;
  if (cam.fov !== fov) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }
  cam.updateMatrixWorld();
  return null;
};

/** Full-frame 3D stage: studio reflections, coloured key lights, fog and contact shadows. */
export const Stage: React.FC<{
  camera: V3;
  target?: V3;
  fov?: number;
  fog?: [number, number];
  bg?: string;
  children: React.ReactNode;
  key1?: string;
  key2?: string;
  shadows?: boolean;
}> = ({ camera, target = [0, 0, 0], fov = 40, fog = [14, 60], bg = C.bg, children, key1 = C.teal, key2 = C.amber, shadows = true }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ backgroundColor: bg }}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      camera={{ fov, position: camera, near: 0.1, far: 400 }}
    >
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, fog[0], fog[1]]} />
      <Camera position={camera} target={target} fov={fov} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 12, 6]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-8, 4, 6]} intensity={70} distance={45} color={key1} />
      <pointLight position={[9, 3, -4]} intensity={55} distance={45} color={key2} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, -6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={2.2} color={key1} position={[-8, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.8} color={key2} position={[8, 2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 4, 1]} />
        <Lightformer form="circle" intensity={1.5} color="#ffffff" position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} scale={6} />
      </Environment>
      {shadows ? <ContactShadows position={[0, 0.01, 0]} opacity={0.65} scale={40} blur={2.4} far={8} frames={1} /> : null}
      {children}
    </ThreeCanvas>
  );
};
