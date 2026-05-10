import os
import re

files = [
    "src/data/pedagogia/primaria/p1.json",
    "src/data/pedagogia/primaria/p2.json",
    "src/data/pedagogia/primaria/p3.json",
    "src/data/pedagogia/primaria/p4.json",
    "src/data/pedagogia/primaria/p5.json",
    "src/data/pedagogia/primaria/p6.json",
    "src/data/pedagogia/secundaria/s1.json",
    "src/data/pedagogia/secundaria/s2.json",
    "src/data/pedagogia/secundaria/s3.json",
]

base_path = r"c:\Users\crist\.gemini\antigravity\scratch\Depuracion de Plataforma\luminar-enterprise-v2"

# Regex for trailing comma in JSON
# This matches a comma followed by optional whitespace and then a closing brace or bracket.
trailing_comma_re = re.compile(r',\s*[}\]]')

for f in files:
    full_path = os.path.join(base_path, f)
    if not os.path.exists(full_path):
        continue
    with open(full_path, 'r', encoding='utf-8') as jf:
        content = jf.read()
        matches = list(trailing_comma_re.finditer(content))
        if matches:
            print(f"TRAILING COMMA(S) in {f}:")
            for m in matches:
                # Find line number
                line_num = content.count('\n', 0, m.start()) + 1
                print(f"  Line {line_num}: '{m.group().strip()}'")
        else:
            # print(f"OK: {f}")
            pass
