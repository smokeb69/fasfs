@echo off
echo ========================================
echo BLOOMCRAWLER RIIS - Python Edition
echo ========================================
echo.
echo Starting autonomous cyber intelligence platform...
echo.
echo System will start with:
echo - Flask Web Server (port 5000)
echo - Tkinter GUI Dashboard
echo - WebSocket Real-time Updates
echo - Autonomous AI Operations
echo.
echo Press Ctrl+C to stop...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and add to PATH
    pause
    exit /b 1
)

REM Check if requirements are installed
if not exist "requirements.txt" (
    echo ERROR: requirements.txt not found
    echo Please ensure all files are in the correct directory
    pause
    exit /b 1
)

REM Install/update requirements if needed
echo Checking dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo WARNING: Some dependencies may not have installed correctly
    echo Continuing anyway...
)

echo.
echo Starting BLOOMCRAWLER RIIS...
echo.
python bloomcrawler_riis_complete.py
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Script exited with errors!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo The window will stay open for 30 seconds...
    timeout /t 30
)
pause
