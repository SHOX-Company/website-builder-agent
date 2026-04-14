# Workflow 02 — Video to Website

## Objective
Convert a source video into a scroll-mapped, frame-animated website section.

## Inputs
- `VIDEO_PATH` — absolute path to source video file
- `SECTION_NAME` — name of the target section (e.g. `product-reveal`)
- `FPS` — frames per second to extract (default: `24`)
- `TARGET_PROJECT` — project folder under `projects/`

## Tools
- `tools/extract-frames.sh` — extracts frames from video via ffmpeg
- `tools/optimize-assets.sh` — compresses frames before use

## Execution Steps

1. **Validate inputs**
   - Confirm video file exists at `VIDEO_PATH`
   - Confirm `TARGET_PROJECT` exists under `projects/`

2. **Extract frames**
   ```bash
   bash tools/extract-frames.sh \
     --input "{{VIDEO_PATH}}" \
     --output ".tmp/frames/{{SECTION_NAME}}" \
     --fps {{FPS}}
   ```
   Output: numbered PNGs in `.tmp/frames/{{SECTION_NAME}}/`

3. **Optimize frames**
   ```bash
   bash tools/optimize-assets.sh \
     --input ".tmp/frames/{{SECTION_NAME}}" \
     --output "projects/{{TARGET_PROJECT}}/public/frames/{{SECTION_NAME}}"
   ```

4. **Build scroll-mapped section component**
   Create `src/components/{{SECTION_NAME}}/ScrollCanvas.tsx`:
   - Use a `<canvas>` element
   - On scroll, calculate progress (0–1) via `IntersectionObserver` + `scrollY`
   - Load frames sequentially based on scroll progress
   - Frame count = total frames in `public/frames/{{SECTION_NAME}}/`

5. **Sync copy to scroll milestones**
   Define copy blocks at scroll positions: 0%, 25%, 50%, 75%, 100%
   Overlay copy using absolute-positioned `<div>` elements with CSS transitions.

6. **Integrate into page**
   Import `ScrollCanvas` into the relevant section in `src/app/page.tsx`.

7. **Test locally**
   - Run `npm run dev`
   - Scroll through the section
   - Verify frame sequence plays smoothly
   - Verify copy appears at correct milestones

## Outputs
- `src/components/{{SECTION_NAME}}/ScrollCanvas.tsx`
- Optimized frames at `public/frames/{{SECTION_NAME}}/`
- Section integrated into page

## QA Checks
- [ ] Frames load without 404s
- [ ] Animation plays on scroll (no jank)
- [ ] Copy overlays appear at correct scroll positions
- [ ] Works on mobile (touch scroll)
- [ ] No console errors

## Notes
- Animation is a COMPONENT, not the site — do not let it break layout
- If frame count > 200, reduce FPS or trim source video
- Motion must serve storytelling — if it obscures copy, remove it
