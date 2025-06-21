#!/bin/bash

# Deployment script for production
set -e

echo "🚀 Starting deployment process..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your environment variables:"
    echo "NEXT_PUBLIC_WORDPRESS_API_URL=your_wordpress_url"
    echo "WORDPRESS_USERNAME=your_username"
    echo "WORDPRESS_PASSWORD=your_app_password"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Start the application
echo "✅ Starting application..."
npm start 