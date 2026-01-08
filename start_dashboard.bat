@echo off
cd /d "%~dp0"
echo ========================================
echo BLOOMCRAWLER RIIS Living Dashboard
echo ========================================
echo.
echo Starting dashboard server...
echo This will show npm start output in real-time
echo.
echo Dashboard: http://localhost:5000
echo.
echo Press Ctrl+C to stop
echo ========================================

python minimal_server.py

echo.
echo ========================================
echo Dashboard stopped
echo ========================================
pause
