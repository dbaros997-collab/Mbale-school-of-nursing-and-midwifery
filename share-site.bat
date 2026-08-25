@echo off
REM Fast share mode — production build loads much quicker on phones via tunnel
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed or not on PATH.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Building optimized site for sharing...
call npm run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

echo.
echo Starting fast production server at http://localhost:3000
echo Share your tunnel link while this window stays open.
echo.

call npm run start
