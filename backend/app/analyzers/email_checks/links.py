import re
from typing import List

def extract_links(content: str) -> List[str]:
    """
    Extracts all URLs from the email content.
    """
    return re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', content)

# Link analysis will be performed by the main engine using the URL detectors
