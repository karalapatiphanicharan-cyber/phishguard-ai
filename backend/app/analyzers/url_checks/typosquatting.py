from Levenshtein import distance
from ...config.brands import LEGITIMATE_BRANDS
import re

def check_typosquatting(domain: str) -> dict:
    """
    Detects if a domain is a typosquatted version of a legitimate brand.
    Handles hyphens and partial matches.
    """
    domain = domain.lower()

    # If the domain IS exactly a legitimate brand, it's not typosquatting
    if domain in LEGITIMATE_BRANDS:
        return {"detected": False, "brand": domain}

    # Split domain by hyphens to check individual parts
    parts = re.split(r'[-]', domain)

    for brand in LEGITIMATE_BRANDS:
        # 1. Exact match in any part (e.g., paypal-security) but NOT if domain == brand
        if brand in parts and domain != brand:
             return {
                "detected": True,
                "brand": brand,
                "reason": f"Domain part exactly matches legitimate brand '{brand}'"
            }

        # 2. Distance check on full domain
        dist = distance(domain, brand)
        if dist <= 2 and len(brand) > 4:
            return {
                "detected": True,
                "brand": brand,
                "distance": dist,
                "reason": f"Domain '{domain}' is a typosquat of legitimate brand '{brand}'"
            }

        # 3. Distance check on parts
        for part in parts:
            if len(part) < 4: continue
            if part == brand: continue
            part_dist = distance(part, brand)
            if part_dist <= 1: # stricter for parts
                return {
                    "detected": True,
                    "brand": brand,
                    "part": part,
                    "reason": f"Domain part '{part}' is a typosquat of legitimate brand '{brand}'"
                }

    return {"detected": False}
