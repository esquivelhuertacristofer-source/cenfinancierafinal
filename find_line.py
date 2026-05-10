import os

base_path = r"c:\Users\crist\.gemini\antigravity\scratch\Depuracion de Plataforma\luminar-enterprise-v2"
file_path = os.path.join(base_path, "src/data/pedagogia/secundaria/s3.json")

with open(file_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "retiro a los 15" in line:
            print(f"Found on line {i+1}: {line.strip()}")
