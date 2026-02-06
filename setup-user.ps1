# MySQL User Setup Script for MindNest
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  MySQL User Setup - MindNest" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Get MySQL root password
$securePassword = Read-Host "Enter MySQL root password" -AsSecureString
$rootPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# MySQL path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $mysqlPath)) {
    Write-Host "`n❌ MySQL not found at: $mysqlPath" -ForegroundColor Red
    Write-Host "Please update the mysqlPath variable in this script.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nCreating database and user...`n" -ForegroundColor Yellow

# SQL commands
$sqlCommands = @"
CREATE DATABASE IF NOT EXISTS mindnest;
CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
FLUSH PRIVILEGES;
SELECT 'SUCCESS: Database and user created!' AS Status;
"@

# Execute SQL
try {
    $sqlCommands | & $mysqlPath -u root -p$rootPassword 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ SUCCESS! User 'Harshkant' created with database 'mindnest'`n" -ForegroundColor Green
        Write-Host "You can now start the server with: npm run dev`n" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Error creating user. Check your root password.`n" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ Error: $_`n" -ForegroundColor Red
}


