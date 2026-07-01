import re
import ipaddress

def check_ip_address(hostname: str) -> dict:
    if not hostname:
        return {"detected": False}

    # Standard IPv4/IPv6
    try:
        ipaddress.ip_address(hostname)
        return {
            "detected": True,
            "type": "Standard IP",
            "reason": "URL uses a raw IP address instead of a domain name"
        }
    except ValueError:
        pass

    # Hexadecimal IP (e.g., 0x7f.0x0.0x0.0x1)
    if re.match(r'^(0x[0-9a-fA-F]{1,2}\.){3}0x[0-9a-fA-F]{1,2}$', hostname):
        return {
            "detected": True,
            "type": "Hexadecimal IP",
            "reason": "URL uses an obfuscated hexadecimal IP address"
        }

    # Octal IP (e.g., 0177.0000.0000.0001)
    if re.match(r'^(0[0-7]{3}\.){3}0[0-7]{3}$', hostname):
        return {
            "detected": True,
            "type": "Octal IP",
            "reason": "URL uses an obfuscated octal IP address"
        }

    # Decimal/Dword IP (e.g., 2130706433)
    if hostname.isdigit() and len(hostname) > 7:
        try:
            val = int(hostname)
            if val <= 4294967295: # Max uint32
                return {
                    "detected": True,
                    "type": "Decimal IP",
                    "reason": "URL uses an obfuscated decimal (DWORD) IP address"
                }
        except ValueError:
            pass

    return {"detected": False}
