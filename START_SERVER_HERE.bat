@echo off
echo ========================================
echo BLOOMCRAWLER RIIS - SERVER STARTER
echo ========================================
echo.
echo 🚀 Starting BLOOMCRAWLER RIIS Server...
echo.
echo This will start the server with WebSocket support
echo for live updates and webhook handling.
echo.
echo Press any key to start...
pause >nul

REM Run the server
call "run-server.bat"
