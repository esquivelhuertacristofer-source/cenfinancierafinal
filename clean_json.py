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
    try:
        with open(full_path, 'r', encoding='utf-8') as jf:
            data = json.load(jf)
        with open(full_path, 'w', encoding='utf-8') as jf:
            json.dump(data, jf, indent=2, ensure_ascii=False)
        print(f"Cleaned and saved: {f}")
    except Exception as e:
        print(f"FAILED to clean {f}: {e}")
