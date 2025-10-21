@echo off
echo 🏥 MediTech AI Healthcare Agent - Clean Startup
echo ================================================
echo.

echo Killing any existing Node.js processes...
taskkill /f /im node.exe 2>nul

echo Waiting 2 seconds for cleanup...
timeout /t 2 /nobreak >nul

echo Starting Mastra Agent Server...
start "Mastra Agent" cmd /k "cd /d %~dp0 && npm run dev:agent"

echo Waiting 5 seconds for agent to start...
timeout /t 5 /nobreak >nul

echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "cd /d %~dp0 && npm run dev:ui"

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

