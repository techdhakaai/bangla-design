# 🇧🇩 Bangla.design - AI Website Builder for Bangladesh

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-4B32C3?style=for-the-badge" alt="Drizzle ORM" />
</p>

<p align="center">
  <strong>The first AI-powered website builder designed specifically for Bangladesh</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#api-documentation">API</a>
</p>

---

## 🌟 Features

### 🤖 AI-Powered Website Builder
- **Bangla & English Prompt Support** - Create websites in your preferred language
- **GPT-4 Content Generation** - AI writes professional content for your business
- **DALL-E Image Generation** - Generate custom images for your website
- **100+ Industry Templates** - Pre-designed templates for every business type
- **Drag-and-Drop Editor** - Easy visual editing without coding
- **Real-time Preview** - See changes instantly as you build

### 💳 Bangladesh Payment Integration
- ✅ **bKash** - Tokenized API integration
- ✅ **Nagad** - Merchant API integration
- ✅ **SSLCommerz** - Multiple payment gateway support
- ✅ **Rocket** - DBBL mobile banking
- ✅ **Upay** - UCash integration

### 🎨 Design System
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui Components** - Beautiful, accessible UI components
- **Bangla Typography** - Noto Sans Bengali font support
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Automatic theme switching

### 🔐 Security & Authentication
- **NextAuth.js** - Secure authentication with multiple providers
- **Google OAuth** - One-click sign-in
- **Role-based Access** - User, Admin, Superadmin roles
- **2FA Support** - Two-factor authentication ready
- **Row-level Security** - Database-level protection

### 📊 Dashboard & Analytics
- **Site Management** - Create, edit, and publish websites
- **Usage Analytics** - Track page views and visitors
- **AI Generation Stats** - Monitor your AI usage
- **Billing Management** - View invoices and manage subscriptions

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Cache** | Redis (Upstash) |
| **Auth** | NextAuth.js v5 |
| **AI** | OpenAI GPT-4 + DALL-E |
| **Payments** | bKash, Nagad, SSLCommerz APIs |
| **Storage** | Vercel Blob / AWS S3 |
| **Hosting** | Vercel Edge Network |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Redis instance (Upstash recommended)
- OpenAI API key
- bKash/Nagad merchant accounts (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bangla-design.git
cd bangla-design
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Redis
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# bKash
BKASH_APP_KEY="your-bkash-app-key"
BKASH_APP_SECRET="your-bkash-app-secret"
BKASH_USERNAME="your-bkash-username"
BKASH_PASSWORD="your-bkash-password"
BKASH_BASE_URL="https://tokenized.sandbox.bka.sh"

# Nagad
NAGAD_MERCHANT_ID="your-nagad-merchant-id"
NAGAD_MERCHANT_PRIVATE_KEY="your-nagad-private-key"
NAGAD_BASE_URL="https://api.mynagad.com"
```

4. **Set up the database**
```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
bangla-design/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth group routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Dashboard group routes
│   │   ├── dashboard/
│   │   ├── sites/
│   │   └── billing/
│   ├── (marketing)/         # Marketing pages
│   │   ├── page.tsx         # Landing page
│   │   ├── pricing/
│   │   └── templates/
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── ai/
│   │   └── payments/
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── editor/             # Website editor components
│   └── sections/           # Page sections
├── db/                     # Database
│   ├── schema.ts           # Drizzle schema
│   └── index.ts            # Database connection
├── lib/                    # Utilities
│   ├── utils.ts            # Helper functions
│   ├── auth.ts             # Auth configuration
│   ├── ai/                 # AI builder
│   └── payments/           # Payment integrations
├── types/                  # TypeScript types
├── public/                 # Static assets
└── config files           # Various config files
```

---

## 💰 Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | ৳0 | 1 site, 500MB storage, 5 AI gen/month |
| **Starter** | ৳499/mo | 3 sites, 5GB storage, 50 AI gen |
| **Pro** | ৳1,999/mo | 10 sites, 50GB storage, unlimited AI |
| **Business** | ৳4,999/mo | Unlimited sites, 200GB, white-label |

---

## 🌐 API Documentation

### Authentication

All API endpoints (except auth) require authentication via session cookie or Bearer token.

### AI Generation

**POST** `/api/ai/generate`

Generate content using AI.

```json
{
  "prompt": "Create a hero section for a restaurant website",
  "type": "content", // "content" | "image" | "layout" | "full-site"
  "language": "en",  // "en" | "bn"
  "siteId": "optional-site-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "generation-id",
    "status": "completed",
    "result": { ... }
  }
}
```

### Payments

**POST** `/api/payments/bkash/create`

Create a bKash payment.

```json
{
  "amount": 499,
  "subscriptionId": "optional-subscription-id",
  "description": "Starter Plan Subscription"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "payment-id",
    "bkashURL": "https://...",
    "paymentID": "bkash-payment-id"
  }
}
```

---

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bangla-design)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set these in Vercel:

- `DATABASE_URL` - Production PostgreSQL URL
- `NEXTAUTH_SECRET` - Random 32+ character string
- `NEXTAUTH_URL` - Your production URL
- `OPENAI_API_KEY` - Your OpenAI API key
- `BKASH_*` - Production bKash credentials
- `NAGAD_*` - Production Nagad credentials

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [OpenAI](https://openai.com/) - AI models
- [bKash](https://www.bkash.com/) - Mobile financial services
- [Nagad](https://nagad.com.bd/) - Digital financial service

---

## 📞 Support

- 📧 Email: support@bangla.design
- 💬 Discord: [Join our community](https://discord.gg/bangladesign)
- 🐦 Twitter: [@bangladesign](https://twitter.com/bangladesign)
- 📘 Facebook: [Bangla.design](https://facebook.com/bangladesign)

---

<p align="center">
  Made with ❤️ in Bangladesh
</p>
