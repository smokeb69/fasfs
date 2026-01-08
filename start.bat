@echo off
echo ========================================
echo BLOOMCRAWLER RIIS - Master Control System
echo ========================================
echo.
echo Starting autonomous cyber intelligence platform...
echo.
echo Server will run on: http://localhost:5000
echo Dashboard available at: http://localhost:5000
echo.
echo Checking Node.js and TypeScript setup...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Check if tsx is available, if not use npx
where tsx >nul 2>nul
if %errorlevel% equ 0 (
    echo Using tsx to run TypeScript server...
    tsx server.ts
) else (
    echo Using npx tsx to run TypeScript server...
    npx tsx server.ts
)

pause</content>
</xai:function_call"><xai:function_call name="write">
<parameter name="file_path">c:\Users\smoke\Downloads\Website_Project\websocket-test.html
