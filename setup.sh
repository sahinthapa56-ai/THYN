#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# THYN — One-command local setup script
# Run: bash setup.sh
# ──────────────────────────────────────────────────────────────

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        THYN V1 — Local Setup             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Check prerequisites ──────────────────────────────────
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✖ Node.js is required. Download from https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✖ npm is required.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

if ! command -v npx &> /dev/null; then
    echo -e "${RED}✖ npx is required.${NC}"
    exit 1
fi

# ── Check .env files exist ──────────────────────────────
echo ""
echo -e "${YELLOW}Checking environment files...${NC}"

BACKEND_ENV="backend/.env"
WEB_ENV="web/.env.local"
EXT_ENV="extension/.env"

if [ ! -f "$BACKEND_ENV" ]; then
    echo -e "${RED}✖ $BACKEND_ENV not found.${NC}"
    echo "  Copy from backend/.env.example and fill in your Supabase credentials."
    exit 1
fi
echo -e "${GREEN}✓ $BACKEND_ENV${NC}"

if [ ! -f "$WEB_ENV" ]; then
    echo -e "${RED}✖ $WEB_ENV not found.${NC}"
    echo "  Copy from web/.env.local.example and fill in your Supabase credentials."
    exit 1
fi
echo -e "${GREEN}✓ $WEB_ENV${NC}"

if [ ! -f "$EXT_ENV" ]; then
    echo -e "${YELLOW}⚠ $EXT_ENV not found — creating default...${NC}"
    echo "VITE_API_URL=http://localhost:3001" > "$EXT_ENV"
fi
echo -e "${GREEN}✓ $EXT_ENV${NC}"

# ── Install dependencies ─────────────────────────────────
echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"

echo "  → Backend..."
cd backend
npm install --silent 2>&1 | tail -1
cd ..

echo "  → Web..."
cd web
npm install --silent 2>&1 | tail -1
cd ..

echo "  → Extension..."
cd extension
npm install --silent 2>&1 | tail -1
cd ..

echo -e "${GREEN}✓ All dependencies installed${NC}"

# ── Prisma generate ─────────────────────────────────────
echo ""
echo -e "${YELLOW}Generating Prisma client...${NC}"
cd backend
npx prisma generate 2>&1 | tail -1
cd ..
echo -e "${GREEN}✓ Prisma client generated${NC}"

# ── TypeScript check ─────────────────────────────────────
echo ""
echo -e "${YELLOW}Verifying TypeScript compilation...${NC}"

cd backend
if npx tsc --noEmit 2>&1; then
    echo -e "${GREEN}  ✓ Backend TS clean${NC}"
else
    echo -e "${RED}  ✖ Backend TS errors found${NC}"
fi
cd ..

cd web
if npx tsc --noEmit 2>&1; then
    echo -e "${GREEN}  ✓ Web TS clean${NC}"
else
    echo -e "${RED}  ✖ Web TS errors found${NC}"
fi
cd ..

# ── Summary ──────────────────────────────────────────────
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        SETUP COMPLETE                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  Start the stack with:"
echo ""
echo -e "  ${GREEN}Terminal 1 (Backend)${NC}"
echo "    cd backend && npm run dev"
echo ""
echo -e "  ${GREEN}Terminal 2 (Web)${NC}"
echo "    cd web && npm run dev"
echo ""
echo -e "  ${GREEN}Terminal 3 (Extension)${NC}"
echo "    cd extension && npm run dev"
echo "    Chrome → Load unpacked → extension/dist/"
echo ""
echo -e "  Then open ${BLUE}http://localhost:3000${NC}"
echo ""
