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

def check_high_entropy(hostname: str, threshold: float = 3.8) -> dict:
    """
    Checks if a hostname has unusually high entropy, which often indicates DGA or obfuscation.
    """
    # Remove dots and common TLD parts for a better entropy check of the core part
    parts = hostname.split('.')
    if len(parts) > 1:
        core = "".join(parts[:-1])
    else:
        core = hostname

    entropy = calculate_entropy(core)

    if entropy > threshold:
        return {
            "detected": True,
            "entropy": round(entropy, 2),
            "reason": f"High hostname entropy ({round(entropy, 2)}) detected, possible generated domain"
        }

    return {"detected": False, "entropy": round(entropy, 2)}
