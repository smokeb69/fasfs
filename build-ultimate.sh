#!/bin/bash

# BLOOMCRAWLER RIIS - Ultimate Build Script
# Builds production-ready executables for all platforms

echo "════════════════════════════════════════════════════════════════"
echo "  BLOOMCRAWLER RIIS - Ultimate Edition Build Script"
echo "  Version: 2.0.0"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if pkg is installed
if ! command -v pkg &> /dev/null; then
    echo -e "${YELLOW}⚠️  pkg not found. Installing...${NC}"
    npm install -g pkg
fi

# Create dist directory
echo -e "${BLUE}📁 Creating dist directory...${NC}"
mkdir -p dist

# Build for Windows
echo ""
echo -e "${BLUE}🪟 Building for Windows (x64)...${NC}"
pkg ultimate-server.cjs \
    --compress GZip \
    --targets node18-win-x64 \
    -o dist/BLOOMCRAWLER-RIIS-Ultimate-Windows.exe

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Windows build successful${NC}"
    ls -lh dist/BLOOMCRAWLER-RIIS-Ultimate-Windows.exe
else
    echo -e "${RED}❌ Windows build failed${NC}"
fi

# Build for Linux
echo ""
echo -e "${BLUE}🐧 Building for Linux (x64)...${NC}"
pkg ultimate-server.cjs \
    --compress GZip \
    --targets node18-linux-x64 \
    -o dist/BLOOMCRAWLER-RIIS-Ultimate-Linux

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Linux build successful${NC}"
    chmod +x dist/BLOOMCRAWLER-RIIS-Ultimate-Linux
    ls -lh dist/BLOOMCRAWLER-RIIS-Ultimate-Linux
else
    echo -e "${RED}❌ Linux build failed${NC}"
fi

# Build for macOS
echo ""
echo -e "${BLUE}🍎 Building for macOS (x64)...${NC}"
pkg ultimate-server.cjs \
    --compress GZip \
    --targets node18-macos-x64 \
    -o dist/BLOOMCRAWLER-RIIS-Ultimate-macOS

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ macOS build successful${NC}"
    chmod +x dist/BLOOMCRAWLER-RIIS-Ultimate-macOS
    ls -lh dist/BLOOMCRAWLER-RIIS-Ultimate-macOS
else
    echo -e "${RED}❌ macOS build failed${NC}"
fi

# Create README for dist
echo ""
echo -e "${BLUE}📝 Creating distribution README...${NC}"
cat > dist/README.txt << 'EOF'
BLOOMCRAWLER RIIS - Ultimate Edition
Version: 2.0.0
=====================================

EXECUTABLES:
- BLOOMCRAWLER-RIIS-Ultimate-Windows.exe  (Windows 10/11, 64-bit)
- BLOOMCRAWLER-RIIS-Ultimate-Linux        (Linux x64)
- BLOOMCRAWLER-RIIS-Ultimate-macOS        (macOS 10.15+, x64)

USAGE:
------
Windows:
  Double-click the .exe file or run from command line:
  > BLOOMCRAWLER-RIIS-Ultimate-Windows.exe

Linux:
  $ chmod +x BLOOMCRAWLER-RIIS-Ultimate-Linux
  $ ./BLOOMCRAWLER-RIIS-Ultimate-Linux

macOS:
  $ chmod +x BLOOMCRAWLER-RIIS-Ultimate-macOS
  $ ./BLOOMCRAWLER-RIIS-Ultimate-macOS

ACCESS:
-------
After starting, open your web browser and navigate to:
  http://localhost:5000

If port 5000 is in use, the server will automatically find the next available port.

FEATURES:
---------
✓ Real-time threat detection
✓ Advanced dark web crawling
✓ AI image forensics
✓ Multi-threaded swarm crawler
✓ Predictive analytics
✓ Graph database
✓ SOAR automation
✓ WebSocket real-time updates
✓ Ultimate dashboard with charts

SYSTEM REQUIREMENTS:
--------------------
- Minimum: 2GB RAM, 500MB disk space
- Recommended: 4GB RAM, 2GB disk space
- Network: Internet connection required

SUPPORT:
--------
For issues or questions, contact the BLOOMCRAWLER team.

© 2024 BLOOMCRAWLER RIIS - Ultimate Edition
EOF

echo -e "${GREEN}✅ Distribution README created${NC}"

# Summary
echo ""
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Build Complete!${NC}"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📦 Executables created in: ./dist/"
echo ""
ls -lh dist/ | grep -E "BLOOMCRAWLER|README"
echo ""
echo "🚀 To test locally:"
echo "   ./dist/BLOOMCRAWLER-RIIS-Ultimate-Linux"
echo ""
echo "════════════════════════════════════════════════════════════════"
