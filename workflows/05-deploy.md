# Workflow 05 — Deploy

## Objective
Push verified local build to GitHub and deploy to Vercel.

## Inputs
- `TARGET_PROJECT` — project folder under `projects/`
- `GITHUB_REPO_NAME` — name for the GitHub repo (e.g. `acme-plumbing-site`)
- Confirmed QA pass from Workflow 04

## Prerequisites
- [ ] Workflow 04 (QA) passed — all checks green
- [ ] `gh` CLI installed: `brew install gh`
- [ ] `vercel` CLI installed: `npm i -g vercel`
- [ ] Authenticated: `gh auth login` + `vercel login`

## Tools
- `gh` CLI — create and push GitHub repo
- `vercel` CLI — deploy to Vercel

## Execution Steps

### First-Time Setup (run once per project)

1. **Initialize git repo**
   ```bash
   cd projects/{{TARGET_PROJECT}}
   git init
   echo ".env" >> .gitignore
   echo ".tmp/" >> .gitignore
   git add .
   git commit -m "init: project scaffold"
   ```

2. **Create GitHub repo and push**
   ```bash
   gh repo create {{GITHUB_REPO_NAME}} --public --source=. --remote=origin --push
   ```

3. **Connect to Vercel**
   ```bash
   vercel
   ```
   - Follow prompts: link to your Vercel account, set project name, confirm framework (Next.js auto-detected)
   - This creates `.vercel/` config — commit it:
   ```bash
   git add .vercel
   git commit -m "config: add vercel project settings"
   git push
   ```

### Subsequent Deploys

4. **Push changes**
   ```bash
   git add .
   git commit -m "{{describe change}}"
   git push
   ```
   Vercel auto-deploys on push to `main`.

5. **Deploy to production explicitly (if needed)**
   ```bash
   vercel --prod
   ```

### Post-Deploy Verification

6. **Verify production URL**
   - Open the Vercel-provided URL
   - Re-run QA checklist (Workflow 04) on production URL
   - Check: all assets load, no path errors, animations work

7. **Fix production issues**
   - Common issues:
     - Missing assets: check `public/` paths vs. `src` attributes
     - Frame 404s: ensure `public/frames/` was committed
     - Env vars: set in Vercel dashboard, never in code
   - Fix locally → push → verify

## Outputs
- Live production URL (Vercel subdomain or custom domain)
- GitHub repo with full version history

## QA Gate
**Do NOT mark deploy complete until production URL passes full QA.**

## Notes
- Never deploy a build that failed local QA
- `.env` files are NEVER committed — set secrets in Vercel dashboard
- Keep commits small and descriptive
