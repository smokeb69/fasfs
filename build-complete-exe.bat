@echo off
echo ========================================
echo BLOOMCRAWLER RIIS - Complete Executable Builder
echo ========================================
echo.
echo This will build a SINGLE executable with ALL features:
echo   - React frontend (fully built)
echo   - Complete backend server
echo   - All TypeScript modules
echo   - Database support
echo   - All features and capabilities
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

echo.
echo ========================================
echo Step 1: Building React Frontend...
echo ========================================
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Compiling TypeScript...
echo ========================================
call npx tsc --build
if errorlevel 1 (
    echo WARNING: TypeScript compilation had errors, continuing anyway...
)

echo.
echo ========================================
echo Step 3: Creating dist directory...
echo ========================================
if not exist "dist" mkdir dist
if not exist "dist\static" mkdir dist\static

echo.
echo ========================================
echo Step 4: Copying built frontend...
echo ========================================
if exist "dist\index.html" (
    echo Frontend already built, copying...
    xcopy /Y /E /I "dist\*" "dist\static\" >nul 2>&1
) else (
    echo WARNING: Frontend build not found in dist/
)

echo.
echo ========================================
echo Step 5: Building complete standalone executable...
echo ========================================
echo This includes:
echo   - React frontend (built)
echo   - Complete backend server
echo   - Database support
echo   - All features and capabilities
echo.
call npm run build:exe:complete

if errorlevel 1 (
    echo.
    echo ERROR: Executable build failed!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Executable created: dist\bloomcrawler-complete.exe
echo.
echo This executable includes:
echo   - Complete React frontend
echo   - Full backend server
echo   - All features and capabilities
echo   - Database support
echo   - Auto port detection
echo.
echo To run:
echo   dist\bloomcrawler-complete.exe
echo.
echo Press any key to exit...
pause >nul

