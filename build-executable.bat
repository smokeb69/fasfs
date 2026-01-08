@echo off
echo ========================================
echo BLOOMCRAWLER RIIS - Executable Builder
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking Node.js version...
node --version

REM Check if dependencies are installed
if not exist "node_modules" (
    echo.
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Create dist directory if it doesn't exist
if not exist "dist" mkdir dist

echo.
echo ========================================
echo Building standalone executable...
echo ========================================
echo.
echo This will create a single .exe file that:
echo   - Contains all necessary files
echo   - Self-hosts the web server
echo   - Auto-detects available ports
echo   - Runs anywhere without installation
echo.
echo Building Windows executable...
call npm run build:exe:win

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Executable created: dist\bloomcrawler.exe
echo.
echo To run the executable:
echo   1. Double-click dist\bloomcrawler.exe
echo   2. Or run from command line: dist\bloomcrawler.exe
echo.
echo The server will automatically:
echo   - Find an available port (starting from 5000)
echo   - Start the web server
echo   - Open your browser to the dashboard
echo.
echo Press any key to exit...
pause >nul

