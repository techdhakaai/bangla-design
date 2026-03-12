#!/bin/bash
set -e

echo "🚀 AI Builder - Cloudflare Setup Script"
echo "========================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler..."
    npm install -g wrangler
fi

# Login to Cloudflare
echo ""
echo "Step 1: Login to Cloudflare"
echo "---------------------------"
npx wrangler login

# Create D1 Database
echo ""
echo "Step 2: Create D1 Database"
echo "--------------------------"
echo "Creating database 'ai-builder-db'..."
npx wrangler d1 create ai-builder-db

echo ""
echo "⚠️  IMPORTANT: Copy the database_id from above"
echo "Then update wrangler.toml with your database_id"
echo ""
read -p "Press Enter after you've updated wrangler.toml..."

# Create R2 Bucket
echo ""
echo "Step 3: Create R2 Bucket"
echo "------------------------"
npx wrangler r2 bucket create ai-builder-files

# Create KV Namespace
echo ""
echo "Step 4: Create KV Namespace"
echo "---------------------------"
npx wrangler kv:namespace create "KV"

echo ""
echo "⚠️  IMPORTANT: Copy the KV id from above"
echo "Then update wrangler.toml with your KV id"
echo ""
read -p "Press Enter after you've updated wrangler.toml..."

# Set secrets
echo ""
echo "Step 5: Set OpenAI API Key"
echo "--------------------------"
echo "You'll be prompted to enter your OpenAI API key"
npx wrangler secret put OPENAI_API_KEY

# Apply migrations
echo ""
echo "Step 6: Apply Database Migrations"
echo "---------------------------------"
npx wrangler d1 migrations apply ai-builder-db

# Deploy
echo ""
echo "Step 7: Deploy Worker"
echo "---------------------"
npx wrangler deploy

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Your API is now deployed!"
echo "Note the URL above - you'll need it for the frontend."
echo ""
