# TravelPulse - Start Backend + Frontend
# Run: .\start-dev.ps1

Write-Host "🚀 Starting TravelPulse Development Stack..." -ForegroundColor Cyan
Write-Host ""

$mongoExe = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
$dbPath = "c:\Users\Nilesh Namdev\Desktop\Travel SaaS\server\data\db"

# Check & start MongoDB
Write-Host "📦 Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "  ✅ MongoDB is already running" -ForegroundColor Green
} else {
    if (Test-Path $mongoExe) {
        Write-Host "  🔄 Starting MongoDB Server locally..." -ForegroundColor Cyan
        Start-Process -FilePath $mongoExe -ArgumentList "--dbpath `"$dbPath`"" -WindowStyle Hidden
        Start-Sleep 2
        Write-Host "  ✅ MongoDB started with dbpath: $dbPath" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  mongod.exe not found at standard path. Please start MongoDB manually." -ForegroundColor Red
    }
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
npm run seed 2>&1 | Select-Object -Last 8

# Start Vite dev server
Write-Host ""
Write-Host "🌐 Starting Vite frontend on :5173..." -ForegroundColor Yellow
Set-Location "c:\Users\Nilesh Namdev\Desktop\Travel SaaS"
npm.cmd run dev
