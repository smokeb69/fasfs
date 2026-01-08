#!/usr/bin/env python3
"""
BLOOMCRAWLER RIIS - Python Setup Test
Tests all required dependencies and basic functionality
"""

import sys
import importlib
import subprocess

def test_import(module_name, package_name=None):
    """Test if a module can be imported"""
    try:
        importlib.import_module(module_name)
        print(f"✅ {module_name} - OK")
        return True
    except ImportError as e:
        print(f"❌ {module_name} - FAILED: {e}")
        if package_name:
            print(f"   Install with: pip install {package_name}")
        return False

def test_python_version():
    """Test Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - FAILED")
        print("   Requires Python 3.8+")
        return False

def test_pip_command():
    """Test pip command availability"""
    try:
        result = subprocess.run([sys.executable, '-m', 'pip', '--version'],
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ pip - OK")
            return True
        else:
            print("❌ pip - FAILED")
            return False
    except Exception as e:
        print(f"❌ pip - FAILED: {e}")
        return False

def main():
    """Main test function"""
    print("🔥 BLOOMCRAWLER RIIS - Python Setup Test")
    print("=" * 50)
    print()

    # Test Python version
    python_ok = test_python_version()
    print()

    # Test pip
    pip_ok = test_pip_command()
    print()

    # Test core dependencies
    print("Testing Core Dependencies:")
    print("-" * 30)

    dependencies = [
        ('flask', 'flask'),
        ('flask_socketio', 'flask-socketio'),
        ('numpy', 'numpy'),
        ('pandas', 'pandas'),
        ('sklearn', 'scikit-learn'),
        ('matplotlib', 'matplotlib'),
        ('plotly', 'plotly'),
        ('requests', 'requests'),
        ('bs4', 'beautifulsoup4'),
        ('psutil', 'psutil')
    ]

    failed_deps = []
    for module, package in dependencies:
        if not test_import(module, package):
            failed_deps.append(package)

    print()
    print("Testing Optional Dependencies:")
    print("-" * 35)

    optional_deps = [
        ('tkinter', None),  # Built-in
        ('networkx', 'networkx'),
        ('gputil', 'gputil')
    ]

    for module, package in optional_deps:
        test_import(module, package)

    print()
    print("=" * 50)

    if python_ok and pip_ok and not failed_deps:
        print("🎉 All critical dependencies are working!")
        print("🚀 You can now run: python bloomcrawler_riis_complete.py")
        print("🌐 Web Dashboard: http://localhost:5000")
        print("🖥️  GUI Dashboard: Will open automatically")
        return True
    else:
        print("❌ Setup issues detected:")
        if not python_ok:
            print("   - Upgrade to Python 3.8+")
        if not pip_ok:
            print("   - Install pip package manager")
        if failed_deps:
            print(f"   - Install missing packages: pip install {' '.join(failed_deps)}")

        print()
        print("Run this script again after fixing issues.")
        return False

if __name__ == "__main__":
    success = main()
    input("\nPress Enter to exit...")
    sys.exit(0 if success else 1)
