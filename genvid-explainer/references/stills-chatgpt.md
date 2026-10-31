# Stills from ChatGPT (Claude in Chrome)

Open one new tab at `https://chatgpt.com/` and keep every still in that one chat, so the series keeps one look. ChatGPT returns 16:9 images at about 1672x941. `KenBurns` covers the frame, so that resolution is fine.

## Prompts

The first message fixes the series style; later ones refer back to it:

> Create an image. Landscape 16:9, 1920x1080. Style for a whole series: cinematic photorealistic, dark moody scene, teal (#19C3B1) and warm amber accent lighting, shallow depth of field, premium documentary look. No text, no letters, no logos, no watermarks. Scene: …

> Next image, same series style (16:9, cinematic photoreal, dark, teal and amber accents, no text/logos). Scene: …

- Describe one camera position, one subject, the light, and what stays out of focus.
- Override the style per image when the story calls for it: "historical black-and-white documentary photograph with slight warm sepia, film grain (no teal)" for the past, or "warm: amber firelight dominant with a little teal in the shadows" for food and culture scenes.
- People: seen from behind, at a distance, or faces calm with mouths closed. No real or famous people, and no readable brands.
- Leave negative space where the scene plan puts titles or chips (for example "subject on the right third").
- If ChatGPT asks a clarifying question instead of drawing, answer "Generate it as described."

## Saving an image

Wait until generation finishes (the stop button is gone and a `Generated image` img is present). Install the copy helper once per tab with `javascript_tool`:

```js
window.__copyImg = async (n) => { const imgs=[...document.querySelectorAll('main img')].filter(i=>i.naturalWidth>800 && (i.alt||'').startsWith('Generated image')); const img=imgs[imgs.length-1-(n||0)]; const b=await (await fetch(img.src)).blob(); const png = b.type==='image/png'? b : await new Promise(r=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);c.toBlob(r,'image/png')}); window.focus(); await navigator.clipboard.write([new ClipboardItem({'image/png': png})]); return [img.naturalWidth, img.naturalHeight, b.type, png.size, img.src.slice(-40)]; }; await window.__copyImg()
```

Later images: `window.focus(); await window.__copyImg()`. Then write the clipboard to disk with the `osascript` tool:

```applescript
set f to open for access POSIX file "<project>/public/img/<name>.png" with write permission
set eof f to 0
write (the clipboard as «class PNGf») to f
close access f
do shell script "/sbin/md5 -q <project>/public/img/*.png | sort | uniq -d"
```

The chat list is virtualised, so the "last" image can still be the previous one. Check that the returned `src` suffix changed and that the md5 duplicate check prints nothing. Then `Read` the PNG and confirm it shows the planned scene.

Name files by subject (`server_hall.png`, `head_chef.png`). Record each in the project README credits as ChatGPT image generation.
