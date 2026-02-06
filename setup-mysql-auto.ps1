# Automatic MySQL Setup Script for MindNest
Write-Host "`n🧠 MindNest - Automatic MySQL Setup`n" -ForegroundColor Cyan

# Check if MySQL is installed
Write-Host "Checking MySQL installation..." -ForegroundColor Yellow

$mysqlServices = Get-Service | Where-Object { $_.DisplayName -like "*mysql*" -or $_.Name -like "*mysql*" }

if ($mysqlServices.Count -eq 0) {
    Write-Host "`n❌ MySQL is not installed on this system." -ForegroundColor Red
    Write-Host "`n📥 Please install MySQL:" -ForegroundColor Yellow
    Write-Host "1. Download MySQL Community Server:" -ForegroundColor White
    Write-Host "   https://dev.mysql.com/downloads/mysql/" -ForegroundColor Cyan
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Set a root password (remember it!)" -ForegroundColor White
    Write-Host "4. Run this script again`n" -ForegroundColor White
    
    $install = Read-Host "Would you like to open the MySQL download page? (Y/N)"
    if ($install -eq 'Y' -or $install -eq 'y') {
        Start-Process "https://dev.mysql.com/downloads/mysql/"
    }
    exit 1
}

Write-Host "✅ MySQL service found!" -ForegroundColor Green

# Find MySQL service
$mysqlService = $mysqlServices | Select-Object -First 1
Write-Host "Service: $($mysqlService.DisplayName)" -ForegroundColor Cyan

# Start MySQL if not running
if ($mysqlService.Status -ne 'Running') {
    Write-Host "`nStarting MySQL service..." -ForegroundColor Yellow
    try {
        Start-Service -Name $mysqlService.Name
        Start-Sleep -Seconds 3
        Write-Host "✅ MySQL service started!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start MySQL service: $_" -ForegroundColor Red
        Write-Host "Try starting it manually as Administrator" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ MySQL service is already running!" -ForegroundColor Green
}

# Try to find MySQL executable
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe"
)

$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlExe = $path
        break
    }
}

if (-not $mysqlExe) {
    # Try to find in PATH
    $mysqlExe = (Get-Command mysql -ErrorAction SilentlyContinue).Source
}

if (-not $mysqlExe) {
    Write-Host "`n⚠️  MySQL command line tool not found in standard locations." -ForegroundColor Yellow
    Write-Host "The database will be created automatically when you start the server." -ForegroundColor Cyan
    Write-Host "`n✅ MySQL service is running - you can proceed!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Update .env file with your MySQL root password" -ForegroundColor White
    Write-Host "2. Run: npm run dev" -ForegroundColor White
    Write-Host "3. The app will create the database automatically`n" -ForegroundColor White
    exit 0
}

Write-Host "`n✅ Found MySQL at: $mysqlExe" -ForegroundColor Green

# Try to create database
Write-Host "`nCreating database 'mindnest'..." -ForegroundColor Yellow

# Read .env to get password
$envContent = Get-Content .env -ErrorAction SilentlyContinue
$dbPassword = ""
if ($envContent) {
    $passwordLine = $envContent | Where-Object { $_ -match "^DB_PASSWORD=(.+)$" }
    if ($passwordLine) {
        $dbPassword = ($passwordLine -split "=")[1].Trim()
    }
}

if ([string]::IsNullOrWhiteSpace($dbPassword)) {
    Write-Host "`n⚠️  No MySQL password set in .env file." -ForegroundColor Yellow
    Write-Host "Please update .env file with your MySQL root password:" -ForegroundColor White
    Write-Host "DB_PASSWORD=your_password_here`n" -ForegroundColor Cyan
    
    $password = Read-Host "Enter MySQL root password (or press Enter to skip)"
    if (-not [string]::IsNullOrWhiteSpace($password)) {
        # Update .env
        $envContent = Get-Content .env
        $newContent = @()
        foreach ($line in $envContent) {
            if ($line -match "^DB_PASSWORD=") {
                $newContent += "DB_PASSWORD=$password"
            } else {
                $newContent += $line
            }
        }
        if (-not ($envContent | Where-Object { $_ -match "^DB_PASSWORD=" })) {
            $newContent += "DB_PASSWORD=$password"
        }
        $newContent | Set-Content .env
        $dbPassword = $password
        Write-Host "✅ Password saved to .env" -ForegroundColor Green
    }
}

# Try to create database
if (-not [string]::IsNullOrWhiteSpace($dbPassword)) {
    $createDbScript = "CREATE DATABASE IF NOT EXISTS mindnest;"
    
    try {
        $env:Path += ";$(Split-Path $mysqlExe)"
        $result = & $mysqlExe -u root -p"$dbPassword" -e $createDbScript 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database 'mindnest' created successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Could not create database automatically: $result" -ForegroundColor Yellow
            Write-Host "The app will create it automatically when you start the server." -ForegroundColor Cyan
        }
    } catch {
        Write-Host "⚠️  Could not create database automatically: $_" -ForegroundColor Yellow
        Write-Host "The app will create it automatically when you start the server." -ForegroundColor Cyan
    }
} else {
    Write-Host "⚠️  Skipping database creation (no password provided)" -ForegroundColor Yellow
    Write-Host "The app will create it automatically when you start the server." -ForegroundColor Cyan
}

Write-Host "`n✅ MySQL setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Make sure DB_PASSWORD is set in .env file" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. The app will create all tables automatically`n" -ForegroundColor White



