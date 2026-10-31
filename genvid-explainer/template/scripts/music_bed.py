"""Loop a music track to cover the video: python scripts/music_bed.py SRC.mp3 SECONDS [public/music/bed.mp3]
Keeps the intro, then repeats the body from LOOP_FROM seconds (default 20) with 3 s crossfades until it is long enough."""
import subprocess, sys

src, need = sys.argv[1], float(sys.argv[2])
out = sys.argv[3] if len(sys.argv) > 3 else "public/music/bed.mp3"
loop_from = float(__import__("os").environ.get("LOOP_FROM", "20"))
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
XF = 3.0
parts, total = [f"[0:a]atrim=0:{dur},asetpts=PTS-STARTPTS[p0]"], dur
n = 0
while total < need + 4:
    n += 1
    parts.append(f"[0:a]atrim={loop_from}:{dur},asetpts=PTS-STARTPTS[p{n}]")
    total += dur - loop_from - XF
chain, last = [], "p0"
for i in range(1, n + 1):
    chain.append(f"[{last}][p{i}]acrossfade=d={XF}:c1=tri:c2=tri[x{i}]")
    last = f"x{i}"
graph = ";".join(parts[:1] + parts[1:] + chain) if n else parts[0]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", graph, "-map", f"[{last}]", "-t", str(need + 4),
                "-c:a", "libmp3lame", "-b:a", "192k", out], check=True)
print(out, f"{min(total, need + 4):.1f}s from {dur:.1f}s source, {n} loop(s)")
