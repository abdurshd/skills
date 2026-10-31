# Script and scene plan

A worked example lives in [examples/kubernetes-narration.json](examples/kubernetes-narration.json): 14 scenes, 337 words, 3:05 on screen.

## Arc

Each beat is one scene id (`sNN_slug`); merge or split beats to fit the topic.

1. **hook**: a relatable everyday moment that secretly depends on the topic, ending on the topic's name (≈ 10 s).
2. **lead**: the promise, "Ikki daqiqada … oddiy tilda tushunib olasiz", plus removing the fear ("… bilish shart emas").
3. **foundation**: the one or two prerequisite ideas a beginner lacks (for Kubernetes: code, server, deploy).
4. **problem**: the pain the topic exists to solve, made concrete.
5. **analogy 1, physical or historical**: a world everyone pictures (shipping containers, 1956). Map it back explicitly.
6. **concept**: the topic's core idea told through analogy 1.
7. **scale or stakes**: why it gets hard (millions of users, things break at night), ending on a question.
8. **analogy 2, local and Uzbek**: a scene from daily Uzbek life (plov centre, kazans, head chef). Name each mapping on screen ("Qozon = Server").
9. **what it does**: the behaviours, shown through analogy 2 (self-healing, scaling up and down).
10. **real terms**: the two or three words the viewer will meet next (node, pod, desired state), each tied to something already seen.
11. **fact or name**: origin, creator, year, or etymology. It gives a breather and a memorable hook.
12. **summary**: one sentence that compresses the whole video.
13. **outro**: a share call, "… do'stingizga yuboring".

## Writing rules

- Sentences of at most 12 words, one new idea per sentence. Uzbek Latin in standard spelling (`o'`, `g'`, `sh`, `ch`).
- Spell every number as words ("Ming to'qqiz yuz ellik oltinchi yilda"). TTS, captions and word alignment then all agree.
- Keep English terms only when the viewer must learn them, introduced as "… X deyiladi".
- Budget ≈ 0.52 s per Uzbek word plus ≈ 1 s of pad per scene. 280 words ≈ 2:35 and 340 words ≈ 3:05.
- Every sentence earns a visual change. If a sentence has nothing to show, cut it.

## Scene plan

For each id, list its beats as `word → what appears`, keyed to the exact narration word (that word becomes `at(id, "word")` in code), and tag the asset each beat needs:

- **still**: a ChatGPT photo with a Ken Burns move, for real places and objects.
- **clip**: one of at most 4 Veo shots, for moments where motion sells it (the hook action, the historical world, the cultural hero shot).
- **3D**: Remotion Three, for abstract systems (machines, containers, nodes, a logo-like hero object).
- **motion**: typography, chips, counters, equations, icons, diagrams.

Aim for at least two layers per scene (for example a still plus chips, or 3D plus labels) and a visual change every 3–5 s. Reuse one hero 3D object across the video (the Kubernetes ship's wheel) so the ending pays off the opening.
