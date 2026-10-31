#!/bin/zsh
# Scaffold an explainer project from the template: new-project.sh <project-dir>
set -e
skill=${0:A:h:h}
dest=$1
[[ -n $dest && ! -e $dest ]] || { echo "usage: new-project.sh <new-dir> (must not exist)"; exit 1; }
cp -R "$skill/template" "$dest"
cd "$dest"
mkdir -p work public/img public/clips public/vo
npm ci --loglevel=error
ls public/sfx/*.wav >/dev/null 2>&1 || echo "warning: public/sfx is empty; copy the SFX WAVs (see SKILL.md, sfx_dir) before rendering"
echo "ready: $dest"
