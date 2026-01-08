#!/usr/bin/env python3
"""Quick test for the simple dashboard server"""

import requests
import time

def test_server():
    print("🧪 Testing Simple Dashboard Server...")

    try:
        # Test health endpoint
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Server is healthy!")
            print(f"   Status: {data['status']}")
            print(f"   NPM Running: {data['npm_running']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server on localhost:5000")
        print("💡 Make sure to run: python simple_dashboard_server.py")
        return False
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False

def test_dashboard():
    print("\n🌐 Testing Dashboard Access...")

    try:
        response = requests.get('http://localhost:5000/', timeout=5)
        if response.status_code == 200:
            print("✅ Dashboard is accessible!")
            if 'BLOOMCRAWLER RIIS' in response.text:
                print("✅ Dashboard contains expected content")
                return True
            else:
                print("⚠️  Dashboard content may be incorrect")
                return False
        else:
            print(f"❌ Dashboard access failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Dashboard test error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 BLOOMCRAWLER RIIS Dashboard Test")
    print("=" * 40)

    server_ok = test_server()
    dashboard_ok = test_dashboard()

    print("\n" + "=" * 40)
    if server_ok and dashboard_ok:
        print("✅ All tests passed!")
        print("\n🌐 Open your browser to: http://localhost:5000")
        print("🚀 Click 'Start BLOOMCRAWLER' to see npm start live!")
    else:
        print("❌ Some tests failed")
        print("💡 Make sure the server is running first")