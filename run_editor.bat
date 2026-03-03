@echo off
setlocal
cd /d "%~dp0"

:: Set Rust path explicitly just in case
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

echo Starting Markdown Editor...
npm run tauri dev
pause
