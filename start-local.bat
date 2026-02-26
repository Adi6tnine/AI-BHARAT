@echo off
echo.
echo ═══════════════════════════════════════════════════════
echo   Starting SahayakAI Locally...
echo ═══════════════════════════════════════════════════════
echo.

REM Start backend mock server in new window
start "SahayakAI - Backend Mock Server" cmd /k "cd sahayakai\backend && npm run local"

REM Wait 2 seconds for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend dev server in new window
start "SahayakAI - Frontend Dev Server" cmd /k "cd sahayakai\frontend && npm run dev"

echo.
echo ═══════════════════════════════════════════════════════
echo   SahayakAI is starting...
echo ═══════════════════════════════════════════════════════
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo.
echo   Two windows will open:
echo   1. Backend Mock Server (port 3001)
echo   2. Frontend Dev Server (port 5173)
echo.
echo   Open http://localhost:5173 in your browser
echo.
echo ═══════════════════════════════════════════════════════
echo.
pause
