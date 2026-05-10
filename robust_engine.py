import json
import os
import re

def robustecer_quiz(data):
    """Aplica el patrón Diamond a actividades de tipo QUIZ"""
    data["complejidad"] = "ALTA"
    data["xp"] = 300 if data.get("level", "").startswith("S") else 200
    
    # Mejorar títulos si son muy simples
    if len(data.get("titulo", "")) < 15:
        data["titulo"] = f"Misión Diamond: {data['titulo']}"
        
    # Asegurar que cada pregunta tenga explicación pedagógica
    for q in data.get("preguntas", []):
        if not q.get("explicacion"):
            q["explicacion"] = "¡Correcto! Sigue acumulando conocimiento Diamond."
            
    return data

def robustecer_arrastra(data):
    """Aplica el patrón Diamond a actividades de tipo ARRASTRA / CLASIFICA"""
    data["xp"] = 400 if data.get("level", "").startswith("S") else 250
    
    # Asegurar feedback en cada item
    for item in data.get("items", []):
        if not item.get("feedback"):
            item["feedback"] = f"¡Buen trabajo! {item.get('label')} está en el lugar correcto."
            
    return data

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Limpiar posibles comas finales antes de parsear
            content = re.sub(r',\s*}', '}', content)
            content = re.sub(r',\s*]', ']', content)
            data = json.loads(content)
            
        tipo = data.get("tipo", "").upper()
        
        if "QUIZ" in tipo:
            data = robustecer_quiz(data)
        elif "ARRASTRA" in tipo or "CLASIFICA" in tipo:
            data = robustecer_arrastra(data)
        
        # Estandarización de campos base
        data["versión"] = "2026.Diamond"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        return True
    except Exception as e:
        print(f"Error procesando {filepath}: {e}")
        return False

if __name__ == "__main__":
    base_dir = r"c:\Users\crist\.gemini\antigravity\scratch\Depuracion de Plataforma\luminar-enterprise-v2\src\data\actividades"
    grados = ["p1", "p2", "p3", "p4", "p5", "p6", "s1", "s2", "s3"]
    
    total_count = 0
    for grado in grados:
        grado_path = os.path.join(base_dir, grado)
        if not os.path.exists(grado_path): continue
        
        files = [f for f in os.listdir(grado_path) if f.endswith(".json")]
        count = 0
        for f in files:
            if process_file(os.path.join(grado_path, f)):
                count += 1
        print(f"Bloque {grado.upper()}: Robustecidos {count} archivos.")
        total_count += count
            
    print(f"\nPROCESO DIAMOND 360 FINALIZADO: {total_count} ejercicios robustecidos.")
