#!/bin/bash

# E-Commerce Management System - Quick Start Script

echo "================================"
echo "E-Commerce Management System"
echo "Quick Start Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Navigate to server
echo "📦 Setting up Backend Server..."
cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
else
    echo "Server dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your MongoDB URI"
fi

echo "✅ Server setup complete!"
echo ""

# Navigate to frontend
echo "⚛️  Setting up Frontend..."
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from template..."
    cp .env.example .env.local
fi

echo "✅ Frontend setup complete!"
echo ""

echo "================================"
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "To start the project:"
echo ""
echo "1. Terminal 1 - Start the Backend:"
echo "   cd server && npm start"
echo ""
echo "2. Terminal 2 - Start the Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For more details, check README.md"
echo ""
