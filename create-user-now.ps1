# Create MySQL User - Harshkant
$ErrorActionPreference = "Stop"

$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"

Write-Host "`n🧠 Creating MySQL User for MindNest`n" -ForegroundColor Cyan

# Try to get root password from common locations or prompt
Write-Host "Enter MySQL root password to create user 'Harshkant':" -ForegroundColor Yellow
$securePassword = Read-Host "Password" -AsSecureString
$rootPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

if ([string]::IsNullOrWhiteSpace($rootPassword)) {
    Write-Host "`n❌ Password required. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "`nCreating database and user..." -ForegroundColor Yellow

$sql = @"
CREATE DATABASE IF NOT EXISTS mindnest;
CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
FLUSH PRIVILEGES;
SELECT 'User Harshkant created successfully!' AS Status;
"@

try {
    $result = & mysql -u root -p"$rootPassword" -e $sql 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
        Write-Host "✅ Database 'mindnest' created" -ForegroundColor Green
        Write-Host "✅ User 'Harshkant' created" -ForegroundColor Green
        Write-Host "✅ Permissions granted`n" -ForegroundColor Green
        Write-Host "You can now start the server: npm run dev`n" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Error creating user:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    exit 1
}



