import re

def check_sender_spoofing(sender: str, reply_to: str) -> dict:
    if not sender:
        return {"detected": False}

    sender = sender.lower()

    # 1. Reply-To Mismatch
    if reply_to and reply_to.lower() != sender:
        # Extract email part from "Name <email@example.com>"
        sender_email = re.search(r'[\w\.-]+@[\w\.-]+', sender)
        reply_email = re.search(r'[\w\.-]+@[\w\.-]+', reply_to.lower())

        if sender_email and reply_email and sender_email.group() != reply_email.group():
            return {
                "detected": True,
                "type": "mismatch",
                "reason": f"Reply-To address ({reply_email.group()}) does not match sender address ({sender_email.group()})"
            }

    # 2. Display Name Spoofing (e.g., "Microsoft Support <malicious@phish.com>")
    display_name_match = re.match(r'^"?([^"<]+)"?\s*<', sender)
    if display_name_match:
        display_name = display_name_match.group(1).lower()
        # If display name contains a legitimate brand but the email domain doesn't match
        from ...config.brands import LEGITIMATE_BRANDS
        for brand in LEGITIMATE_BRANDS:
            if brand in display_name:
                sender_email = re.search(r'<([^>]+)>', sender)
                if sender_email:
                    email_domain = sender_email.group(1).split('@')[-1]
                    if brand not in email_domain:
                        return {
                            "detected": True,
                            "type": "impersonation",
                            "reason": f"Display name impersonates '{brand}' but email originates from '{email_domain}'"
                        }

    # 3. Free Mailer Spoofing (e.g., brand-support@gmail.com)
    free_mailers = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com"]
    sender_email = re.search(r'[\w\.-]+@[\w\.-]+', sender)
    if sender_email:
        email = sender_email.group()
        domain = email.split('@')[-1]
        if domain in free_mailers:
            from ...config.brands import LEGITIMATE_BRANDS
            for brand in LEGITIMATE_BRANDS:
                if brand in email.split('@')[0]:
                    return {
                        "detected": True,
                        "type": "display_name_spoofing",
                        "reason": f"Sender uses a free email provider ({domain}) to impersonate '{brand}'"
                    }

    return {"detected": False}
