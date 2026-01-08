#!/usr/bin/env python3
"""Test script for the BLOOMCRAWLER dashboard server"""

import os
import requests
import time
import subprocess

def check_files():
    """Check if required files exist"""
    print("🔍 Checking required files...")

    files_to_check = [
        'package.json',
        'minimal_server.py',
        'bloomcrawler-dashboard.html',
        'system_verification.js'
    ]

    for file in files_to_check:
        exists = os.path.exists(file)
        status = "✅" if exists else "❌"
        print(f"  {status} {file}: {'Found' if exists else 'Missing'}")

    return all(os.path.exists(f) for f in files_to_check)

def test_server():
    """Test the server connection"""
    print("\n🌐 Testing server connection...")

    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Server is responding")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   System: {data.get('server', 'unknown')}")
            return True
        else:
            print(f"❌ Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server on localhost:5000")
        print("💡 Make sure to run: python minimal_server.py")
        return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def test_npm():
    """Test npm availability"""
    print("\n📦 Testing npm availability...")

    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ npm available: v{result.stdout.strip()}")
            return True
        else:
            print("❌ npm not working properly")
            return False
    except FileNotFoundError:
        print("❌ npm command not found")
        return False
    except Exception as e:
        print(f"❌ npm test error: {e}")
        return False

def main():
    print("🚀 BLOOMCRAWLER RIIS Server Test")
    print("=" * 50)

    # Check files
    files_ok = check_files()

    # Test npm
    npm_ok = test_npm()

    # Test server
    server_ok = test_server()

    print("\n" + "=" * 50)
    print("📊 TEST RESULTS:")
    print(f"  Files: {'✅ OK' if files_ok else '❌ Issues'}")
    print(f"  NPM: {'✅ OK' if npm_ok else '❌ Issues'}")
    print(f"  Server: {'✅ OK' if server_ok else '❌ Issues'}")

    if files_ok and npm_ok and server_ok:
        print("\n🎉 All systems ready!")
        print("🌐 Open http://localhost:5000 and click 'Start BLOOMCRAWLER'")
        print("📋 You should see npm start output in the live logs")
    else:
        print("\n⚠️  Issues detected:")
        if not files_ok:
            print("   - Check that all required files are present")
        if not npm_ok:
            print("   - Install Node.js and npm")
        if not server_ok:
            print("   - Start the server with: python minimal_server.py")

if __name__ == "__main__":
    main()
