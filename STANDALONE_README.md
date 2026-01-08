# BLOOMCRAWLER RIIS - Standalone Executable

## Quick Start

### Building the Executable

**Windows:**
```bash
build-executable.bat
```

**Manual:**
```bash
npm install
npm run build:exe:win
```

### Running the Executable

1. **Double-click** `dist/bloomcrawler.exe` (Windows)
2. **Or run from terminal**: `dist/bloomcrawler.exe`
3. **Wait for startup** - The server will find an available port automatically
4. **Open browser** to the URL shown (usually http://localhost:5000)

## Features

✅ **Single File** - Everything bundled in one executable
✅ **No Installation** - Just run it anywhere
✅ **Auto Port Detection** - Finds available port automatically
✅ **Self-Contained** - No external dependencies needed
✅ **Portable** - Run from USB, network drive, anywhere

## What's Included

- Web server (Express.js)
- Real-time WebSocket (Socket.IO)
- Dashboard HTML files
- All API endpoints
- Auto port detection

## Port Configuration

The server automatically finds an available port starting from 5000.

If port 5000 is busy, it will try:
- 5001
- 5002
- 5003
- ... and so on

The console will show you which port it's using.

## Troubleshooting

**Port already in use?**
- The executable automatically finds the next available port
- Check the console output for the actual port number

**Executable won't start?**
- Make sure you have execute permissions
- Try running from command line to see error messages
- Check if antivirus is blocking it

**Can't connect to dashboard?**
- Check the port number shown in console
- Make sure firewall allows the connection
- Try http://127.0.0.1:PORT instead of localhost

## File Structure

```
Website_Project/
├── standalone-server.cjs    # Main server file
├── build-executable.bat     # Windows build script
├── BUILD_INSTRUCTIONS.md    # Detailed build guide
├── package.json             # Node.js config
└── dist/                    # Output directory
    └── bloomcrawler.exe     # Your executable
```

## API Endpoints

Once running, these endpoints are available:

- `GET /` - Main dashboard
- `GET /health` - Health check
- `GET /api/crawler/stats` - Crawler statistics
- `GET /api/threats/live` - Live threat data
- `GET /api/bloom/stats` - Bloom engine stats
- `GET /api/swarm/stats` - Swarm crawler stats
- `GET /api/darkweb/targets` - Dark web targets
- ... and more

## Stopping the Server

Press `Ctrl+C` in the console window, or close the window.

## Distribution

You can distribute the single `.exe` file:
- Copy to USB drive
- Email to others
- Host on website
- Include in deployment packages

No installation needed - just run!

