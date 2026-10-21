@echo off
echo ========================================================
echo   Esports Tournament System - Local Setup & Launcher
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed on your computer!
    echo.
    echo Please download and install Node.js LTS from:
    echo https://nodejs.org/
    echo.
    echo After installing Node.js, restart VS Code or double-click start.bat again.
    echo.
    pause
    exit /b 1
)

echo [1/2] Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo [2/2] Starting application at http://localhost:3000 ...
call npm run dev
pause