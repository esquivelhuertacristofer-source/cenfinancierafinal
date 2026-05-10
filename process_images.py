import os
from PIL import Image

src_dir = r"C:\Users\crist\.gemini\antigravity\scratch\Depuracion de Plataforma\IMAGENES PARA UNIDADES"
target_dir = "public/assets/units"

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

print(f"Processing images from {src_dir} to {target_dir}...")

for i in range(1, 34):
    filename = f"Gemini_Generated_Image_ ({i}).png"
    src_path = os.path.join(src_dir, filename)
    
    if os.path.exists(src_path):
        print(f"Converting {filename}...")
        with Image.open(src_path) as img:
            # Convert to WebP and compress
            target_path = os.path.join(target_dir, f"{i}.webp")
            img.save(target_path, "WEBP", quality=50) # Low quality to save space
            print(f"Saved to {target_path}")
    else:
        print(f"Warning: {filename} not found.")

print("Done!")
