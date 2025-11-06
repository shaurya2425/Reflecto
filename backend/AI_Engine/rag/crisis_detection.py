import re

# 🔎 Crisis-related keywords to look for
CRISIS_KEYWORDS = [
    r"\bkill myself\b", r"\bsuicide\b", r"\bi want to die\b",
    r"\bself[- ]?harm\b", r"\boverdose\b", r"\bjump off\b", 
    r"\bhang myself\b", r"\bcut myself\b", r"\bcan.?t go on\b"
]

def detect_crisis(text: str) -> bool:
    """Returns True if the input contains known crisis phrases."""
    text = text.lower().strip()
    return any(re.search(pattern, text) for pattern in CRISIS_KEYWORDS)
