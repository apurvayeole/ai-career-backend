@echo off
REM Quick startup script for career-ai-backend project (Windows)

echo ================================================
echo Career Navigator Pro - Integrated Setup
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js is installed: %NODE_VERSION%
echo.

REM Parse arguments
if "%1%"=="backend" goto start_backend
if "%1%"=="frontend" goto start_frontend
if "%1%"=="both" goto start_both
if "%1%"=="" goto start_both

echo Usage: %0% [backend^|frontend^|both]
echo.
echo Examples:
echo   %0% backend    - Start only backend server
echo   %0% frontend   - Start only frontend server
echo   %0% both       - Start both servers (default)
exit /b 1

:start_backend
echo [*] Starting Backend Server...
cd /d "%~dp0"

if not exist ".env" (
    echo [!] .env file not found in backend directory
    if exist ".env.example" (
        copy .env.example .env
        echo [*] Created .env from .env.example
    ) else (
        echo [!] Please create .env manually
    )
)

if not exist "node_modules" (
    echo [*] Installing backend dependencies...
    call npm install
)

echo [*] Starting backend on http://localhost:5000
call npm run dev
exit /b 0

:start_frontend
echo [*] Starting Frontend Server...
cd /d "%~dp0career-navigator-pro-main\career-navigator-pro-main"

if not exist ".env" (
    echo [!] .env file not found in frontend directory
    if exist ".env.example" (
        copy .env.example .env
        echo [*] Created .env from .env.example
    ) else (
        echo [!] Please create .env manually
    )
)

if not exist "node_modules" (
    echo [*] Installing frontend dependencies...
    call npm install
)

echo [*] Starting frontend on http://localhost:8080 or http://localhost:5173
call npm run dev
exit /b 0

:start_both
echo [*] Starting both servers...
echo.

REM Start backend in new window
start "Career Navigator - Backend" cmd /k "cd /d %~dp0 && npm run dev"

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start frontend in new window
start "Career Navigator - Frontend" cmd /k "cd /d %~dp0career-navigator-pro-main\career-navigator-pro-main && npm run dev"

echo [OK] Both servers started!
echo ================================================
echo [OK] Both servers started!
echo ================================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080 or http://localhost:5173
echo ================================================
echo.

exit /b 0
