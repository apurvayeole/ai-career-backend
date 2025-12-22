#!/bin/bash
# Quick startup script for career-ai-backend project

echo "================================================"
echo "Career Navigator Pro - Integrated Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Function to start backend
start_backend() {
    echo "📦 Starting Backend Server..."
    cd "$(dirname "$0")"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found in backend directory"
        echo "   Creating .env from .env.example..."
        cp .env.example .env 2>/dev/null || echo "   Please create .env manually"
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing backend dependencies..."
        npm install
    fi
    
    echo "🚀 Starting backend on http://localhost:5000"
    npm run dev
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server..."
    cd "$(dirname "$0")/career-navigator-pro-main/career-navigator-pro-main"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found in frontend directory"
        echo "   Creating .env from .env.example..."
        cp .env.example .env 2>/dev/null || echo "   Please create .env manually"
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing frontend dependencies..."
        npm install
    fi
    
    echo "🚀 Starting frontend on http://localhost:8080 or http://localhost:5173"
    npm run dev
}

# Menu
if [ "$1" == "backend" ]; then
    start_backend
elif [ "$1" == "frontend" ]; then
    start_frontend
elif [ "$1" == "both" ] || [ -z "$1" ]; then
    echo "Starting both servers in the background..."
    start_backend &
    BACKEND_PID=$!
    sleep 2
    start_frontend &
    FRONTEND_PID=$!
    
    echo ""
    echo "================================================"
    echo "✅ Both servers started!"
    echo "================================================"
    echo "Backend:  http://localhost:5000"
    echo "Frontend: http://localhost:8080 or http://localhost:5173"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    echo "================================================"
    
    wait
else
    echo "Usage: $0 [backend|frontend|both]"
    echo ""
    echo "Examples:"
    echo "  $0 backend    - Start only backend server"
    echo "  $0 frontend   - Start only frontend server"
    echo "  $0 both       - Start both servers (default)"
    exit 1
fi
