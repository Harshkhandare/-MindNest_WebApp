# Setup MySQL User for MindNest
Write-Host "`n🧠 Setting up MySQL user for MindNest`n" -ForegroundColor Cyan

$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"

Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "1. Create MySQL user: Harshkant" -ForegroundColor White
Write-Host "2. Set password: Harsh@9712" -ForegroundColor White
Write-Host "3. Create database: mindnest" -ForegroundColor White
Write-Host "4. Grant all privileges`n" -ForegroundColor White

Write-Host "You need MySQL root password to proceed." -ForegroundColor Yellow
$rootPassword = Read-Host "Enter MySQL root password"

if ([string]::IsNullOrWhiteSpace($rootPassword)) {
    Write-Host "`n❌ Root password required. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "`nCreating user and database..." -ForegroundColor Yellow

# Create SQL commands
$sqlCommands = @"
CREATE DATABASE IF NOT EXISTS mindnest;
CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
FLUSH PRIVILEGES;
SELECT 'User created successfully!' AS Status;
"@

try {
    $result = & mysql -u root -p"$rootPassword" -e $sqlCommands 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ MySQL user 'Harshkant' created successfully!" -ForegroundColor Green
        Write-Host "✅ Database 'mindnest' created!" -ForegroundColor Green
        Write-Host "✅ Permissions granted!`n" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Error: $result" -ForegroundColor Yellow
        Write-Host "`nYou can run the SQL commands manually:" -ForegroundColor Cyan
        Write-Host "1. Open MySQL Command Line or Workbench" -ForegroundColor White
        Write-Host "2. Login as root" -ForegroundColor White
        Write-Host "3. Run the commands from: create-mysql-user.sql`n" -ForegroundColor White
    }
} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    Write-Host "`nYou can run the SQL commands manually:" -ForegroundColor Cyan
    Write-Host "1. Open MySQL Command Line or Workbench" -ForegroundColor White
    Write-Host "2. Login as root" -ForegroundColor White
    Write-Host "3. Run the commands from: create-mysql-user.sql`n" -ForegroundColor White
}



