import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { C } from "../theme";

/** Corrugated steel shipping container. `doors` 0 = shut, 1 = wide open. */
export const ShippingContainer: React.FC<{
  color?: string;
  doors?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  emissive?: string;
  glow?: number;
}> = ({ color = C.teal, doors = 0, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, emissive = "#000000", glow = 0 }) => {
  const L = 6, H = 2.6, W = 2.44;
  const ribs = useMemo(() => Array.from({ length: 22 }, (_, i) => -L / 2 + 0.25 + i * ((L - 0.5) / 21)), []);
  const mat = <meshStandardMaterial color={color} metalness={0.55} roughness={0.42} emissive={emissive} emissiveIntensity={glow} />;
  const frameMat = <meshStandardMaterial color="#1c2329" metalness={0.7} roughness={0.35} />;
  const angle = doors * Math.PI * 0.62;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* body: two side walls, roof, floor, back */}
      <mesh position={[0, 0, W / 2]}><boxGeometry args={[L, H, 0.05]} />{mat}</mesh>
      <mesh position={[0, 0, -W / 2]}><boxGeometry args={[L, H, 0.05]} />{mat}</mesh>
      <mesh position={[0, H / 2, 0]}><boxGeometry args={[L, 0.05, W]} />{mat}</mesh>
      <mesh position={[0, -H / 2, 0]}><boxGeometry args={[L, 0.08, W]} />{frameMat}</mesh>
      <mesh position={[-L / 2, 0, 0]}><boxGeometry args={[0.05, H, W]} />{mat}</mesh>
      {/* corrugation ribs on both long sides */}
      {ribs.map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0, W / 2 + 0.04]}><boxGeometry args={[0.1, H * 0.92, 0.06]} />{mat}</mesh>
          <mesh position={[x, 0, -W / 2 - 0.04]}><boxGeometry args={[0.1, H * 0.92, 0.06]} />{mat}</mesh>
        </group>
      ))}
      {/* corner posts */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[(sx * L) / 2, 0, (sz * W) / 2]}><boxGeometry args={[0.16, H + 0.04, 0.16]} />{frameMat}</mesh>
      ))}
      {/* two doors hinged at the +X end */}
      <group position={[L / 2, 0, W / 2]} rotation={[0, angle, 0]}>
        <mesh position={[0.02, 0, -W / 4]}><boxGeometry args={[0.06, H * 0.96, W / 2 - 0.02]} />{mat}</mesh>
        <mesh position={[0.07, 0, -W / 4 - 0.25]}><boxGeometry args={[0.04, H * 0.9, 0.04]} />{frameMat}</mesh>
      </group>
      <group position={[L / 2, 0, -W / 2]} rotation={[0, -angle, 0]}>
        <mesh position={[0.02, 0, W / 4]}><boxGeometry args={[0.06, H * 0.96, W / 2 - 0.02]} />{mat}</mesh>
        <mesh position={[0.07, 0, W / 4 + 0.25]}><boxGeometry args={[0.04, H * 0.9, 0.04]} />{frameMat}</mesh>
      </group>
    </group>
  );
};

