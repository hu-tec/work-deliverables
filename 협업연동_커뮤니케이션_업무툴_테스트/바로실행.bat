@echo off
setlocal
cd /d "%~dp0apps\work-communication-tool"
echo Work communication tool starting...
echo.
echo Local URL: http://localhost:4173
echo.
npm start
pause
