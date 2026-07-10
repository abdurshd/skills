#!/usr/bin/env node
import {existsSync, readFileSync} from "node:fs";
import path from "node:path";

const [storyboardArg, manifestArg, projectRootArg] = process.argv.slice(2);

if (!storyboardArg || !manifestArg) {
  console.error("Usage: node validate-genvid.mjs <storyboard.json> <voiceover-manifest.json> [project-root]");
  process.exit(2);
}

const loadJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON ${file}: ${error.message}`);
  }
};

const storyboardPath = path.resolve(storyboardArg);
const manifestPath = path.resolve(manifestArg);
const projectRoot = path.resolve(projectRootArg ?? path.dirname(storyboardPath));
const storyboard = loadJson(storyboardPath);
const manifest = loadJson(manifestPath);
const errors = [];
const warnings = [];

const positive = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;

if (!nonEmpty(storyboard.videoId)) errors.push("storyboard.videoId must be a non-empty string");
if (!positive(storyboard.fps)) errors.push("storyboard.fps must be positive");
if (!positive(storyboard.width)) errors.push("storyboard.width must be positive");
if (!positive(storyboard.height)) errors.push("storyboard.height must be positive");
if (!Array.isArray(storyboard.scenes) || storyboard.scenes.length === 0) {
  errors.push("storyboard.scenes must be a non-empty array");
}

const manifestScenes = manifest.scenes ?? manifest[storyboard.videoId] ?? {};
const seen = new Set();
let measuredSeconds = 0;

for (const [index, scene] of (storyboard.scenes ?? []).entries()) {
  const label = `scene[${index}]`;
  if (!nonEmpty(scene.id)) {
    errors.push(`${label}.id must be a non-empty string`);
    continue;
  }
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(scene.id)) errors.push(`${scene.id}: id must be filename-safe`);
  if (seen.has(scene.id)) errors.push(`${scene.id}: duplicate scene id`);
  seen.add(scene.id);
  if (!nonEmpty(scene.narration)) errors.push(`${scene.id}: narration is required`);
  if (!nonEmpty(scene.visualGoal)) errors.push(`${scene.id}: visualGoal is required`);
  if (!nonEmpty(scene.purpose)) warnings.push(`${scene.id}: purpose is missing`);
  if (!nonEmpty(scene.source)) warnings.push(`${scene.id}: source/provenance is missing`);
  if (!Array.isArray(scene.actions)) errors.push(`${scene.id}: actions must be an array`);

  const entry = manifestScenes[scene.id];
  const duration = typeof entry === "number" ? entry : entry?.durationSeconds;
  if (!positive(duration)) {
    errors.push(`${scene.id}: missing positive voiceover duration`);
    continue;
  }
  measuredSeconds += duration;

  for (const [actionIndex, action] of (scene.actions ?? []).entries()) {
    if (!nonEmpty(action.description)) errors.push(`${scene.id}: action[${actionIndex}] needs a description`);
    if (typeof action.atSeconds !== "number" || action.atSeconds < 0) {
      errors.push(`${scene.id}: action[${actionIndex}].atSeconds must be zero or positive`);
    } else if (action.atSeconds > duration + 1.5) {
      warnings.push(`${scene.id}: action[${actionIndex}] occurs well after voiceover ends`);
    }
  }

  if (typeof entry === "object" && nonEmpty(entry.file)) {
    const audioPath = path.isAbsolute(entry.file) ? entry.file : path.resolve(projectRoot, entry.file);
    if (!existsSync(audioPath)) errors.push(`${scene.id}: audio file does not exist at ${audioPath}`);
  }
}

for (const id of Object.keys(manifestScenes)) {
  if (!seen.has(id)) warnings.push(`${id}: manifest entry has no storyboard scene`);
}

const timing = storyboard.timing ?? {};
const lead = positive(timing.leadInSeconds) ? timing.leadInSeconds : 0.45;
const tail = positive(timing.tailPaddingSeconds) ? timing.tailPaddingSeconds : 0.9;
const transitionFrames = typeof timing.transitionFrames === "number" && timing.transitionFrames >= 0
  ? timing.transitionFrames
  : 14;
const fps = positive(storyboard.fps) ? storyboard.fps : 30;
let totalFrames = 0;
for (const scene of storyboard.scenes ?? []) {
  const entry = manifestScenes[scene.id];
  const duration = typeof entry === "number" ? entry : entry?.durationSeconds;
  if (!positive(duration)) continue;
  totalFrames += Math.ceil((duration + tail) * fps) + Math.round(lead * fps) - transitionFrames;
}
if ((storyboard.scenes ?? []).length > 0) totalFrames += transitionFrames;

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`Validated ${seen.size} scenes.`);
console.log(`Measured voiceover: ${measuredSeconds.toFixed(3)}s.`);
console.log(`Estimated composition: ${totalFrames} frames (${(totalFrames / fps).toFixed(3)}s at ${fps} FPS).`);
console.log(`Warnings: ${warnings.length}.`);
