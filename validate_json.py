import json
import os

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

for f in files:
    full_path = os.path.join(base_path, f)
    if not os.path.exists(full_path):
        print(f"File not found: {f}")
        continue
    try:
        with open(full_path, 'r', encoding='utf-8') as jf:
            json.load(jf)
        print(f"OK: {f}")
    except json.JSONDecodeError as e:
        print(f"ERROR in {f}: {e}")
    except Exception as e:
        print(f"OTHER ERROR in {f}: {e}")
