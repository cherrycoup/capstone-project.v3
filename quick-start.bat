@echo off
REM E-Commerce Management System - Quick Start Script for Windows

echo.
echo ================================
echo E-Commerce Management System
echo Quick Start Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo OK Node.js is installed
echo.

REM Navigate to server
echo Setting up Backend Server...
cd server

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing server dependencies...
    call npm install
) else (
    echo Server dependencies already installed
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo WARNING Please edit .env file with your MongoDB URI
)

echo OK Server setup complete!
echo.

REM Navigate to frontend
echo Setting up Frontend...
cd ..\frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo Creating .env.local file from template...
    copy .env.example .env.local
)

echo OK Frontend setup complete!
echo.

echo ================================
echo Success! Setup Complete!
echo ================================
echo.
echo To start the project:
echo.
echo 1. Terminal 1 - Start the Backend:
echo    cd server ^&^& npm start
echo.
echo 2. Terminal 2 - Start the Frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
echo For more details, check README.md
echo.
pause
