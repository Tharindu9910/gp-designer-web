#!/usr/bin/env bash
# Builds a ~11s crossfaded reel + poster from the generated placeholders.
# Run after crop-assets.mjs: bash scripts/gen-reel.sh
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=public/video
mkdir -p "$OUT"
P=public/images
inputs=(
  "$P/coop-fly/signage.jpg" "$P/lotus-cosmic/laptop.jpg" "$P/daladha/logo.jpg"
  "$P/gome/row-1.jpg" "$P/packaging/dhara.jpg" "$P/social-media/samagi.jpg"
)

args=()
for f in "${inputs[@]}"; do args+=(-loop 1 -t 2.4 -i "$f"); done

# scale/crop each to 1280x720, then chain xfade transitions (0.5s each, every 1.9s)
filter=""
for i in "${!inputs[@]}"; do
  filter+="[$i:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,fps=30,format=yuv420p[v$i];"
done
prev="v0"
for i in 1 2 3 4 5; do
  off=$(echo "$i * 1.9" | bc)
  filter+="[$prev][v$i]xfade=transition=fade:duration=0.5:offset=$off[x$i];"
  prev="x$i"
done
filter=${filter%;}

ffmpeg -y -loglevel error "${args[@]}" -filter_complex "$filter" -map "[$prev]" \
  -c:v libx264 -preset slow -crf 28 -movflags +faststart -an "$OUT/reel.mp4"
ffmpeg -y -loglevel error -ss 0.5 -i "$OUT/reel.mp4" -frames:v 1 -q:v 4 "$OUT/reel-poster.jpg"
echo "✓ reel"
