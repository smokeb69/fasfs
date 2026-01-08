@echo off
cd /d "%~dp0"
echo ========================================
echo BLOOMCRAWLER RIIS Living Dashboard
echo ========================================
echo.
echo Starting simple dashboard server...
echo.
echo Features:
echo   - Live npm start monitoring
echo   - Dynamic container system
echo   - Self-generating webhooks
echo   - Real-time system logs
echo.
echo Dashboard will be available at:
echo   http://localhost:5000
echo.
echo Press Ctrl+C to stop the server...
echo ========================================

python simple_dashboard_server.py

echo.
echo ========================================
echo SERVER STOPPED
echo ========================================
echo.
pause
