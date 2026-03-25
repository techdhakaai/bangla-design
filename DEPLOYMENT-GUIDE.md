## Repository Audit Complete - Ready for Vercel Deployment

### Audit Date: 2026-03-25
**Status: READY FOR DEPLOYMENT**

---

## Summary of Changes Made

### 1. Configuration Files Updated
- **vercel.json** - Updated to use `pnpm` package manager with correct monorepo build commands
  - Changed `buildCommand` to `pnpm --filter web build`
  - Changed `devCommand` to `pnpm --filter web dev`
  - Set correct `outputDirectory` to `apps/web/.next`
  - Added security headers (X-Content-Type-Options, X-Frame-Options, etc.)
  - Added cache control headers for fonts and images

- **turbo.json** - Updated from `pipeline` to `tasks` for newer Turborepo version

- **apps/web/next.config.js** - Removed static export mode
  - Removed `output: 'export'`
  - Removed `unoptimized` image setting
  - Added proper image optimization with remote pattern support
  - Enabled TypeScript and ESLint build error handling

- **apps/web/package.json** - Cleaned up scripts
  - Removed Wrangler deployment script (not needed for Vercel)
  - Kept standard Next.js scripts (dev, build, start, lint, typecheck)

### 2. Orphan Files Removed
These files were conflicting with the monorepo structure and have been deleted:
- `middleware.ts` - Root-level middleware with broken imports
- `app/api/ai/generate/route.ts` - Orphan API route
- `app/api/auth/register/route.ts` - Orphan auth route
- `next.config.js` - Root-level config (use apps/web/next.config.js instead)
- `tailwind.config.ts` - Root-level config (use apps/web/tailwind.config.ts instead)
- `postcss.config.js` - Root-level config (use apps/web/postcss.config.js instead)
- `tsconfig.json` - Root-level config (use apps/web/tsconfig.json instead)
- `deploy.sh` - Custom deploy script
- `ai-builder-github-ready.tar.gz` - Archive file

### 3. Code Quality Improvements

#### apps/web/src/app/(builder)/[projectId]/page.tsx
- Added `getEditorLanguage()` helper function for Monaco editor
- Fixed SSE stream parsing to handle both SSE format (`data: {...}`) and raw JSON
- Improved stream message buffer handling for incomplete lines

### 4. New Files Created
- `.env.example` - Documents required environment variables for deployment
- `.gitignore` - Comprehensive ignore patterns for monorepo

---

## Deployment Instructions

### Prerequisites
- GitHub repository connected to Vercel
- Vercel account with appropriate project

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "refactor: prepare repository for Vercel deployment

- Update vercel.json to use pnpm with correct monorepo paths
- Remove static export mode from web app
- Delete orphan root-level files conflicting with monorepo
- Fix SSE stream parsing in builder
- Add deployment documentation"
git push origin main
```

### Step 2: Configure Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select or create a project for this repository
3. In Project Settings → General:
   - Framework Preset: Next.js
   - Root Directory: Leave blank (Vercel will auto-detect)
   - Build Command: Override with `pnpm --filter web build`
   - Output Directory: Override with `apps/web/.next`
   - Install Command: Override with `pnpm install`

### Step 3: Set Environment Variables
In Vercel Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://your-api.workers.dev
```

Replace `https://your-api.workers.dev` with your actual Cloudflare Workers API endpoint.

### Step 4: Deploy
1. Click "Deploy" to trigger a build from the latest commit
2. Wait for the build to complete (should take 2-5 minutes)
3. Access your deployed app at the Vercel URL

---

## Architecture Overview

### Monorepo Structure
```
bangla-design/
├── apps/
│   ├── web/                    # Next.js Frontend (Vercel deployment)
│   │   ├── src/
│   │   │   └── app/           # App Router pages
│   │   ├── public/            # Static assets
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api-worker/            # Cloudflare Workers Backend (separate deployment)
│       ├── src/
│       ├── wrangler.toml
│       └── package.json
│
├── packages/                   # Shared packages (if any)
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # pnpm monorepo configuration
├── vercel.json                # Vercel deployment configuration
└── package.json               # Root package.json
```

### Deployment Split
- **apps/web** → Deployed to Vercel (Node.js runtime, dynamic rendering capable)
- **apps/api-worker** → Deployed to Cloudflare Workers (separate deployment process)

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Cloudflare Workers API endpoint | `https://api.bangla.design` |

Note: `NEXT_PUBLIC_` prefix makes the variable available in browser code. Only use for non-sensitive data.

---

## Build & Deployment Verification Checklist

- [x] vercel.json configured for pnpm
- [x] Build command targets apps/web
- [x] Output directory correctly set
- [x] All orphan root files removed
- [x] next.config.js has proper image optimization
- [x] Environment variables documented
- [x] No conflicting root-level configs
- [x] Security headers configured
- [x] Cache headers optimized for fonts/images
- [x] SSE stream parsing fixed

---

## Potential Issues & Solutions

### Issue: Build fails with "module not found"
**Solution**: Ensure all imports in apps/web reference the correct paths. Check tsconfig.json path mappings.

### Issue: API calls fail with CORS error
**Solution**: 
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel environment variables
2. Ensure Cloudflare Workers has CORS headers configured
3. Check that API endpoints are publicly accessible

### Issue: Images not loading
**Solution**: 
1. Verify remote patterns in apps/web/next.config.js include your image domains
2. Check that image URLs are absolute and accessible

---

## Next Steps

1. **Deploy the API Worker**
   - Keep apps/api-worker deployment separate (Cloudflare Workers)
   - Follow Cloudflare deployment guide for wrangler

2. **Monitor Deployment**
   - Check Vercel analytics dashboard
   - Set up error monitoring (Sentry, etc.)
   - Monitor API endpoint health

3. **Performance Optimization**
   - Enable Vercel Analytics for performance insights
   - Configure ISR (Incremental Static Regeneration) if needed
   - Set up caching strategies for frequently accessed pages

---

## Support & Troubleshooting

For issues during deployment:
1. Check Vercel build logs: Project → Deployments → View Build Logs
2. Verify environment variables are set correctly
3. Test locally: `pnpm install && pnpm --filter web dev`
4. Check GitHub repository for any uncommitted changes

---

Generated as part of repository audit: bangla-design/main branch
