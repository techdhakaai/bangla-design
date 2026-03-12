# 🚀 AI Builder Platform
> Build full websites from a single prompt. Powered by GPT-4o, deployed on Cloudflare's edge network.

[![Deploy](https://github.com/your-org/ai-builder/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-org/ai-builder/actions)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Cloudflare](https://img.shields.io/badge/Deployed-Cloudflare-orange)

---

## 📸 What It Does

Type a prompt → Get a full React + TypeScript + Tailwind website with live preview in ~30 seconds.

```
"Create a landing page for a coffee shop in Dhaka with hero, menu, and contact form"
```
↓ ~25 seconds later ↓
```
✅ Full React app with 4 components
✅ Responsive Tailwind CSS design
✅ Live preview in Sandpack iframe
✅ Monaco code editor (edit inline)
✅ Review score: 92/100
```

---

## 🏗️ Stack

| Layer | Tech | Host |
|-------|------|------|
| Frontend | Next.js 14, Monaco, Sandpack, shadcn/ui | Cloudflare Pages |
| Backend | Hono.js, Cloudflare Workers | Cloudflare Workers |
| AI Sessions | Durable Objects | Cloudflare |
| Database | D1 (SQLite) | Cloudflare |
| File Storage | R2 | Cloudflare |
| Cache/Rate Limit | KV | Cloudflare |
| AI | OpenAI GPT-4o | OpenAI API |

**Est. cost: ~$12–20/month** (personal use)

---

## 📁 Project Structure

```
ai-builder-platform/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: lint → deploy worker → deploy pages
├── apps/
│   ├── api-worker/             # Cloudflare Worker (Hono.js)
│   │   ├── src/
│   │   │   ├── index.ts        # Router + rate limiter + env validation
│   │   │   └── agents/
│   │   │       └── orchestrator.ts  # Planning → CodeGen → Review pipeline
│   │   ├── migrations/
│   │   │   └── 001_initial.sql
│   │   └── wrangler.toml
│   └── web/                    # Next.js frontend (Cloudflare Pages)
│       └── src/
│           ├── app/
│           │   ├── page.tsx              # Landing page
│           │   ├── (builder)/
│           │   │   ├── new/page.tsx      # Create project
│           │   │   └── [projectId]/page.tsx  # Builder UI
│           └── components/ui/            # shadcn/ui components
├── turbo.json
└── pnpm-workspace.yaml
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- Cloudflare account (free)
- OpenAI API key

### 1. Clone & Install
```bash
git clone https://github.com/your-org/ai-builder
cd ai-builder
pnpm install
```

### 2. Create Cloudflare Resources
```bash
# Login
npx wrangler login

# Create D1 database (paste the database_id into wrangler.toml)
npx wrangler d1 create ai-builder-db

# Create KV namespace (paste the id into wrangler.toml)
npx wrangler kv:namespace create KV_CACHE

# Create R2 bucket
npx wrangler r2 bucket create ai-builder-files

# Apply DB migrations
npx wrangler d1 execute ai-builder-db --file=apps/api-worker/migrations/001_initial.sql
```

### 3. Set Secrets
```bash
cd apps/api-worker

# Your OpenAI API key
npx wrangler secret put OPENAI_API_KEY

# Comma-separated allowed origins (your Pages URL)
npx wrangler secret put ALLOWED_ORIGINS
# Enter: http://localhost:3000,https://ai-builder-web.pages.dev
```

### 4. Update wrangler.toml
```toml
# Replace placeholders with IDs from step 2
[[d1_databases]]
database_id = "PASTE_YOUR_D1_ID_HERE"

[[kv_namespaces]]
id = "PASTE_YOUR_KV_ID_HERE"
```

### 5. Run Locally
```bash
# Terminal 1: Start Worker
cd apps/api-worker
npx wrangler dev

# Terminal 2: Start Next.js
cd apps/web
NEXT_PUBLIC_API_URL=http://localhost:8787 pnpm dev
```

Open http://localhost:3000

### 6. Deploy to Production
```bash
# Deploy Worker
cd apps/api-worker
npx wrangler deploy --env production

# Build & Deploy Frontend to Pages
cd apps/web
NEXT_PUBLIC_API_URL=https://ai-builder-api.YOUR_SUBDOMAIN.workers.dev pnpm build
npx wrangler pages deploy .next/standalone --project-name=ai-builder-web
```

---

## 🔐 GitHub Actions Setup

Add these secrets to your GitHub repo (Settings → Secrets):

| Secret | Where to find |
|--------|--------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → API Tokens → Create Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar |
| `NEXT_PUBLIC_API_URL` | Your deployed Worker URL |

Push to `main` → auto-deploys both Worker and Pages. ✅

---

## 🤖 AI Agent Pipeline

```
User Prompt
    │
    ▼
┌─────────────┐
│  Planning   │  GPT-4o → JSON architecture plan
│  Agent      │  (components, layout, dependencies)
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Code Gen   │  GPT-4o → Full React/TS files
│  Agent      │  (App.tsx + components + styles)
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Review     │  GPT-4o → Quality score + auto-fixes
│  Agent      │  (type safety, a11y, performance)
└─────┬───────┘
      │
      ▼
  Save to D1 + R2 → Stream to client
```

All steps stream status updates to the frontend via SSE (Server-Sent Events).

---

## 💰 Monthly Cost (Personal Use)

| Service | Usage | Cost |
|---------|-------|------|
| Workers | 10M requests | $5 |
| D1 | 5M reads/day | Free |
| R2 | 10GB storage | $1.50 |
| KV | 1M reads | Free |
| Pages | Unlimited | Free |
| Durable Objects | 1M requests | $5 |
| OpenAI API | ~100 generations | $5–15 |
| **Total** | | **~$17–27/month** |

---

## 🗺️ Roadmap

- [x] Planning + CodeGen + Review agents
- [x] Monaco Editor integration
- [x] Sandpack live preview
- [x] Streaming SSE responses
- [x] Rate limiting
- [ ] Auth (Clerk integration)
- [ ] Version history / undo
- [ ] Deploy-to-Pages button
- [ ] Template gallery
- [ ] Multi-model support (Claude / Gemini fallback)
- [ ] Custom domain support

---

## 📄 License

MIT — Built by [StartBD](https://startbd.com)
