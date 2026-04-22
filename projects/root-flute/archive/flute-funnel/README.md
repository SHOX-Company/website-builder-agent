# Phase Two: Flute Sales Funnel

## Status
Archived — not live. All components, copy, pricing, and media preserved here for the dedicated funnel build.

---

## Future Funnel Objective

High-conversion flute sales landing page optimized for:

- **Premium positioning** — rare, handcrafted, one-of-one instruments
- **Rare instrument authority** — Dan's 20+ years, 100+ flutes built, 430k+ followers
- **Frictionless checkout / inquiry flow** — commission application → consultation → deposit
- **High-ticket conversion psychology** — scarcity, exclusivity, collector identity
- **Scarcity drops** — limited instruments released as drops, not a permanent shop
- **Waitlist / collector capture** — email/SMS capture before drop goes live
- **Mobile-first buying flow** — sticky CTA, thumb-friendly layout, fast load

---

## What's Archived Here

| Folder | Contents |
|--------|----------|
| `components/` | `Authority-craftsman.tsx` — "The Craftsman" section: gold-frame portrait, craftsman bio, flute-builder credentials, stats row |
| `components/` | `Flutes.tsx` — rare instruments drop showcase with gallery lightbox + audio toggle |
| `components/` | `Commission.tsx` — custom commission section with process flow, video, and application form |
| `copy/` | `flute-copy.md` — all headlines, body copy, CTAs, and UX copy for both sections |
| `pricing/` | `budget-tiers.md` — commission tiers ($3k–$20k+), current drop pricing ($15k–$22k), scarcity signals |
| `media/` | `media-assets.md` — full inventory of images, videos, Vercel Blob URLs, and usage notes |
| `notes/` | `cta-concepts.md` — CTA ideas, checkout flow concepts, backend integration notes |

---

## Components Ready to Reuse

Both components are fully built in React/Next.js with Tailwind CSS and the existing brand token system.

**Authority-craftsman.tsx** — "The Craftsman" section featuring:
- Two-column layout: gold-frame portrait (left) + editorial copy (right)
- Gold frame: complex inline gradient border + inner inset shadow treatment
- Portrait: `/images/daniel-portrait.jpg`, object-position `50% 48%`
- Eyebrow: "The Craftsman"
- Headline: "Daniel doesn't manufacture flutes. He listens for them."
- Subhead: "Each instrument begins long before the first cut — in the material itself."
- Body: Woolly mammoth tusk + elk antler craftsmanship — hand-shaping, one-of-one positioning
- Stats row (3): `430k+ Followers`, `20+ Years of the Craft`, `100+ Flutes Built`
- Brand tokens: `bg-brand-surface-2`, gold frame via inline `background: linear-gradient(...)`, `boxShadow`

**Flutes.tsx** — Drop showcase featuring:
- Two-column layout: video panel (audio toggle) + product specs panel
- Current drop: The Obsidian Condor ($15k–$22k)
- 8-image mammoth tusk gallery with keyboard-navigable lightbox
- Scarcity messaging + "Circle Members First" positioning

**Commission.tsx** — Application flow featuring:
- Featured video with audio toggle ("Listen to Daniel")
- 5-step process flow (Apply → Align → Select → Build → Delivery)
- Price anchor ($3k–$20k+)
- Validated application form (name, email, Instagram, budget, intended use, notes)
- Success state + closing scarcity line

---

## Key Build Notes for Phase Two

1. **Backend form submission** — Commission form currently client-side only. Wire to API route or Formspree/Resend before launch.
2. **Video assets** — Hosted on Vercel Blob. URLs documented in `media/media-assets.md`.
3. **Brand tokens** — Components use Tailwind brand tokens (`brand-gold`, `brand-surface`, etc.) defined in the existing Tailwind config. No extra setup needed.
4. **Section IDs** — Commission section has `id="commission"` for anchor linking from Flutes CTA.
5. **Gallery images** — commission-1.jpg through commission-8.jpg (8 images used in lightbox).
6. **Flute illustration** — `flute-obsidian-condor.svg` used as video fallback in Flutes section.

---

## Suggested Funnel Page Structure (Phase Two)

```
/flutes  (dedicated route)
  ├── HeroFlute         — cinematic opener, instrument-focused
  ├── InstrumentDrop    — current drop (Flutes.tsx)
  ├── MaterialStory     — woolly mammoth tusk origin story
  ├── CraftsmanAuthority — Dan's credentials (reuse from community page)
  ├── FluteBuyerTestimonials — collector/ceremony testimonials
  ├── CommissionSection — application form (Commission.tsx)
  └── Footer
```
