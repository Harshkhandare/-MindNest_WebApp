@echo off
echo.
echo Creating MySQL User: Harshkant
echo.
set /p ROOT_PASSWORD="Enter MySQL root password: "

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p%ROOT_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS mindnest; CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712'; GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost'; FLUSH PRIVILEGES; SELECT 'User created successfully!' AS Status;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS! User Harshkant created.
    echo You can now start the server: npm run dev
    echo.
) else (
    echo.
    echo ERROR: Failed to create user. Check your root password.
    echo.
)

pause



