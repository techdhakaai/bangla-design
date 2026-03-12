#!/bin/bash
set -e

echo "🚀 AI Builder Platform - Deployment Script"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler..."
    npm install -g wrangler
fi

print_success "Prerequisites check passed!"
echo ""

# Install dependencies
print_status "Installing dependencies..."
pnpm install
print_success "Dependencies installed!"
echo ""

# Deploy Backend
print_status "Deploying Backend API Worker..."
cd apps/api-worker

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    print_warning "Please login to Cloudflare first:"
    wrangler login
fi

# Check if database exists
print_status "Checking D1 Database..."
if ! wrangler d1 list | grep -q "ai-builder-db"; then
    print_warning "Creating D1 Database..."
    wrangler d1 create ai-builder-db
    print_warning "⚠️  IMPORTANT: Update wrangler.toml with your database_id!"
    exit 1
fi

# Check if R2 bucket exists
print_status "Checking R2 Bucket..."
if ! wrangler r2 bucket list | grep -q "ai-builder-files"; then
    print_warning "Creating R2 Bucket..."
    wrangler r2 bucket create ai-builder-files
fi

# Apply migrations
print_status "Applying database migrations..."
wrangler d1 migrations apply ai-builder-db

# Check for OpenAI API key
if ! wrangler secret list | grep -q "OPENAI_API_KEY"; then
    print_warning "Please set your OpenAI API key:"
    wrangler secret put OPENAI_API_KEY
fi

# Deploy worker
print_status "Deploying worker..."
wrangler deploy

print_success "Backend deployed!"
echo ""

# Deploy Frontend
print_status "Deploying Frontend..."
cd ../web

# Build the app
print_status "Building Next.js app..."
pnpm build

# Deploy to Cloudflare Pages
print_status "Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=ai-builder-web

print_success "Frontend deployed!"
echo ""

# Final message
echo "==========================================="
print_success "🎉 Deployment Complete!"
echo "==========================================="
echo ""
echo "Your AI Builder is now live!"
echo ""
echo "Next steps:"
echo "1. Visit your frontend URL above"
echo "2. Create a new project"
echo "3. Start building with AI!"
echo ""
