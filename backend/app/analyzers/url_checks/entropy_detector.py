import math

def calculate_shannon_entropy(data: str) -> float:
    if not data:
        return 0.0
    entropy = 0
    for x in set(data):
        p_x = float(data.count(x)) / len(data)
        entropy -= p_x * math.log(p_x, 2)
    return entropy

def check_high_entropy(hostname: str) -> dict:
    entropy = calculate_shannon_entropy(hostname)
    # Typically > 3.5-4.0 is suspicious for domains
    if entropy > 3.8:
        return {
            "detected": True,
            "entropy": round(entropy, 2),
            "reason": f"High hostname entropy ({round(entropy, 2)}) suggests a randomly generated domain"
        }
    return {"detected": False, "entropy": round(entropy, 2)}
