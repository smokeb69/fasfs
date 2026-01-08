#!/usr/bin/env python3
"""Test the BLOOMCRAWLER dashboard"""

import requests
import time
import json

def test_dashboard():
    print("🧪 Testing BLOOMCRAWLER RIIS Dashboard")
    print("=" * 50)

    try:
        # Test health endpoint
        print("📡 Testing health endpoint...")
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            health = response.json()
            print(f"✅ Health: {health['status']}")
            print(f"   Server: {health['server']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return

        # Test logs endpoint
        print("\n📋 Testing logs endpoint...")
        response = requests.get('http://localhost:5000/api/logs', timeout=5)
        if response.status_code == 200:
            logs = response.json()
            print(f"✅ Logs: {len(logs['logs'])} messages")
            if logs['logs']:
                print(f"   Latest: {logs['logs'][-1]['message']}")
        else:
            print(f"❌ Logs check failed: {response.status_code}")

        # Test status endpoint
        print("\n📊 Testing status endpoint...")
        response = requests.get('http://localhost:5000/api/status', timeout=5)
        if response.status_code == 200:
            status = response.json()
            print(f"✅ Status: {status['status']}")
        else:
            print(f"❌ Status check failed: {response.status_code}")

        # Test starting BLOOMCRAWLER
        print("\n🚀 Testing BLOOMCRAWLER start...")
        response = requests.post('http://localhost:5000/api/npm/start', timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✅ BLOOMCRAWLER started: {result['message']}")
            else:
                print(f"❌ Start failed: {result['error']}")
        else:
            print(f"❌ Start request failed: {response.status_code}")

        # Wait a moment and check logs again
        print("\n⏳ Waiting for logs to update...")
        time.sleep(3)

        response = requests.get('http://localhost:5000/api/logs', timeout=5)
        if response.status_code == 200:
            logs = response.json()
            print(f"📋 Logs after start: {len(logs['logs'])} messages")
            # Show last 5 messages
            for log in logs['logs'][-5:]:
                print(f"   [{log['timestamp']}] {log['message']}")

        print("\n" + "=" * 50)
        print("🎉 Dashboard test complete!")
        print("🌐 Open http://localhost:5000 in your browser")

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to dashboard server")
        print("💡 Make sure to run: python basic_dashboard.py")
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    test_dashboard()
