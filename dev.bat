@echo off
setlocal enabledelayedexpansion

echo Starting UPI CryptoConnect development servers...

:: Check if required environment files exist
if not exist backend\.env (
    echo Error: backend/.env file not found. Please run setup.bat first.
    exit /b 1
)

if not exist client\.env (
    echo Error: client/.env file not found. Please run setup.bat first.
    exit /b 1
)

:: Start backend server in a new window
start "UPI CryptoConnect Backend" cmd /c "cd backend && npm run dev"

:: Wait for backend to start (5 seconds)
echo Waiting for backend server to start...
timeout /t 5 /nobreak >nul

:: Start frontend server in a new window
start "UPI CryptoConnect Frontend" cmd /c "cd client && npm run dev"

echo.
echo Development servers started!
echo.
echo Backend server: http://localhost:6900
echo Frontend server: http://localhost:5173
echo.
echo Press Ctrl+C in the respective windows to stop the servers

endlocal