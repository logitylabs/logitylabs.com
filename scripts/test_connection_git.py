# scripts/test_connection.py

# This script tests the internet connection by attempting to connect to GitHub.
# It also displays the current proxy settings being used and configures git accordingly.
# Useful for setting the git config before syncing with github issues during development and deployment.

import requests
import subprocess
import sys
import os
import platform
from urllib.request import getproxies

def run_git_command(command, suppress_errors=False):
    """Execute a git command and handle potential errors"""
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        if not suppress_errors:
            print(f"Successfully executed: {' '.join(command)}")
        return result.stdout.strip() if result.stdout else ""
    except subprocess.CalledProcessError as e:
        if not suppress_errors:
            print(f"Error executing git command: {e}")
            print(f"Error output: {e.stderr}")
        return None

def get_system_proxy_settings():
    """Get proxy settings from system environment variables and platform-specific sources"""
    proxy_settings = {}
    
    # Get proxy settings from environment variables (works on both Linux and Windows)
    env_proxies = getproxies()
    
    # Check common environment variables
    for protocol in ['http', 'https']:
        # Check uppercase and lowercase variants
        for var_name in [f'{protocol}_proxy', f'{protocol.upper()}_PROXY']:
            if var_name in os.environ:
                proxy_settings[protocol] = os.environ[var_name]
                break
        
        # If not found in env vars, check urllib's getproxies result
        if protocol not in proxy_settings and protocol in env_proxies:
            proxy_settings[protocol] = env_proxies[protocol]
    
    # Platform-specific proxy detection
    system = platform.system().lower()
    
    if system == 'windows':
        # On Windows, try to get proxy from registry if available
        try:
            import winreg  # type: ignore
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER,  # type: ignore
                              r"Software\Microsoft\Windows\CurrentVersion\Internet Settings") as key:
                proxy_enable, _ = winreg.QueryValueEx(key, "ProxyEnable")  # type: ignore
                if proxy_enable:
                    proxy_server, _ = winreg.QueryValueEx(key, "ProxyServer")  # type: ignore
                    if proxy_server and 'http' not in proxy_settings:
                        # Format proxy URL properly
                        if not proxy_server.startswith('http://'):
                            proxy_server = f"http://{proxy_server}"
                        proxy_settings['http'] = proxy_server
                        proxy_settings['https'] = proxy_server
        except (ImportError, OSError, FileNotFoundError):
            # winreg not available or registry key not found
            pass
    
    elif system == 'linux':
        # On Linux, check additional common proxy environment variables
        for protocol in ['http', 'https']:
            if protocol not in proxy_settings:
                # Check if proxy is set in shell configuration files
                for config_file in ['~/.bashrc', '~/.profile', '~/.zshrc']:
                    try:
                        expanded_path = os.path.expanduser(config_file)
                        if os.path.exists(expanded_path):
                            with open(expanded_path, 'r') as f:
                                content = f.read()
                                for line in content.split('\n'):
                                    if f'export {protocol}_proxy=' in line.lower():
                                        proxy_url = line.split('=', 1)[1].strip().strip('"\'')
                                        if proxy_url:
                                            proxy_settings[protocol] = proxy_url
                                            break
                    except (OSError, IOError):
                        continue
    
    return proxy_settings

def configure_git_proxy(proxy_settings):
    """Configure git proxy settings based on the provided dictionary"""
    if not proxy_settings:
        # If no proxy is needed, unset any existing proxy configurations
        print("No proxy detected - clearing git proxy settings for direct connection")
        # Suppress errors when unsetting non-existent settings
        run_git_command(['git', 'config', '--global', '--unset', 'http.proxy'], suppress_errors=True)
        run_git_command(['git', 'config', '--global', '--unset', 'https.proxy'], suppress_errors=True)
        print("Git proxy settings cleared - direct connection will be used")
        return

    # Set HTTP proxy
    if 'http' in proxy_settings:
        run_git_command(['git', 'config', '--global', 'http.proxy', proxy_settings['http']])
    
    # Set HTTPS proxy
    if 'https' in proxy_settings:
        run_git_command(['git', 'config', '--global', 'https.proxy', proxy_settings['https']])

def test_connection():
    """Test connection to GitHub and configure git proxy settings accordingly"""
    try:
        # Get current proxy settings using improved detection
        proxy_settings = get_system_proxy_settings()
        
        print(f"Running on: {platform.system()} {platform.release()}")
        
        # Print detected proxy settings
        print("\nDetected Proxy Settings:")
        if proxy_settings:
            for protocol, proxy_url in proxy_settings.items():
                print(f"{protocol.upper()} Proxy: {proxy_url}")
        else:
            print("No proxy settings detected - using direct connection")
        
        # Create proxies dict for requests
        proxies = proxy_settings if proxy_settings else None
        
        # Try to connect to GitHub
        print("\nTesting connection to GitHub...")
        response = requests.get('https://github.com', proxies=proxies, timeout=10)
        print(f"Connection successful! Status code: {response.status_code}")
        
        # Configure git based on successful connection
        print("\nConfiguring git settings...")
        configure_git_proxy(proxy_settings)
        
        # Verify git configuration
        print("\nCurrent git proxy configuration:")
        # Suppress errors when getting non-existent settings
        http_proxy = run_git_command(['git', 'config', '--global', '--get', 'http.proxy'], suppress_errors=True)
        https_proxy = run_git_command(['git', 'config', '--global', '--get', 'https.proxy'], suppress_errors=True)
        
        if http_proxy:
            print(f"Git HTTP proxy: {http_proxy}")
        else:
            print("Git HTTP proxy: Not set")
            
        if https_proxy:
            print(f"Git HTTPS proxy: {https_proxy}")
        else:
            print("Git HTTPS proxy: Not set")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"Connection failed: {e}")
        print("This might be due to network issues or incorrect proxy settings")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

if __name__ == '__main__':
    success = test_connection()
    sys.exit(0 if success else 1) 