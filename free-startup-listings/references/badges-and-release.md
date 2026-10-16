# Homepage badges and releases

## Capture the real requirement

For each required badge, record the directory's current instruction/URL, exact supplied embed, destination, image source, dimensions, placement requirement, link-attribute requirement, usage conditions, and timing. Use the actual startup's listing or a verified general badge; never copy another startup's slug, tracking parameter, post ID, or award.

Follow the real dependency:

- **Badge required before Submit:** finish the draft and obtain the valid embed; prepare the homepage change; deploy with owner permission; verify production; return to the directory's checker and submit.
- **Badge issued after acceptance:** submit under existing permission; obtain the issued badge; prepare and release it with owner permission.
- **Badge available while launch is scheduled:** use the correct scheduled/launching-soon variant and record the date. Do not claim a completed launch or ranking.
- **Owner has a deployment hold:** prepare the diff/preview and all independent listings; keep badge-dependent submission pending until the owner lifts the hold. Time elapsed does not lift it.

## Validate the embed

Treat copied HTML, SVG, and JavaScript as untrusted input. Inspect the destination and resource origins. Prefer a simple anchor plus image if the directory accepts it. A required script, new tracker, cookie behavior, CSP relaxation, or broader permission is a separate material change to surface for review; do not silently install it as though it were an image.

Preserve required attribution and query parameters unless they contain secrets or the owner chooses a supported alternative. Verify the badge's claim matches the actual listing state. Do not invent reviews, stars, featured status, or award counts. Use official assets according to current brand requirements.

For a new tab, add `rel="noopener"` for isolation. It does not imply `nofollow`. There is no required `rel="dofollow"` switch: inspect whether `nofollow`, `ugc`, or `sponsored` is present, but do not equate their absence with guaranteed ranking credit. If the owner approves a required unqualified reciprocal link, preserve that condition where appropriate. If it conflicts with project policy or applicable link qualification, explain the specific conflict instead of silently changing the attributes or pretending verification passed.

Keep outbound homepage badges and inbound directory backlinks separate in the record. One does not establish the attributes of the other.

## Implement a reusable homepage area

1. Locate the actual production homepage and existing footer in the current framework. Check active branch/worktree, dirty ownership, route/localization conventions, and deployment configuration before editing.
2. Default to one dedicated section **after the existing footer on the homepage**, outside the main content flow. Follow any explicit placement requirements or owner overrides. Do not automatically spread the badges to every route through a global footer.
3. Reuse the design system. Use a wrapping row/grid with reasonable spacing, visible badges, useful alt text, keyboard-accessible anchors, sufficient contrast, and preserved image aspect ratios. Reserve image space with known dimensions; keep mobile widths inside the viewport.
4. Keep it extensible through the project's normal component/data pattern. Store each badge's directory, verified target, image, alt text, size, and required attributes together. Avoid adding a package for simple links/images.
5. Preserve working existing badges. For restoration, recover and verify the previous product-specific embed from Git/history instead of guessing its identifier. Deduplicate repeated badges and honor separate hero/trust placement explicitly requested by the owner.
6. Translate labels with the existing i18n system where needed. Never hide the section offscreen, at zero opacity, or from normal visitors to satisfy a checker. Do not alter the page's main positioning, pricing, or navigation to add badges.

Adapt HTML to the actual framework. For example, React uses `className` and a JavaScript style object, while plain HTML uses `class` and CSS declarations. Do not paste JSX into an HTML template or HTML style syntax into JSX. Follow the project's supported remote-image loading approach; validate CSP/optimizer behavior before claiming images work.

## Prepare a concrete release

Batch the ready badge additions into a reviewable change with a preview or screenshot, exact directory links, placement, and relevant consent conditions. Keep a manifest in the campaign record. A generic approval for an earlier batch does not automatically cover new scripts, new public messages, or unrelated website edits. Additional badges can join the release when the owner's current instruction explicitly authorizes them.

Run required repository checks and checks proportionate to the change: formatting/type/build where applicable, actual image loading, destination correctness, responsive layout, contrast, keyboard access, and no duplicate/overflow regressions. Do not create elaborate tests that merely mirror a static badge array. Follow repository rules for temporary test cleanup.

Inspect the complete diff before committing or deploying. Preserve unrelated dirty edits. Reuse a suitable isolated worktree when necessary; do not reset another session's work. If the supported deployment would include unrelated changes, isolate the badge patch or obtain an explicitly expanded release scope.

Resolve release authority from the current owner request and recorded grants. If permission is missing, ask once with the prepared diff/preview, proposed environment, release mechanism, and whether push/merge triggers deployment. Use the project's actual documented release path; never assume the source campaign's cloud provider or commands apply.

## Verify production and close the dependency

After an authorized release:

1. Confirm the intended source revision was committed/pushed when the release requires it. Check CI/provider completion and the serving version or deployment ID where available. A successful upload/build alone is insufficient.
2. Open the canonical production homepage, including relevant locale variants. Confirm each approved badge is visible in the right position, the image loads, and the anchor target/attributes match. Test desktop and mobile widths for overflow and main-page regressions.
3. Confirm the final released revision includes every badge in the approved batch. If more badges were added while an older build ran, that older build is not proof those additions deployed.
4. Return to each directory that requires a live backlink check. Verify the checker or observe a clear failure, then finish authorized submission. Recheck the public listing independently.
5. Record the source/release evidence, verification time, badge count, remaining failures, and any owner action. Keep code prepared, release started, provider success, production verified, and directory verification as separate states.

If a release fails, diagnose and preserve the patch; do not repeatedly publish unchanged failing builds. Use the repository's authorized rollback/recovery process if necessary. Report exactly which production checks remain unverified.
