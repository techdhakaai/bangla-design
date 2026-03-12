# 🔍 AI Builder Platform — Full Audit Report
**Auditor:** Claude Sonnet | **Date:** March 2026  
**Verdict:** ⚠️ 6 Critical Bugs · 4 Missing Features · Deploy-Ready After Fixes

---

## 🚨 CRITICAL BUGS (Fix Before Deploying)

### BUG 1 — Deprecated AI Model (`orchestrator.ts`)
```typescript
// ❌ WRONG — gpt-4-turbo-preview is deprecated
model: "gpt-4-turbo-preview"

// ✅ FIX
model: "gpt-4o"
```

### BUG 2 — Hardcoded CORS Origin (`index.ts`)
```typescript
// ❌ WRONG — exposes internal URLs
origin: ["http://localhost:3000", "https://your-frontend.pages.dev"]

// ✅ FIX — use env variable
origin: c.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"]
```
Add `ALLOWED_ORIGINS` to wrangler.toml vars and `Env` interface.

### BUG 3 — SSE Format Broken (frontend won't parse correctly)
```typescript
// ❌ WRONG — raw NDJSON, not proper SSE
controller.enqueue(encoder.encode(JSON.stringify({...}) + "\n"))

// ✅ FIX — proper SSE format
controller.enqueue(encoder.encode(`data: ${JSON.stringify({...})}\n\n`))
```
And in the frontend reader, parse lines starting with `data:`:
```typescript
const line = chunk.trim();
if (line.startsWith("data: ")) {
  const data = JSON.parse(line.slice(6));
}
```

### BUG 4 — Monaco Language Hardcoded to `typescript`
```typescript
// ❌ Wrong for CSS, HTML files
<Editor language="typescript" ... />

// ✅ FIX
const getLanguage = (path: string) => {
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".json")) return "json";
  return "typescript";
};
<Editor language={getLanguage(activeFile)} ... />
```

### BUG 5 — wrangler.toml Has Placeholder IDs
```toml
# ❌ Never deploy with these
database_id = "YOUR_DATABASE_ID"
id = "YOUR_KV_ID"
```
Run: `npx wrangler d1 create ai-builder-db` and `npx wrangler kv:namespace create KV_CACHE` and paste real IDs.

### BUG 6 — No Environment Validation on Startup
If `OPENAI_API_KEY` is missing, the worker crashes silently mid-request.
```typescript
// ✅ Add to index.ts top-level
app.use("*", async (c, next) => {
  if (!c.env.OPENAI_API_KEY) {
    return c.json({ error: "Server misconfigured: missing OPENAI_API_KEY" }, 500);
  }
  await next();
});
```

---

## ⚠️ MEDIUM ISSUES

| Issue | Location | Fix |
|-------|----------|-----|
| No auth middleware | `index.ts` | Add Clerk JWT validation |
| No rate limiting | `index.ts` | Add KV-based rate limiter |
| Review + Fix Agents not built | `orchestrator.ts` | Implement (see `agents/reviewer.ts`) |
| R2 storage not used | `orchestrator.ts` | `saveProject` only uses D1, not R2 |
| No error boundary | `[projectId]/page.tsx` | Wrap in React ErrorBoundary |
| `NEXT_PUBLIC_API_URL` missing from `.env.local.example` | web app | Add it |

---

## ✅ WHAT'S WORKING WELL

- **Architecture**: Monorepo (Turborepo + pnpm) — solid foundation
- **Durable Objects**: Correct usage for AI session management
- **Streaming**: ReadableStream pattern is correct, just needs SSE format fix
- **Frontend**: Monaco + Sandpack integration is excellent — this is the hard part, and it's done
- **DB Schema**: `projects` + `ai_generations` tables are clean
- **PLANNING → CODEGEN pipeline**: Works correctly in `orchestrator.ts`
- **UI Components**: shadcn/ui setup is complete and well-structured

---

## 🚀 DEPLOYMENT DECISION

### The Backend CANNOT Go to Vercel
Your `apps/api-worker` uses **Cloudflare-proprietary APIs**:
- `DurableObject` (class-based persistent sessions)
- `D1Database` (Cloudflare SQLite)
- `R2Bucket` (Cloudflare object storage)
- `KVNamespace` (Cloudflare edge KV)

None of these exist on Vercel, AWS Lambda, or any other platform.

### Recommendation: **Full Cloudflare Stack**

```
apps/api-worker  → Cloudflare Workers     (~$5-10/month)
apps/web         → Cloudflare Pages       (Free tier)
Database         → D1                     (Free tier: 5M rows/day)
Files            → R2                     (~$1.50/month for 10GB)
Sessions         → Durable Objects        (~$5/month)
─────────────────────────────────────────────────────
TOTAL ESTIMATED:                          ~$12-20/month
```

### Why NOT Vercel for the Frontend?

| Factor | Cloudflare Pages | Vercel |
|--------|-----------------|--------|
| Cost | Free (unlimited) | Free (limited), $20/mo Pro |
| Next.js support | Good (edge runtime) | Perfect (native) |
| Same ecosystem | ✅ Unified CF dashboard | ❌ Split stack |
| Edge functions | ✅ Included | Paid add-on |
| ISR / PPR | ❌ Limited | ✅ Full support |
| Deploy from GitHub | ✅ | ✅ |

**Verdict**: Unless you need advanced Next.js features like ISR/PPR, **Cloudflare Pages is the better choice** — lower cost, unified dashboard, and the frontend here is mostly client-side React anyway (Monaco + Sandpack run in the browser).

---

## 📁 FIXED PROJECT STRUCTURE (GitHub Ready)

See the complete fixed files in this repo.
