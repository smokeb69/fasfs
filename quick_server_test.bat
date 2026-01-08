@echo off
echo ========================================
echo BLOOMCRAWLER RIIS - Server Test
echo ========================================
echo.
echo Testing if server is running on port 5000...
echo.

REM Test HTTP endpoint
echo Testing HTTP endpoint...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ HTTP server is RUNNING on port 5000
    echo.
    echo Testing WebSocket endpoint...
    REM Test WebSocket endpoint
    curl -s http://localhost:5000/socketio-test >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ WebSocket endpoint is accessible
        echo.
        echo 🎉 SERVER IS RUNNING CORRECTLY!
        echo.
        echo Access the dashboard at:
        echo http://localhost:5000
        echo.
    ) else (
        echo ❌ WebSocket endpoint not accessible
        echo.
        echo ⚠️  HTTP works but WebSocket may not be initialized
    )
) else (
    echo ❌ HTTP server is NOT RUNNING on port 5000
    echo.
    echo 💡 To start the server:
    echo 1. Double-click run-server.bat
    echo 2. Or run: python bloomcrawler_riis_complete.py
    echo.
    echo Wait for: "🌐 Starting Flask Server with SocketIO..."
    echo Then run this test again.
)

echo.
pause
