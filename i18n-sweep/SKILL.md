---
name: i18n-sweep
description: Sweep the codebase for internationalization gaps - hardcoded user-facing strings, missing translation keys, and locales that drifted out of sync - then fill every gap with proper translations and verify. Use when the user says parts of the UI are untranslated, shows screenshots of mixed-language UI, asks to add a language, or invokes /i18n-sweep (optionally scoped to a directory or page).
---

# i18n sweep

UI grows faster than translations. Typed catalogs catch *missing keys*, but nothing catches *hardcoded strings that never became keys* — those slip past every typecheck and show up as mixed-language screenshots. This skill hunts both.

## Step 1 — Map the i18n system

Detect how this project translates: typed message catalogs, i18next/react-intl, or a custom dictionary. Find:
- The locale list (e.g. `en`, `uz`, `ru`, `ko`) and the catalog file per locale.
- The lookup mechanism (`t('key')`, typed dict access, component wrappers).
- The reference locale (usually the most complete one — verify, don't assume it's `en`).
- Any documented exceptions in AGENTS.md / CLAUDE.md — some content is intentionally untranslated (e.g. practice text in a typing app, code snippets, brand names). Respect those.

## Step 2 — Find the gaps (two different hunts)

**Hunt A — catalog drift.** Diff every locale's keys against the union of all keys. Report missing keys per locale. If catalogs are typed, `tsc` output helps but is not sufficient — check for keys whose value is an empty string, a TODO, or a copy of another language.

**Hunt B — hardcoded strings.** Scan the scoped source (JSX text nodes, `Text` components, `placeholder`/`title`/`aria-label`/`alt` attributes, toast/error messages, empty states, dialog buttons) for user-facing string literals that bypass the i18n system. Heuristics: literal strings containing spaces or unicode letters in render code; template literals building sentences. Exclude: log lines, test files, config, CSS values. List every hit with `file:line`.

Report counts before fixing: "N missing keys across M locales, K hardcoded strings" — and if the sweep was scoped, say what was NOT scanned.

## Step 3 — Fix

- Convert each hardcoded string into a key + catalog entries for **every** locale, following the project's existing key-naming convention.
- Fill missing translations with native-quality text, matching the tone of that locale's existing entries (formal vs casual register matters — mirror what's there).
- Keep interpolation variables/placeholders identical across locales; never translate variable names.
- Preserve pluralization structures if the framework supports them.
- Don't invent locale-specific formatting: reuse the project's existing date/number formatting helpers.

## Step 4 — Verify

1. Typecheck + build.
2. Re-run Hunt A: zero key drift.
3. Re-run Hunt B on the touched files: zero remaining user-facing literals (minus documented exceptions).
4. If a dev server/preview is available: render the worst-affected pages in each locale and confirm no fallback language bleeds through, and no layout breakage from longer strings (German/Russian/Uzbek text is often 30-40% longer than English).

## Report

Per-locale coverage table (keys present / total), list of files touched, strings converted, translations added, documented exceptions skipped, and anything that needs a human native-speaker review. Don't commit/push unless asked (see the `ship` skill).
