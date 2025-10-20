@echo off
echo 🏥 MediTech AI Healthcare Agent - Development Startup
echo =====================================================
echo.

echo Starting Mastra Agent Server...
start "Mastra Agent" cmd /k "npm run dev:agent"

echo Waiting 3 seconds for agent to start...
timeout /t 3 /nobreak >nul

echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "npm run dev:ui"

echo.
echo ✅ Both servers are starting...
echo.
echo 📋 What to do next:
echo 1. Wait for both terminals to show "Ready" messages
echo 2. Open http://localhost:3000 in your browser
echo 3. Test the healthcare agent by typing symptoms
echo.
echo 🏥 MediTech AI Healthcare Agent is ready!
echo.
pause
