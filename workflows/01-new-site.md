# Workflow 01 — New Site

## Objective
Initialize a new Next.js website project with a conversion-focused scaffold.

## Inputs
- `PROJECT_NAME` — slug-style name (e.g. `acme-plumbing`)
- `SITE_TYPE` — one of: `service`, `landing`, `demo`, `brand`
- `TARGET_AUDIENCE` — one sentence describing the buyer

## Tools
- None (scaffold only)

## Execution Steps

1. **Create project folder**
   ```
   projects/{{PROJECT_NAME}}/
   ```

2. **Initialize Next.js with Tailwind + App Router**
   ```bash
   cd projects/
   npx create-next-app@latest {{PROJECT_NAME}} \
     --typescript \
     --tailwind \
     --app \
     --src-dir \
     --import-alias "@/*"
   ```

3. **Scaffold conversion sections**
   Create `src/app/page.tsx` with the following section stubs in order:
   1. Hero
   2. Proof (logos / stats)
   3. Problem
   4. Solution
   5. Benefits
   6. Process
   7. Testimonials
   8. FAQ
   9. CTA
   10. Footer

   Each section = a `<section id="...">` with a placeholder `<h2>` and comment marking its purpose.

4. **Start local dev server**
   ```bash
   cd projects/{{PROJECT_NAME}}
   npm run dev
   ```

5. **Verify**
   - Open `http://localhost:3000`
   - All 10 sections render
   - No console errors

## Outputs
- Running `localhost:3000` with blank conversion scaffold
- Project folder at `projects/{{PROJECT_NAME}}/`

## QA Checks
- [ ] Site loads
- [ ] 10 sections present in DOM
- [ ] No TypeScript errors
- [ ] Tailwind styles applied

## Notes
- Do NOT add animations at this stage — layout first
- Copy is placeholder only — real copy comes in Iteration Mode
- Mobile layout must work from the start (Tailwind responsive classes)
