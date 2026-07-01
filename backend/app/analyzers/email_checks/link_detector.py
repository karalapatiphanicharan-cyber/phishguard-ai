import re

def extract_links(content: str) -> list:
    """Extracts all URLs from the email content."""
    # Improved regex for URL extraction
    url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*'
    links = re.findall(url_pattern, content)
    # Basic cleanup
    cleaned_links = []
    for link in links:
        # Remove trailing punctuation often captured by regex
        link = re.sub(r'[.,;!?)\]]$', '', link)
        if link not in cleaned_links:
            cleaned_links.append(link)
    return cleaned_links
