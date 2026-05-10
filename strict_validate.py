import json
import os

files = [
    "src/data/pedagogia/primaria/p4.json",
    "src/data/pedagogia/secundaria/s2.json",
    "src/data/pedagogia/secundaria/s3.json",
]

base_path = r"c:\Users\crist\.gemini\antigravity\scratch\Depuracion de Plataforma\luminar-enterprise-v2"

for f in files:
    full_path = os.path.join(base_path, f)
    print(f"Checking {f}...")
    try:
        with open(full_path, 'r', encoding='utf-8') as jf:
            json.load(jf)
        print(f"  {f} is valid JSON for Python.")
    except json.JSONDecodeError as e:
        print(f"  JSON Error in {f}: {e}")
