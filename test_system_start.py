#!/usr/bin/env python3
"""Test BLOOMCRAWLER RIIS system startup without GUI"""

import sys
import os
import traceback

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing system startup...")

    # Import the main system
    from bloomcrawler_riis_complete import BloomCrawlerSystem

    print("✓ System imported successfully")

    # Create system instance
    system = BloomCrawlerSystem()
    print("✓ System instance created")

    # Initialize system
    print("Initializing system...")
    result = system.initialize_system()
    if result:
        print("✓ System initialized successfully")
    else:
        print("✗ System initialization failed")
        sys.exit(1)

    # Test autonomous operations start (but don't actually run them)
    print("Testing autonomous operations setup...")
    try:
        # Just test that the methods exist and can be called
        system.crawler.initialize()
        print("✓ Crawler initialized")

        system.threat_detector.initialize()
        print("✓ Threat detector initialized")

        system.bloom_engine.initialize()
        print("✓ Bloom engine initialized")

        system.swarm_crawler.initialize()
        print("✓ Swarm crawler initialized")

        print("✓ All components initialized successfully")

    except Exception as e:
        print(f"✗ Component initialization failed: {e}")
        traceback.print_exc()
        sys.exit(1)

    print("\n🎉 System startup test completed successfully!")
    print("The system should work when started from the GUI.")

except Exception as e:
    print(f"✗ System startup test failed: {e}")
    traceback.print_exc()
    sys.exit(1)
