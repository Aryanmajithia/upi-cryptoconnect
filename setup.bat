@echo off
setlocal enabledelayedexpansion

echo Setting up UPI CryptoConnect...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js ^>= 18.0.0
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_VER=%%a
    set NODE_VER=!NODE_VER:v=!
    if !NODE_VER! lss 18 (
        echo Node.js version must be ^>= 18.0.0. Current version: %%a.%%b.%%c
        exit /b 1
    )
)

:: Setup backend
echo Setting up backend...
cd backend

:: Create .env if it doesn't exist
if not exist .env (
    copy .env.example .env >nul 2>nul
    echo Created .env file. Please update it with your configuration.
)

:: Install backend dependencies
echo Installing backend dependencies...
call npm install

:: Setup frontend
echo Setting up frontend...
cd ../client

:: Create frontend .env if it doesn't exist
if not exist .env (
    echo VITE_BACKEND_URL=http://localhost:6900> .env
    echo Created frontend .env file.
)

:: Install frontend dependencies
echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Update backend/.env with your configuration
echo 2. Start backend: cd backend ^&^& npm run dev
echo 3. Start frontend: cd client ^&^& npm run dev

endlocal