/** Server rack with blade units and blinking LEDs (blink driven by `frame`). */
export const ServerRack: React.FC<{
  frame: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  units?: number;
  seed?: number;
  alarm?: number;
  scale?: number;
}> = ({ frame, position = [0, 0, 0], rotation = [0, 0, 0], units = 10, seed = 1, alarm = 0, scale = 1 }) => {
  const H = units * 0.32 + 0.3;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[1.6, H, 1.4]} radius={0.04} position={[0, H / 2, 0]}>
        <meshStandardMaterial color="#0d1318" metalness={0.8} roughness={0.35} />
      </RoundedBox>
      {Array.from({ length: units }).map((_, i) => {
        const y = 0.3 + i * 0.32;
        const blinkA = Math.sin(frame * (0.25 + ((i * 7 + seed * 13) % 9) * 0.05) + i * 3 + seed) > 0.2;
        const blinkB = Math.sin(frame * (0.4 + ((i * 3 + seed * 5) % 7) * 0.06) + i) > 0.6;
        const ledColor = alarm > 0.5 ? C.red : C.teal;
        return (
          <group key={i} position={[0, y, 0.71]}>
            <mesh><boxGeometry args={[1.44, 0.26, 0.02]} /><meshStandardMaterial color="#151d24" metalness={0.6} roughness={0.5} /></mesh>
            {Array.from({ length: 9 }).map((__, j) => (
              <mesh key={j} position={[-0.25 + j * 0.07, 0, 0.012]}><boxGeometry args={[0.04, 0.18, 0.005]} /><meshStandardMaterial color="#05080b" /></mesh>
            ))}
            <mesh position={[-0.6, 0.04, 0.015]}>
              <boxGeometry args={[0.05, 0.05, 0.01]} />
              <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={blinkA ? 4 : 0.3} />
            </mesh>
            <mesh position={[-0.5, 0.04, 0.015]}>
              <boxGeometry args={[0.05, 0.05, 0.01]} />
              <meshStandardMaterial color={C.amber} emissive={C.amber} emissiveIntensity={blinkB ? 3 : 0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/** Seven-spoke ship's wheel (helm), the symbol behind the Kubernetes name. */
export const ShipWheel: React.FC<{ rotation?: number; scale?: number; color?: string; glow?: number; position?: [number, number, number] }> = ({
  rotation = 0,
  scale = 1,
  color = C.teal,
  glow = 0.6,
  position = [0, 0, 0],
}) => {
  const spokes = 7;
  const mat = <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} emissive={color} emissiveIntensity={glow} />;
  return (
    <group rotation={[0, 0, rotation]} scale={scale} position={position}>
      <mesh><torusGeometry args={[2, 0.16, 24, 96]} />{mat}</mesh>
      <mesh><torusGeometry args={[0.55, 0.14, 20, 64]} />{mat}</mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.32, 32]} />{mat}</mesh>
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i / spokes) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, 0, a]}>
            <mesh position={[0, 1.3, 0]}><boxGeometry args={[0.16, 1.5, 0.16]} />{mat}</mesh>
            <mesh position={[0, 2.55, 0]}><cylinderGeometry args={[0.13, 0.17, 0.75, 20]} />{mat}</mesh>
            <mesh position={[0, 2.98, 0]}><sphereGeometry args={[0.18, 20, 20]} />{mat}</mesh>
          </group>
        );
      })}
    </group>
  );
};

/** A pod: translucent capsule around a small container block. */
export const Pod: React.FC<{ position?: [number, number, number]; scale?: number; color?: string; opacity?: number; inner?: string }> = ({
  position = [0, 0, 0],
  scale = 1,
  color = C.teal,
  opacity = 1,
  inner = C.amber,
}) => (
  <group position={position} scale={scale}>
    <mesh>
      <capsuleGeometry args={[0.42, 0.5, 8, 24]} />
      <meshPhysicalMaterial color={color} transparent opacity={0.28 * opacity} roughness={0.1} transmission={0.6} thickness={0.4} emissive={color} emissiveIntensity={0.35} />
    </mesh>
    <mesh>
      <boxGeometry args={[0.36, 0.5, 0.3]} />
      <meshStandardMaterial color={inner} metalness={0.5} roughness={0.4} emissive={inner} emissiveIntensity={0.5} transparent opacity={opacity} />
    </mesh>
  </group>
);

/** Flat glowing ground grid. */
export const GlowGrid: React.FC<{ size?: number; y?: number; color?: string }> = ({ size = 60, y = 0, color = C.teal }) => {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(size, size, color, color);
    (g.material as THREE.Material).transparent = true;
    (g.material as THREE.Material).opacity = 0.12;
    return g;
  }, [size, color]);
  return <primitive object={grid} position={[0, y, 0]} />;
};

/** Soft additive glow sprite (stand-in for bloom, which does not render headlessly). */
export const Glow: React.FC<{ position?: [number, number, number]; color?: string; size?: number; opacity?: number }> = ({
  position = [0, 0, 0],
  color = C.teal,
  size = 4,
  opacity = 0.6,
}) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
};
