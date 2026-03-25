## Quick Reference - Bangla Design Deployment

### Project Type
Monorepo with Next.js frontend + Cloudflare Workers backend

### Frontend Deployment (This Audit)
- **Framework**: Next.js 14.0.4
- **Platform**: Vercel
- **Package Manager**: pnpm
- **Build Command**: `pnpm --filter web build`
- **Dev Command**: `pnpm --filter web dev`
- **Output**: `apps/web/.next`

### Environment Variables Required
```
NEXT_PUBLIC_API_URL=https://your-workers-api.com
```

### Deploy to Vercel
1. Push code: `git push origin main`
2. Connect repo in Vercel dashboard
3. Set env variable: `NEXT_PUBLIC_API_URL`
4. Click Deploy ✅

### Project Structure
```
apps/web/
├── src/app/          # Pages and routes
├── public/           # Static assets
└── next.config.js    # Build config
```

### Critical Files
| File | Purpose |
|------|---------|
| `vercel.json` | Deployment config |
| `apps/web/next.config.js` | Next.js settings |
| `pnpm-workspace.yaml` | Monorepo config |
| `turbo.json` | Build orchestration |

### Documentation Files
- `DEPLOYMENT-GUIDE.md` - Full deployment instructions
- `PRE-DEPLOYMENT-CHECKLIST.md` - Verification steps
- `AUDIT-REPORT-FINAL.md` - Complete audit details

### Common Commands
```bash
# Install dependencies
pnpm install

# Development
pnpm --filter web dev

# Build
pnpm --filter web build

# Run production build
pnpm --filter web start

# Lint
pnpm --filter web lint

# Type check
pnpm --filter web typecheck
```

### Issues Fixed
- ✅ Package manager mismatch (npm → pnpm)
- ✅ Monorepo build paths configured
- ✅ Static export mode removed
- ✅ Orphan root files deleted
- ✅ Code bugs fixed (Monaco editor, SSE parsing)
- ✅ Security headers added

### Status: ✅ READY FOR DEPLOYMENT
