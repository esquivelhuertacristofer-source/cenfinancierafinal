/**
 * Toda imagen que el código nombra tiene que existir en `public/`.
 *
 * Una ruta de imagen equivocada no rompe nada: no hay error de compilación, ni de tipos, ni
 * excepción en el navegador. Sale un hueco. Eso hace que sobreviva a cualquier revisión y solo se
 * note cuando alguien abre esa pantalla concreta.
 *
 * El riesgo es real y reciente: al pasar las ilustraciones a WebP hubo que reescribir 113
 * referencias, y dos de ellas —las que arman la ruta con una plantilla, `/assets/temas/${carpeta}/
 * ${n}.png`— se quedaron atrás en el primer intento. Habrían dejado sin portada a todas las
 * unidades del temario.
 *
 * Por eso se comprueban las dos formas:
 *  1. Las rutas escritas enteras, barriendo `src/`.
 *  2. Las que se arman con plantilla, enumerando a mano el rango que puede generar cada una.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = process.cwd();
const PUBLICO = join(RAIZ, "public");

/** Una ruta absoluta de asset dentro de una comilla, sin partes calculadas. */
const RUTA_LITERAL = /["'`(](\/assets\/[^"'`)\s]+\.[a-z0-9]{2,5})["'`)]/gi;

function archivosDeCodigo(dir: string): string[] {
  const salida: string[] = [];
  for (const nombre of readdirSync(dir)) {
    if (nombre === "node_modules" || nombre === "__tests__") continue;
    const p = join(dir, nombre);
    if (statSync(p).isDirectory()) salida.push(...archivosDeCodigo(p));
    else if (/\.(ts|tsx|css)$/.test(nombre)) salida.push(p);
  }
  return salida;
}

describe("imágenes referenciadas", () => {
  it("toda ruta de imagen escrita en src/ existe en public/", () => {
    const rotas: string[] = [];
    for (const archivo of archivosDeCodigo(join(RAIZ, "src"))) {
      const texto = readFileSync(archivo, "utf8");
      for (const m of texto.matchAll(RUTA_LITERAL)) {
        const ruta = m[1];
        if (ruta.includes("${")) continue; // plantilla: se cubre abajo
        if (!existsSync(join(PUBLICO, ruta))) {
          rotas.push(`${archivo.slice(RAIZ.length + 1)} -> ${ruta}`);
        }
      }
    }
    expect(rotas).toEqual([]);
  });

  it("las portadas genéricas de unidad (assets/extra) están completas", () => {
    // ContentModal: `/assets/extra/${(unitNumber + idx) % 18 || 1}.webp`
    const faltan = Array.from({ length: 18 }, (_, i) => `/assets/extra/${i + 1}.webp`).filter(
      (r) => !existsSync(join(PUBLICO, r))
    );
    expect(faltan).toEqual([]);
  });

  it("las portadas por tema coinciden con lo que declara ContentModal", () => {
    /* ContentModal pide `/assets/temas/${folder}/${(idx % cuantas) || 1}.webp`, donde `cuantas`
       sale de PORTADAS_POR_TEMA (seis por defecto). Si ese mapa se desincroniza de lo que hay en
       disco, la ficha pide una imagen que no existe y queda un hueco mudo: por eso se compara el
       mapa contra la carpeta, no contra un numero fijo. */
    const fuente = readFileSync(join(RAIZ, "src", "components", "hub", "ContentModal.tsx"), "utf8");
    const bloque = fuente.match(/const PORTADAS_POR_TEMA[^=]*=\s*\{([^}]*)\}/);
    expect(bloque).not.toBeNull();
    const declarado: Record<string, number> = {};
    for (const m of bloque![1].matchAll(/'([^']+)'\s*:\s*(\d+)/g)) {
      declarado[m[1]] = Number(m[2]);
    }

    const temas = readdirSync(join(PUBLICO, "assets", "temas"));
    expect(temas.length).toBeGreaterThan(0);
    const problemas: string[] = [];
    for (const tema of temas) {
      const enDisco = readdirSync(join(PUBLICO, "assets", "temas", tema))
        .filter((f) => /^\d+\.webp$/.test(f)).length;
      const esperadas = declarado[tema] ?? 6;
      if (enDisco !== esperadas) {
        problemas.push(`${tema}: ${enDisco} en disco, ${esperadas} declaradas`);
      }
      for (let n = 1; n <= esperadas; n++) {
        const r = `/assets/temas/${tema}/${n}.webp`;
        if (!existsSync(join(PUBLICO, r))) problemas.push(`falta ${r}`);
      }
    }
    expect(problemas).toEqual([]);
  });

  it("las tarjetas de grado de la portada están completas", () => {
    // LandingPageV3: `/assets/landing-v3/Primaria${n}.webp` y `Secundaria${n}.webp`
    const esperadas = [
      ...Array.from({ length: 6 }, (_, i) => `/assets/landing-v3/Primaria${i + 1}.webp`),
      ...Array.from({ length: 3 }, (_, i) => `/assets/landing-v3/Secundaria${i + 1}.webp`),
    ];
    expect(esperadas.filter((r) => !existsSync(join(PUBLICO, r)))).toEqual([]);
  });

  it("no quedan PNG ni JPG en assets: todo el dibujo está en WebP", () => {
    const pesados: string[] = [];
    const recorrer = (dir: string) => {
      for (const nombre of readdirSync(dir)) {
        const p = join(dir, nombre);
        if (statSync(p).isDirectory()) recorrer(p);
        else if (/\.(png|jpe?g)$/i.test(nombre)) pesados.push(p.slice(PUBLICO.length + 1));
      }
    };
    recorrer(join(PUBLICO, "assets"));
    expect(pesados).toEqual([]);
  });
});
