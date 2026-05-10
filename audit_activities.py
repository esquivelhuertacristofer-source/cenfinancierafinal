import os

base_path = r'c:\Users\crist\.gemini\antigravity\scratch\Depuracion de Plataforma\luminar-enterprise-v2\src\data\actividades'
levels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 's1', 's2', 's3']

def audit_level(level):
    path = os.path.join(base_path, level)
    if not os.path.exists(path):
        print(f"Level {level} folder missing!")
        return
    
    files = os.listdir(path)
    missing = []
    
    # Each level has 4 pillars, each pillar has 5 units
    for pillar in range(1, 5):
        for unit in range(1, 6):
            unit_code = f"{level.upper()}-{pillar}-{unit}"
            file_a = f"act-{level}-{pillar}-{unit}-a.json"
            file_b = f"act-{level}-{pillar}-{unit}-b.json"
            
            if file_a not in files:
                missing.append(file_a)
            if file_b not in files:
                missing.append(file_b)
                
    if not missing:
        print(f"Level {level}: OK (40 files)")
    else:
        print(f"Level {level}: Missing {len(missing)} files!")
        for m in missing:
            print(f"  - {m}")

for level in levels:
    audit_level(level)
