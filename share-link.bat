@echo off
REM Creates a temporary public link to share the local site on WhatsApp.
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed.
  pause
  exit /b 1
)

echo Checking site on http://localhost:3000 ...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 | findstr 200 >nul
if errorlevel 1 (
  echo Site is not running. Start it first with start-site.bat
  pause
  exit /b 1
)

echo.
echo Starting share link...
echo If asked for a tunnel password, use your public IP from: https://api.ipify.org
echo.
npx --yes localtunnel --port 3000
