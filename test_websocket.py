#!/usr/bin/env python3
"""Test WebSocket connection to BLOOMCRAWLER RIIS server"""

import socketio
import requests
import sys
import time

def test_http_server():
    """Test if HTTP server is running"""
    print("🔍 Testing HTTP server...")
    try:
        response = requests.get('http://localhost:5000/health', timeout=2)
        if response.status_code == 200:
            print(f"✅ HTTP Server is RUNNING")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ HTTP Server returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ HTTP Server is NOT RUNNING - Connection refused")
        print("   Make sure to run: python bloomcrawler_riis_complete.py")
        return False
    except Exception as e:
        print(f"❌ HTTP Server test failed: {e}")
        return False

def test_socketio_endpoint():
    """Test SocketIO endpoint availability"""
    print("\n🔍 Testing SocketIO endpoint...")
    try:
        # Try to access socket.io endpoint
        response = requests.get('http://localhost:5000/socket.io/', timeout=2)
        print(f"✅ SocketIO endpoint is accessible")
        print(f"   Status: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Cannot reach SocketIO endpoint")
        return False
    except Exception as e:
        print(f"⚠️  SocketIO endpoint test: {e}")
        return False

def test_websocket_connection():
    """Test WebSocket connection using python-socketio client"""
    print("\n🔍 Testing WebSocket connection...")
    
    try:
        # Create SocketIO client
        sio = socketio.Client()
        
        connection_success = [False]
        messages_received = []
        
        @sio.on('connect')
        def on_connect():
            print("✅ WebSocket CONNECTED successfully!")
            connection_success[0] = True
        
        @sio.on('disconnect')
        def on_disconnect():
            print("❌ WebSocket DISCONNECTED")
        
        @sio.on('system-status')
        def on_system_status(data):
            print(f"📨 Received system-status: {data}")
            messages_received.append(('system-status', data))
        
        @sio.on('system-metrics')
        def on_system_metrics(data):
            print(f"📨 Received system-metrics: {data}")
            messages_received.append(('system-metrics', data))
        
        @sio.on('crawler-activity')
        def on_crawler_activity(data):
            print(f"📨 Received crawler-activity: {data}")
            messages_received.append(('crawler-activity', data))
        
        # Try to connect
        print("   Attempting connection to http://localhost:5000...")
        
        try:
            sio.connect('http://localhost:5000', wait_timeout=5)
            print("   ✅ Connection established!")
            
            # Wait a moment for messages
            print("   Waiting for initial messages...")
            time.sleep(2)
            
            # Check if we received messages
            if messages_received:
                print(f"✅ Received {len(messages_received)} message(s):")
                for msg_type, data in messages_received:
                    print(f"   - {msg_type}")
            else:
                print("⚠️  No messages received yet (may be normal)")
            
            # Send a test event
            print("   Sending monitor-crawler event...")
            sio.emit('monitor-crawler')
            time.sleep(1)
            
            # Disconnect
            sio.disconnect()
            
            return connection_success[0]
            
        except socketio.exceptions.ConnectionError as e:
            print(f"❌ WebSocket connection FAILED: {e}")
            print("   Server may not be running or SocketIO not initialized")
            return False
        
    except ImportError:
        print("❌ python-socketio not installed")
        print("   Install with: pip install python-socketio")
        return False
    except Exception as e:
        print(f"❌ WebSocket test error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("="*70)
    print("🧪 BLOOMCRAWLER RIIS - WebSocket Connection Test")
    print("="*70)
    print()
    
    # Test HTTP server first
    http_ok = test_http_server()
    
    if not http_ok:
        print("\n❌ Cannot proceed with WebSocket test - HTTP server is not running")
        print("\n💡 To start the server, run:")
        print("   python bloomcrawler_riis_complete.py")
        sys.exit(1)
    
    # Test SocketIO endpoint
    test_socketio_endpoint()
    
    # Test WebSocket connection
    ws_ok = test_websocket_connection()
    
    print("\n" + "="*70)
    if ws_ok:
        print("✅ WebSocket Test: PASSED")
        print("   Your WebSocket server is working correctly!")
    else:
        print("❌ WebSocket Test: FAILED")
        print("   Check server logs for more information")
    print("="*70)
    
    return 0 if ws_ok else 1

if __name__ == "__main__":
    sys.exit(main())

