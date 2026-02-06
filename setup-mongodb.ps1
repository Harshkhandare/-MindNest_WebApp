# MongoDB Setup Script for MindNest
# This script helps you set up MongoDB connection

Write-Host "`n🧠 MindNest - MongoDB Setup Helper`n" -ForegroundColor Cyan

Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow

# Check if MongoDB is running locally
$mongodbRunning = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($mongodbRunning) {
    Write-Host "✅ MongoDB is running on localhost:27017" -ForegroundColor Green
    Write-Host "`nYour .env file is already configured for local MongoDB." -ForegroundColor Green
    Write-Host "Just restart your server: npm run dev`n" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ MongoDB is not running locally" -ForegroundColor Red
    Write-Host "`nYou have two options:`n" -ForegroundColor Yellow
    
    Write-Host "OPTION 1: MongoDB Atlas (Cloud - Recommended) ⭐" -ForegroundColor Cyan
    Write-Host "1. Go to: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host "2. Create a FREE account (no credit card needed)" -ForegroundColor White
    Write-Host "3. Create a FREE cluster (M0 Sandbox)" -ForegroundColor White
    Write-Host "4. Create database user (username + password)" -ForegroundColor White
    Write-Host "5. Whitelist IP: Click 'Allow Access from Anywhere' (0.0.0.0/0)" -ForegroundColor White
    Write-Host "6. Get connection string: Database → Connect → Connect your application" -ForegroundColor White
    Write-Host "7. Update .env file with your connection string`n" -ForegroundColor White
    
    Write-Host "OPTION 2: Install Local MongoDB" -ForegroundColor Cyan
    Write-Host "1. Download: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "2. Install MongoDB Community Edition" -ForegroundColor White
    Write-Host "3. Start MongoDB service: net start MongoDB" -ForegroundColor White
    Write-Host "4. Your .env is already configured for local MongoDB`n" -ForegroundColor White
    
    Write-Host "After setup, restart server: npm run dev`n" -ForegroundColor Yellow
    
    # Ask if user wants to open MongoDB Atlas
    $response = Read-Host "Would you like to open MongoDB Atlas registration page? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Start-Process "https://www.mongodb.com/cloud/atlas/register"
    }
}



