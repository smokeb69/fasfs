# Building BLOOMCRAWLER RIIS Standalone Executable

This guide explains how to build a single self-contained executable that can run anywhere without installation.

## Prerequisites

1. **Node.js 18+** - Download from https://nodejs.org/
2. **npm** - Comes with Node.js

## Quick Build (Windows)

Simply run:
```bash
build-executable.bat
```

This will:
- Install dependencies if needed
- Build the executable to `dist/bloomcrawler.exe`
- Show you where to find it

## Manual Build

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Executable

**Windows (64-bit):**
```bash
npm run build:exe:win
```

**All Platforms:**
```bash
npm run build:exe:all
```

**Custom Build:**
```bash
npx pkg standalone-server.cjs --compress GZip --targets node18-win-x64 -o dist/bloomcrawler.exe
```

## Output

The executable will be created in the `dist/` directory:
- **Windows**: `bloomcrawler.exe`
- **Linux**: `bloomcrawler`
- **macOS**: `bloomcrawler`

## Features

✅ **Self-contained** - No installation required
✅ **Portable** - Run from anywhere (USB drive, network share, etc.)
✅ **Auto-port detection** - Automatically finds available port starting from 5000
✅ **No dependencies** - All files bundled inside executable
✅ **Cross-platform** - Build for Windows, Linux, or macOS

## Running the Executable

### Windows
1. Double-click `bloomcrawler.exe`
2. Or run from command line: `bloomcrawler.exe`
3. The server will start and show you the URL (usually http://localhost:5000)

### Linux/macOS
1. Make executable: `chmod +x bloomcrawler`
2. Run: `./bloomcrawler`
3. The server will start and show you the URL

## How It Works

1. The executable contains:
   - Node.js runtime
   - All dependencies
   - HTML dashboard files
   - Server code

2. When you run it:
   - Finds an available port (checks 5000, 5001, 5002, etc.)
   - Starts Express web server
   - Starts Socket.IO for real-time updates
   - Serves the dashboard HTML

3. Access:
   - Open browser to the URL shown in the console
   - Default: http://localhost:5000
   - Or http://127.0.0.1:PORT

## Troubleshooting

### "Port already in use" error
- The executable will automatically try the next port
- Or manually stop the process using that port

### Executable won't run
- Make sure you have admin/execute permissions
- Check if antivirus is blocking it
- Try running from command line to see error messages

### Can't find HTML files
- All HTML files are bundled inside the executable
- The server automatically finds them
- If issues occur, check the console output

## Advanced Options

### Custom Port
Modify `standalone-server.cjs` to set a specific port:
```javascript
PORT = 8080; // Change this
```

### Custom Build Targets
```bash
# Only Windows 64-bit
npx pkg standalone-server.cjs --targets node18-win-x64

# Multiple platforms
npx pkg standalone-server.cjs --targets node18-win-x64,node18-linux-x64,node18-macos-x64
```

### Compression
The build uses GZip compression by default. To disable:
```bash
npx pkg standalone-server.cjs --targets node18-win-x64
```

## File Size

The executable will be approximately:
- **Windows**: 40-60 MB (compressed)
- **Linux**: 40-60 MB (compressed)
- **macOS**: 50-70 MB (compressed)

This includes:
- Node.js runtime
- All npm dependencies
- HTML files
- Server code

## Distribution

You can distribute the single executable file:
- Copy to USB drive
- Email the file
- Host on website
- Include in deployment packages

No installation, no dependencies, just run!

