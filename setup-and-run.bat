@echo off
echo.
echo ========================================
echo   MindNest MySQL Setup and Start
echo ========================================
echo.

echo Step 1: Creating MySQL user...
echo.
echo This requires your MySQL root password.
echo.

set /p ROOT_PASS="Enter MySQL root password: "

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p%ROOT_PASS% -e "CREATE DATABASE IF NOT EXISTS mindnest; CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712'; GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost'; FLUSH PRIVILEGES; SELECT 'SUCCESS!' AS Status;"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create user. Check your root password.
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Starting server...
echo.

call npm run dev


