import re
from ...config.brands import LEGITIMATE_BRANDS

def check_sender_spoofing(sender: str, reply_to: str = None) -> dict:
    """
    Analyzes the sender address for spoofing, brand impersonation, and mismatches.
    """
    if not sender:
        return {"detected": False}

    sender_lower = sender.lower()

    # 1. Reply-To Mismatch
    if reply_to and reply_to.lower() != sender_lower:
        return {
            "detected": True,
            "type": "mismatch",
            "reason": f"Sender '{sender}' and Reply-To '{reply_to}' do not match"
        }

    # 2. Brand Impersonation in Sender
    # e.g., support@amazon-security.com
    for brand in LEGITIMATE_BRANDS:
        if brand in sender_lower:
            # Check if it's actually the legitimate domain (simple check)
            # Legitimate would be something like @amazon.com
            is_legit = re.search(rf'@{brand}\.[a-z]{{2,}}$', sender_lower)
            if not is_legit:
                return {
                    "detected": True,
                    "type": "impersonation",
                    "reason": f"Sender address '{sender}' impersonates brand '{brand}'"
                }

    # 3. Free Provider pretending to be Corporate
    free_providers = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
    is_free = any(prov in sender_lower for prov in free_providers)
    if is_free:
        # Check if the display name looks like a company
        # e.g., "Amazon Support <scammer@gmail.com>"
        display_name_match = re.search(r'^"?(.*?)"?\s*<', sender)
        if display_name_match:
            display_name = display_name_match.group(1).lower()
            if any(brand in display_name for brand in LEGITIMATE_BRANDS):
                 return {
                    "detected": True,
                    "type": "display_name_spoofing",
                    "reason": f"Display name '{display_name}' uses brand name with free email provider"
                }

    return {"detected": False}
