#!/usr/bin/env python3
"""Test imports for BLOOMCRAWLER RIIS"""

print("Testing Python imports...")

try:
    import sys
    print("✓ sys")
except ImportError as e:
    print(f"✗ sys: {e}")

try:
    import json
    print("✓ json")
except ImportError as e:
    print(f"✗ json: {e}")

try:
    import threading
    print("✓ threading")
except ImportError as e:
    print(f"✗ threading: {e}")

try:
    import requests
    print("✓ requests")
except ImportError as e:
    print(f"✗ requests: {e}")

try:
    from flask import Flask
    print("✓ flask")
except ImportError as e:
    print(f"✗ flask: {e}")

try:
    from flask_socketio import SocketIO
    print("✓ flask-socketio")
except ImportError as e:
    print(f"✗ flask-socketio: {e}")

try:
    import eventlet
    print("✓ eventlet")
except ImportError as e:
    print(f"✗ eventlet: {e}")

try:
    from bs4 import BeautifulSoup
    print("✓ beautifulsoup4")
except ImportError as e:
    print(f"✗ beautifulsoup4: {e}")

try:
    import tkinter as tk
    print("✓ tkinter")
except ImportError as e:
    print(f"✗ tkinter: {e}")

try:
    import matplotlib.pyplot as plt
    print("✓ matplotlib")
except ImportError as e:
    print(f"✗ matplotlib: {e}")

try:
    import networkx as nx
    print("✓ networkx")
except ImportError as e:
    print(f"✗ networkx: {e}")

try:
    from sklearn.ensemble import RandomForestClassifier
    print("✓ scikit-learn")
except ImportError as e:
    print(f"✗ scikit-learn: {e}")

try:
    import pandas as pd
    print("✓ pandas")
except ImportError as e:
    print(f"✗ pandas: {e}")

try:
    import numpy as np
    print("✓ numpy")
except ImportError as e:
    print(f"✗ numpy: {e}")

print("\nImport test complete!")
