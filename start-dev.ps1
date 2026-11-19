# TravelPulse - Start Backend + Frontend
# Run: .\start-dev.ps1

Write-Host "🚀 Starting TravelPulse Development Stack..." -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "📦 Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "  ✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  MongoDB not detected. Make sure mongod is running!" -ForegroundColor Red
    Write-Host "  → Start MongoDB: mongod --dbpath C:\data\db" -ForegroundColor Yellow
    Write-Host ""
}

# Start API server in background
Write-Host "🔧 Starting Express API server on :5000..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    Set-Location "c:\Users\Nilesh Namdev\Desktop\Travel SaaS\server"
    npm run dev
}
Write-Host "  ✅ API server started (Job ID: $($serverJob.Id))" -ForegroundColor Green
Start-Sleep 3

# Seed database
Write-Host ""
Write-Host "🌱 Seeding database (packages + admin user)..." -ForegroundColor Yellow
Set-Location "c:\Users\Nilesh Namdev\Desktop\Travel SaaS\server"
npx ts-node src/scripts/seed.ts 2>&1 | Select-Object -Last 8

# Start Vite dev server
Write-Host ""
Write-Host "🌐 Starting Vite frontend on :5173..." -ForegroundColor Yellow
Set-Location "c:\Users\Nilesh Namdev\Desktop\Travel SaaS"
npm.cmd run dev
