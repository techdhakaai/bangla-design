# 🚀 AI Builder Platform

Build production-ready websites using AI. Describe what you want in plain English, and watch as GPT-4 generates a complete React website with TypeScript and Tailwind CSS.

![AI Builder](https://img.shields.io/badge/AI-Powered-blue)
![Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## ✨ Features

- 🤖 **AI-Powered Generation** - Describe your website in natural language
- 💻 **Production Code** - Get clean TypeScript React code with Tailwind CSS
- 👁️ **Live Preview** - See your website instantly with Sandpack
- 🎨 **Code Editor** - Edit code with Monaco Editor (VS Code)
- 📱 **Responsive** - All generated websites are mobile-friendly
- ⚡ **Fast** - Deployed on Cloudflare's edge network

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js       │────▶│  Cloudflare      │────▶│   OpenAI        │
│   Frontend      │◀────│  Worker (Hono)   │◀────│   GPT-4         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   D1 (SQLite)    │
                        │   R2 (Storage)   │
                        │   KV (Cache)     │
                        └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Cloudflare account (free)
- OpenAI API key

### 1. Clone and Setup

```bash
git clone <your-repo>
cd ai-builder-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Cloudflare

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 Database
npx wrangler d1 create ai-builder-db
# Note the database_id and update apps/api-worker/wrangler.toml

# Create R2 Bucket
npx wrangler r2 bucket create ai-builder-files

# Set OpenAI API Key
npx wrangler secret put OPENAI_API_KEY
# Enter your OpenAI API key when prompted
```

### 4. Deploy

```bash
# Run the deployment script
./deploy.sh
```

Or manually:

```bash
# Deploy backend
cd apps/api-worker
npx wrangler d1 migrations apply ai-builder-db
npx wrangler deploy

# Deploy frontend
cd ../web
pnpm build
npx wrangler pages deploy dist --project-name=ai-builder-web
```

### 5. Access Your Builder

Visit your deployed frontend URL and start building!

## 📁 Project Structure

```
ai-builder-platform/
├── apps/
│   ├── api-worker/          # Cloudflare Worker (Backend)
│   │   ├── src/
│   │   │   ├── index.ts     # Main entry
│   │   │   └── agents/
│   │   │       └── orchestrator.ts  # AI orchestration
│   │   ├── migrations/      # Database migrations
│   │   └── wrangler.toml    # Cloudflare config
│   │
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (builder)/
│       │   │   │   ├── [projectId]/   # Builder page
│       │   │   │   └── new/           # New project
│       │   │   └── page.tsx           # Landing page
│       │   └── components/ui/         # UI components
│       └── package.json
│
├── package.json             # Root config
├── turbo.json               # Turborepo config
└── deploy.sh                # Deployment script
```

## 🔧 Development

### Run Backend Locally

```bash
cd apps/api-worker
npx wrangler dev
```

### Run Frontend Locally

```bash
cd apps/web
# Create .env.local with your API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8787" > .env.local
pnpm dev
```

## 📝 Environment Variables

### Backend (wrangler.toml)

```toml
# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "ai-builder-db"
database_id = "YOUR_DATABASE_ID"

# Secrets (set via wrangler secret put)
# OPENAI_API_KEY
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://ai-builder-api.YOUR_SUBDOMAIN.workers.dev
```

## 💰 Cost Estimation

| Service | Monthly Cost |
|---------|-------------|
| Cloudflare Workers | $5 (10M requests) |
| D1 Database | Free (5M reads/day) |
| R2 Storage | $1.50 (10GB) |
| OpenAI API | $10-30 (depending on usage) |
| **Total** | **~$20-50/month** |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers, Hono.js
- **AI**: OpenAI GPT-4 Turbo
- **Editor**: Monaco Editor (VS Code)
- **Preview**: Sandpack (CodeSandbox)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2

## 🎯 Roadmap

- [x] Basic code generation
- [x] Live preview with Sandpack
- [x] Monaco code editor
- [ ] Multi-file project support
- [ ] Template gallery
- [ ] One-click deployment
- [ ] Real-time collaboration
- [ ] Custom domain support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for personal or commercial projects!

## 🙏 Credits

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- Powered by [OpenAI GPT-4](https://openai.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Code preview by [Sandpack](https://sandpack.codesandbox.io/)

---

**Happy Building!** 🚀
