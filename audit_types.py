import os
import json

allowed_types = [
    'SIMULADOR', 'QUIZ', 'DECIDE', 'CONSTRUCTOR', 'TRIVIA', 
    'ARRASTRA', 'RELLENA', 'RULETA', 'MEMORIA', 'JUEGO',
    'BALANCE', 'RADAR', 'CRECIMIENTO', 'CONTROL'
]

base_dir = 'src/data/actividades'
errors = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.json'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    tipo = data.get('tipo')
                    if tipo not in allowed_types:
                        errors.append(f"{path}: {tipo}")
            except Exception as e:
                print(f"Error reading {path}: {e}")

if errors:
    print("Found invalid activity types:")
    for err in errors:
        print(err)
else:
    print("All activity types are valid.")
