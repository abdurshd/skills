type V3 = [number, number, number];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Screen position (1920x1080) of a world point for a Stage camera, so HTML labels can follow 3D objects. */
export const project = (p: V3, camera: V3, target: V3, fov: number, w = 1920, h = 1080) => {
  const f = norm(sub(target, camera));
  const r = norm(cross(f, [0, 1, 0]));
  const u = cross(r, f);
  const d = sub(p, camera);
  const z = dot(d, f);
  const focal = h / 2 / Math.tan(((fov / 2) * Math.PI) / 180);
  return { x: w / 2 + (dot(d, r) / z) * focal, y: h / 2 - (dot(d, u) / z) * focal };
};
