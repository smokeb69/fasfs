# 🚀 BLOOMCRAWLER RIIS - Single Executable Solution

Your website project has been configured to build as a **single self-contained executable** that runs anywhere without installation!

## ✅ What Was Created

1. **`standalone-server.cjs`** - Enhanced server with:
   - Auto port detection (finds available port automatically)
   - All HTML files bundled
   - Socket.IO real-time updates
   - Complete API endpoints
   - Dynamic port injection into HTML

2. **`build-executable.bat`** - Windows build script (one-click build)

3. **`BUILD_INSTRUCTIONS.md`** - Detailed build guide

4. **`STANDALONE_README.md`** - Quick start guide

5. **Updated `package.json`** - Configured for `pkg` bundling

## 🏗️ How to Build

### Option 1: Use the Build Script (Easiest)
```bash
build-executable.bat
```

### Option 2: Manual Build
```bash
npm install
npm run build:exe:win
```

The executable will be created in `dist/bloomcrawler.exe`

## 🎯 Features

✅ **Single File** - One `.exe` file contains everything
✅ **No Installation** - Just run it anywhere
✅ **Auto Port Detection** - Automatically finds available port (5000, 5001, etc.)
✅ **Self-Contained** - No Node.js installation needed
✅ **Portable** - Run from USB, network drive, anywhere
✅ **All Features** - Web server, WebSocket, APIs, dashboard

## 📦 What's Bundled

- Node.js runtime (embedded)
- Express web server
- Socket.IO for real-time updates
- All HTML dashboard files
- All API endpoints
- No external dependencies needed

## 🚀 Running the Executable

1. **Double-click** `dist/bloomcrawler.exe`
2. **Wait** for startup message
3. **Open browser** to the URL shown (e.g., http://localhost:5000)
4. **Done!** - Dashboard is running

## 🔧 Port Configuration

- **Default**: Port 5000
- **Auto-detection**: If 5000 is busy, tries 5001, 5002, etc.
- **Console shows**: The actual port being used

## 📝 API Endpoints Available

All endpoints work out of the box:
- `/` - Main dashboard
- `/health` - Health check
- `/api/crawler/stats` - Crawler statistics
- `/api/threats/live` - Live threat monitoring
- `/api/bloom/stats` - Bloom engine stats
- `/api/swarm/stats` - Swarm crawler stats
- `/api/darkweb/targets` - Dark web targets
- ... and many more

## 🌐 Cross-Platform Support

Build for different platforms:
```bash
# Windows 64-bit
npm run build:exe:win

# All platforms
npm run build:exe:all
```

## 📄 File Structure

```
Website_Project/
├── standalone-server.cjs       # Main standalone server
├── build-executable.bat       # Windows build script
├── BUILD_INSTRUCTIONS.md      # Detailed build guide
├── STANDALONE_README.md       # Quick start guide
├── package.json               # Updated with pkg config
└── dist/                      # Output directory (created after build)
    └── bloomcrawler.exe       # Your executable
```

## 🎉 Next Steps

1. **Build the executable**:
   ```bash
   build-executable.bat
   ```

2. **Test it**:
   ```bash
   dist\bloomcrawler.exe
   ```

3. **Distribute**:
   - Copy `dist/bloomcrawler.exe` anywhere
   - Run it on any Windows machine
   - No installation needed!

## 🔍 Troubleshooting

**Build fails?**
- Make sure Node.js 18+ is installed
- Run `npm install` first
- Check error messages in console

**Executable won't run?**
- Check console for error messages
- Make sure you have execute permissions
- Check if antivirus is blocking it

**Port issues?**
- The executable auto-detects available ports
- Check console output for actual port number
- Firewall might need to allow the connection

## 💡 Technical Details

- **Tool**: `pkg` (Node.js executable packager)
- **Runtime**: Node.js 18 embedded
- **Compression**: GZip enabled
- **Size**: ~40-60 MB (includes Node.js runtime)
- **Port**: Auto-detected starting from 5000

## 📚 Documentation

- See `BUILD_INSTRUCTIONS.md` for detailed build guide
- See `STANDALONE_README.md` for usage instructions

---

**You're all set!** Build and run your single executable anywhere! 🎊

