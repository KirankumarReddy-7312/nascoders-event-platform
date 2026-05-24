import re

PROFILE_FILE = "src/app/profile/page.tsx"

with open(PROFILE_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # Only in lines before 600 (BookingDashboardItem definition)
    if i < 600:
        if ") })()}" in line:
            lines[i] = line.replace(") })()}", ")}")

with open(PROFILE_FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)
