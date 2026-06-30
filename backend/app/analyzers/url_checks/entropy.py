import math
from collections import Counter

def calculate_entropy(text: str) -> float:
    """
    Calculates the Shannon entropy of a string.
    """
    if not text:
        return 0.0

    probabilities = [n/len(text) for n in Counter(text).values()]
    entropy = -sum(p * math.log2(p) for p in probabilities)
    return entropy

def check_high_entropy(hostname: str, threshold: float = 4.0) -> dict:
    """
    Checks if a hostname has unusually high entropy, which often indicates DGA or obfuscation.
    """
    # Remove dots and common TLD parts for a better entropy check of the core part
    parts = hostname.split('.')
    if len(parts) > 1:
        # Check entropy of each part, and use the max
        max_entropy = 0
        for part in parts[:-1]:
            if len(part) > 5:
                max_entropy = max(max_entropy, calculate_entropy(part))
        entropy = max_entropy
    else:
        entropy = calculate_entropy(hostname)

    if entropy > threshold:
        return {
            "detected": True,
            "entropy": round(entropy, 2),
            "reason": f"High hostname entropy ({round(entropy, 2)}) detected, possible generated domain"
        }

    return {"detected": False, "entropy": round(entropy, 2)}
