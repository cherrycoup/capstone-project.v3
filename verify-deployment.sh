#!/bin/bash

# Deployment Readiness Verification Script
# Run: chmod +x verify-deployment.sh && ./verify-deployment.sh

echo "========================================="
echo "Deployment Readiness Verification"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Helper functions
check_pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((CHECKS_PASSED++))
}

check_fail() {
  echo -e "${RED}✗${NC} $1"
  ((CHECKS_FAILED++))
}

check_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

echo "--- Backend Dependencies ---"
if [ -d "server/node_modules" ]; then
  check_pass "Backend node_modules exists"
else
  check_fail "Backend node_modules missing - run: cd server && npm install"
fi

if grep -q "bcrypt" server/package-lock.json; then
  check_pass "bcrypt installed"
else
  check_fail "bcrypt not found in package-lock.json"
fi

echo ""
echo "--- Frontend Dependencies ---"
if [ -d "frontend/node_modules" ]; then
  check_pass "Frontend node_modules exists"
else
  check_fail "Frontend node_modules missing - run: cd frontend && npm install"
fi

if [ -d "frontend/dist" ]; then
  check_pass "Frontend dist/ build exists"
  DIST_SIZE=$(du -sh frontend/dist | cut -f1)
  echo "  └─ Build size: $DIST_SIZE"
else
  check_warn "Frontend dist/ not built - run: cd frontend && npm run build"
fi

echo ""
echo "--- Environment Variables ---"
if [ -f "server/.env" ]; then
  check_pass "server/.env exists"
  
  if grep -q "NODE_ENV=production" server/.env; then
    check_pass "NODE_ENV set to production"
  else
    check_warn "NODE_ENV not set to production in server/.env"
  fi
  
  if grep -q "MONGODB_URI=" server/.env && ! grep -q "MONGODB_URI=$" server/.env; then
    check_pass "MONGODB_URI configured"
  else
    check_fail "MONGODB_URI not configured"
  fi
  
  if grep -q "JWT_SECRET=" server/.env; then
    JWT_LENGTH=$(grep "JWT_SECRET=" server/.env | sed 's/JWT_SECRET=//' | wc -c)
    if [ $JWT_LENGTH -gt 32 ]; then
      check_pass "JWT_SECRET length sufficient (>32 chars)"
    else
      check_fail "JWT_SECRET too short (<32 chars)"
    fi
  else
    check_fail "JWT_SECRET not set"
  fi
  
else
  check_fail "server/.env missing - copy server/.env.example or create from ENV_TEMPLATE.md"
fi

if [ -f "frontend/.env" ]; then
  check_pass "frontend/.env exists"
  if grep -q "VITE_API_BASE_URL=" frontend/.env; then
    check_pass "VITE_API_BASE_URL configured"
  else
    check_fail "VITE_API_BASE_URL not configured"
  fi
else
  check_warn "frontend/.env missing (optional if set in Vercel)"
fi

echo ""
echo "--- Docker ---"
if command -v docker &> /dev/null; then
  check_pass "Docker is installed"
  
  if docker ps &> /dev/null; then
    check_pass "Docker daemon is running"
  else
    check_fail "Docker daemon not running"
  fi
else
  check_fail "Docker not found in PATH"
fi

echo ""
echo "--- Dockerfile ---"
if [ -f "Dockerfile" ]; then
  check_pass "Dockerfile exists"
  
  if grep -q "FROM node:20-alpine" Dockerfile; then
    check_pass "Dockerfile uses correct Node.js image"
  else
    check_fail "Dockerfile base image may be incorrect"
  fi
  
  if grep -q "COPY server/package" Dockerfile; then
    check_pass "Dockerfile targets server/ correctly"
  else
    check_fail "Dockerfile may not target backend correctly"
  fi
  
  if grep -q "NODE_ENV=production" Dockerfile; then
    check_pass "Dockerfile sets NODE_ENV=production"
  else
    check_warn "Dockerfile does not set NODE_ENV=production"
  fi
else
  check_fail "Dockerfile missing"
fi

if [ -f ".dockerignore" ]; then
  check_pass ".dockerignore exists"
else
  check_warn ".dockerignore missing (not critical)"
fi

echo ""
echo "--- Configuration Files ---"
if [ -f "render.yaml" ]; then
  check_pass "render.yaml exists (Render deployment config)"
else
  check_warn "render.yaml missing (needed for Render)"
fi

if [ -f "frontend/vercel.json" ]; then
  check_pass "vercel.json exists (Vercel deployment config)"
else
  check_warn "vercel.json missing (needed for Vercel)"
fi

echo ""
echo "========================================="
echo "Summary"
echo "========================================="
echo -e "Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Failed: ${RED}$CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed! Code is ready for deployment.${NC}"
  exit 0
else
  echo -e "${RED}✗ Some checks failed. See above for details.${NC}"
  exit 1
fi
