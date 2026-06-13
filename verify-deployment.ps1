# Deployment Readiness Verification Script (Windows PowerShell)
# Run: .\verify-deployment.ps1

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Deployment Readiness Verification" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$checksPass = 0
$checksFail = 0

# Helper functions
function CheckPass {
  param([string]$message)
  Write-Host "✓ $message" -ForegroundColor Green
  $global:checksPass++
}

function CheckFail {
  param([string]$message)
  Write-Host "✗ $message" -ForegroundColor Red
  $global:checksFail++
}

function CheckWarn {
  param([string]$message)
  Write-Host "⚠ $message" -ForegroundColor Yellow
}

# Backend Dependencies
Write-Host "--- Backend Dependencies ---" -ForegroundColor Cyan
if (Test-Path "server/node_modules") {
  CheckPass "Backend node_modules exists"
} else {
  CheckFail "Backend node_modules missing - run: cd server && npm install"
}

if (Select-String -Path "server/package-lock.json" -Pattern "bcrypt" -Quiet) {
  CheckPass "bcrypt installed"
} else {
  CheckFail "bcrypt not found in package-lock.json"
}

Write-Host ""

# Frontend Dependencies
Write-Host "--- Frontend Dependencies ---" -ForegroundColor Cyan
if (Test-Path "frontend/node_modules") {
  CheckPass "Frontend node_modules exists"
} else {
  CheckFail "Frontend node_modules missing - run: cd frontend && npm install"
}

if (Test-Path "frontend/dist") {
  CheckPass "Frontend dist/ build exists"
  $distSize = (Get-ChildItem -Path "frontend/dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
  Write-Host "  └─ Build size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Gray
} else {
  CheckWarn "Frontend dist/ not built - run: cd frontend && npm run build"
}

Write-Host ""

# Environment Variables
Write-Host "--- Environment Variables ---" -ForegroundColor Cyan
if (Test-Path "server/.env") {
  CheckPass "server/.env exists"
  
  $envContent = Get-Content "server/.env"
  
  if ($envContent -match "NODE_ENV=production") {
    CheckPass "NODE_ENV set to production"
  } else {
    CheckWarn "NODE_ENV not set to production in server/.env"
  }
  
  if ($envContent -match "MONGODB_URI=.+" -and $envContent -notmatch "MONGODB_URI=$") {
    CheckPass "MONGODB_URI configured"
  } else {
    CheckFail "MONGODB_URI not configured"
  }
  
  if ($envContent -match "JWT_SECRET=") {
    $jwtLine = $envContent | Select-String "JWT_SECRET=" | Select-Object -First 1
    $jwtLength = $jwtLine.ToString().Replace("JWT_SECRET=", "").Length
    if ($jwtLength -gt 32) {
      CheckPass "JWT_SECRET length sufficient (>32 chars)"
    } else {
      CheckFail "JWT_SECRET too short (<32 chars)"
    }
  } else {
    CheckFail "JWT_SECRET not set"
  }
  
} else {
  CheckFail "server/.env missing - copy server/.env.example or create from ENV_TEMPLATE.md"
}

if (Test-Path "frontend/.env") {
  CheckPass "frontend/.env exists"
  if ((Get-Content "frontend/.env") -match "VITE_API_BASE_URL=") {
    CheckPass "VITE_API_BASE_URL configured"
  } else {
    CheckFail "VITE_API_BASE_URL not configured"
  }
} else {
  CheckWarn "frontend/.env missing (optional if set in Vercel)"
}

Write-Host ""

# Docker
Write-Host "--- Docker ---" -ForegroundColor Cyan
try {
  $dockerVersion = docker --version 2>$null
  if ($?) {
    CheckPass "Docker is installed"
    
    try {
      docker ps 2>$null | Out-Null
      if ($?) {
        CheckPass "Docker daemon is running"
      } else {
        CheckFail "Docker daemon not running"
      }
    } catch {
      CheckFail "Docker daemon not accessible"
    }
  }
} catch {
  CheckFail "Docker not found in PATH"
}

Write-Host ""

# Dockerfile
Write-Host "--- Dockerfile ---" -ForegroundColor Cyan
if (Test-Path "Dockerfile") {
  CheckPass "Dockerfile exists"
  
  $dockerfileContent = Get-Content "Dockerfile"
  
  if ($dockerfileContent -match "FROM node:20-alpine") {
    CheckPass "Dockerfile uses correct Node.js image"
  } else {
    CheckFail "Dockerfile base image may be incorrect"
  }
  
  if ($dockerfileContent -match "COPY server/package") {
    CheckPass "Dockerfile targets server/ correctly"
  } else {
    CheckFail "Dockerfile may not target backend correctly"
  }
  
  if ($dockerfileContent -match "NODE_ENV=production") {
    CheckPass "Dockerfile sets NODE_ENV=production"
  } else {
    CheckWarn "Dockerfile does not set NODE_ENV=production"
  }
  
} else {
  CheckFail "Dockerfile missing"
}

if (Test-Path ".dockerignore") {
  CheckPass ".dockerignore exists"
} else {
  CheckWarn ".dockerignore missing (not critical)"
}

Write-Host ""

# Configuration Files
Write-Host "--- Configuration Files ---" -ForegroundColor Cyan
if (Test-Path "render.yaml") {
  CheckPass "render.yaml exists (Render deployment config)"
} else {
  CheckWarn "render.yaml missing (needed for Render)"
}

if (Test-Path "frontend/vercel.json") {
  CheckPass "vercel.json exists (Vercel deployment config)"
} else {
  CheckWarn "vercel.json missing (needed for Vercel)"
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Passed: " -NoNewline
Write-Host $checksPass -ForegroundColor Green
Write-Host "Failed: " -NoNewline
Write-Host $checksFail -ForegroundColor Red
Write-Host ""

if ($checksFail -eq 0) {
  Write-Host "✓ All checks passed! Code is ready for deployment." -ForegroundColor Green
  exit 0
} else {
  Write-Host "✗ Some checks failed. See above for details." -ForegroundColor Red
  exit 1
}
