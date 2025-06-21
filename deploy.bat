@echo off
echo 🚀 Starting deployment process...

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ Error: .env.local file not found!
    echo Please create .env.local with your environment variables:
    echo NEXT_PUBLIC_WORDPRESS_API_URL=your_wordpress_url
    echo WORDPRESS_USERNAME=your_username
    echo WORDPRESS_PASSWORD=your_app_password
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm ci --only=production

REM Build the application
echo 🔨 Building application...
npm run build

REM Start the application
echo ✅ Starting application...
npm start 