import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the flip card quote styling
old_str = '<p className="text-stone-600 text-lg font-serif italic mb-8 px-4">&quot;{occ.quote}&quot;</p>'
new_str = '<p className="text-stone-600 text-sm font-serif italic mb-6 px-2">&quot;{occ.quote}&quot;</p>'

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed flip cards css!")
else:
    print("Could not find old string.")
