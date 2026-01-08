@echo off
cd /d "%~dp0"
echo ========================================
echo S.R.E. COMPLETE PRODUCTION SYSTEM
echo ========================================
echo.
echo Working directory: %cd%
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and add to PATH
    pause
    exit /b 1
)

REM Check if the Python script exists
if not exist "bloomcrawler_riis_complete.py" (
    echo ERROR: bloomcrawler_riis_complete.py not found in current directory
    echo Please ensure the script is in the same directory as this batch file
    pause
    exit /b 1
)

REM Check if requirements are installed
if not exist "requirements.txt" (
    echo WARNING: requirements.txt not found, installing basic requirements...
    pip install flask flask-socketio python-socketio eventlet beautifulsoup4 requests numpy pandas scikit-learn --quiet
) else (
    echo Checking Python dependencies...
    pip install -r requirements.txt --quiet >nul 2>&1
)

echo.
echo ========================================
echo STARTING S.R.E. PRODUCTION SYSTEM
echo ========================================
echo.
echo Server will run on:
echo   - HTTP:  http://localhost:5000
echo   - WebSocket: ws://localhost:5000/socket.io/
echo   - Health Check: http://localhost:5000/health
echo.
echo Features:
echo   - Live execution of INSTALL_AND_RUN.sh script
echo   - Real-time output streaming to web dashboard
echo   - Existing S.R.E. system integration
echo   - WebSocket live updates
echo   - Webhook handling from existing system
echo   - Live system monitoring dashboard
echo.
echo Press Ctrl+C to stop the server...
echo ========================================
echo.

REM Start the server
python bloomcrawler_riis_complete.py

REM If server exits, show message
echo.
echo ========================================
echo SERVER STOPPED
echo ========================================
echo.
echo If the server exited unexpectedly, check the error messages above.
echo.
echo To restart: Run this batch file again
echo Or manually: python bloomcrawler_riis_complete.py
echo.
echo Note: This runs your existing S.R.E. system with live web dashboard
echo.

pause
