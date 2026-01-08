#!/usr/bin/env python3
"""
Test script for the living dashboard and webhook functionality
"""

import requests
import json
import time
import threading

def test_webhook_endpoint():
    """Test webhook functionality"""
    print("🧪 Testing webhook endpoint...")

    # Test data
    webhook_data = {
        "name": "Test Webhook",
        "eventType": "threat-detected",
        "url": "https://httpbin.org/post",
        "method": "POST"
    }

    try:
        # Create webhook
        response = requests.post('http://localhost:5000/api/webhooks/create', json=webhook_data)
        if response.status_code == 200:
            print("✅ Webhook creation successful")
            webhook_id = response.json().get('id')

            # Test webhook
            test_response = requests.post(f'http://localhost:5000/api/webhooks/test/{webhook_id}')
            if test_response.status_code == 200:
                print("✅ Webhook test successful")
            else:
                print(f"❌ Webhook test failed: {test_response.status_code}")

            # Delete webhook
            delete_response = requests.delete(f'http://localhost:5000/api/webhooks/delete/{webhook_id}')
            if delete_response.status_code == 200:
                print("✅ Webhook deletion successful")
        else:
            print(f"❌ Webhook creation failed: {response.status_code}")

    except Exception as e:
        print(f"❌ Webhook test error: {e}")

def test_container_system():
    """Test container system endpoints"""
    print("🌐 Testing container system...")

    try:
        # Test container creation
        container_data = {
            "name": "Test Container",
            "type": "dashboard"
        }

        response = requests.post('http://localhost:5000/api/containers/create', json=container_data)
        if response.status_code == 200:
            print("✅ Container creation successful")
        else:
            print(f"⚠️  Container creation returned: {response.status_code}")

        # Test container listing
        list_response = requests.get('http://localhost:5000/api/containers/list')
        if list_response.status_code == 200:
            containers = list_response.json()
            print(f"✅ Container listing successful: {len(containers)} containers")
        else:
            print(f"⚠️  Container listing returned: {list_response.status_code}")

    except Exception as e:
        print(f"❌ Container test error: {e}")

def test_system_health():
    """Test system health"""
    print("🏥 Testing system health...")

    try:
        response = requests.get('http://localhost:5000/health')
        if response.status_code == 200:
            print("✅ System health check passed")
        else:
            print(f"❌ System health check failed: {response.status_code}")

    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_living_dashboard():
    """Test the living dashboard functionality"""
    print("🎛️ Testing living dashboard...")

    # Wait a bit for system to initialize
    time.sleep(2)

    try:
        # Test main dashboard
        response = requests.get('http://localhost:5000/')
        if response.status_code == 200:
            print("✅ Main dashboard accessible")

            # Check if living container system is present
            if 'living-container-system' in response.text:
                print("✅ Living container system detected in dashboard")
            else:
                print("⚠️  Living container system not detected")

            # Check if webhook system is present
            if 'webhook-management-system' in response.text:
                print("✅ Webhook management system detected")
            else:
                print("⚠️  Webhook management system not detected")

        else:
            print(f"❌ Dashboard not accessible: {response.status_code}")

    except Exception as e:
        print(f"❌ Dashboard test error: {e}")

def main():
    print("🚀 Starting BLOOMCRAWLER RIIS Living Dashboard Test")
    print("=" * 60)

    # Test system health first
    test_system_health()

    # Test living dashboard
    test_living_dashboard()

    # Test webhook system
    test_webhook_endpoint()

    # Test container system
    test_container_system()

    print("=" * 60)
    print("✅ All tests completed!")
    print("\n🌐 Living dashboard should now be available at:")
    print("   http://localhost:5000")
    print("\n🔗 Test the webhook system by:")
    print("   1. Opening the dashboard in your browser")
    print("   2. Navigating to the Webhooks tab")
    print("   3. Creating and testing webhooks")
    print("\n🌐 Test the living container system by:")
    print("   1. Clicking on different navigation tabs")
    print("   2. Creating new containers")
    print("   3. Switching between container views")

if __name__ == "__main__":
    main()
