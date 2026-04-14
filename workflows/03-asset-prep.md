# Workflow 03 — Asset Prep

## Objective
Optimize all raw assets before they are used in the site or deployed.

## Inputs
- Raw images, videos, or frame sequences placed in `.tmp/`
- `TARGET_PROJECT` — project folder under `projects/`

## Tools
- `tools/optimize-assets.sh` — compression and resize wrapper

## Execution Steps

1. **Audit raw assets**
   - List everything in `.tmp/`
   - Identify type: image (jpg/png/webp), video (mp4/mov), or frame sequence (dir of PNGs)
   - Flag any file over 500KB for compression

2. **Optimize images**
   ```bash
   bash tools/optimize-assets.sh \
     --input ".tmp/images" \
     --output "projects/{{TARGET_PROJECT}}/public/images" \
     --type image
   ```
   Target: < 200KB per image, WebP format preferred.

3. **Optimize frame sequences**
   ```bash
   bash tools/optimize-assets.sh \
     --input ".tmp/frames/{{SECTION_NAME}}" \
     --output "projects/{{TARGET_PROJECT}}/public/frames/{{SECTION_NAME}}" \
     --type frames
   ```
   Target: < 50KB per frame at 1920px max width.

4. **Validate output**
   - Confirm all files landed in `projects/{{TARGET_PROJECT}}/public/`
   - Confirm no file exceeds size targets
   - Delete `.tmp/` contents after successful output

5. **Update asset references**
   - Confirm all image `src` paths in code point to `/public/` locations
   - Use Next.js `<Image>` component for all images (auto-optimization at runtime)

## Outputs
- Optimized assets in `projects/{{TARGET_PROJECT}}/public/`
- `.tmp/` cleared

## QA Checks
- [ ] No image > 200KB
- [ ] No frame > 50KB
- [ ] All assets reachable at their expected paths
- [ ] Next.js `<Image>` used for all static images

## Notes
- Never commit `.tmp/` contents
- Prefer WebP over PNG/JPG for web delivery
- Video files should not be served directly — extract frames instead
