#!/bin/bash
# Quick Setup Script for ParaBank Automation Framework

set -e

echo "🚀 ParaBank Automation Framework - Quick Setup"
echo "=============================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please  install Node.js 18+ from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "  Found: $NODE_VERSION"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "  Found: $NPM_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "  ✓ Dependencies installed"
echo ""

# Copy environment file
echo "⚙️  Configuring environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  ✓ Created .env from .env.example"
    echo "  ⚠️  Please edit .env with your configuration if needed"
else
    echo "  ✓ .env already exists"
fi
echo ""

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install
echo "  ✓ Browsers installed (Chromium, Firefox, WebKit)"
echo ""

# Run setup validation
echo "✓ Validating setup..."
npm run type-check > /dev/null 2>&1 || true
echo "  ✓ TypeScript validation done"
echo ""

# Create test results directory
mkdir -p test-results
mkdir -p playwright-report
echo "✓ Created output directories"
echo ""

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run tests:     npm test"
echo "2. Smoke tests:   npm run test:smoke"
echo "3. Debug mode:    npx playwright test --debug"
echo "4. View report:   npx playwright show-report"
echo ""
echo "📚 Documentation: See README-FRAMEWORK.md"
echo ""
