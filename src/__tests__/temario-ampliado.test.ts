/**
 * Invariantes del temario ampliado (unidades 6-10 de cada bloque).
 *
 * Cubre tres cosas que ninguna validación de tipos detecta y que ya se rompieron
 * una vez durante la ampliación:
 *  1. La malla está completa: 10 unidades por bloque en los 9 grados.
 *  2. La respuesta correcta de los QUIZ está repartida entre posiciones.
 *     `QuizActivity` NO baraja opciones en runtime (a diferencia de
 *     `TriviaActivity`), así que un índice fijo se aprueba sin leer.
 *  3. Toda imagen referenciada por una actividad existe en `public/`.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const RAIZ = process.cwd();
const ACT = join(RAIZ, "public", "data", "actividades");
const PED = join(RAIZ, "public", "data", "pedagogia");
const GRADOS = ["p1", "p2", "p3", "p4", "p5", "p6", "s1", "s2", "s3"];
const nivel = (g: string) => (g.startsWith("p") ? "primaria" : "secundaria");

/** Actividades de las unidades nuevas (6-10), agrupadas por grado. */
/** Lo que estas pruebas miran de una actividad. No es el esquema completo: es lo que se comprueba. */
interface ActividadDelTemario {
  tipo?: string;
  portada?: string;
  escena?: string;
  preguntas?: { correcta?: number }[];
  nodos?: Record<string, { imagen?: string }>;
}

function actividadesNuevas(grado: string) {
  return readdirSync(join(ACT, grado))
    .map((f) => ({ f, m: f.match(/^act-\w\d-(\d)-(\d+)-(a|b)\.json$/) }))
    .filter(({ m }) => m && +m[2] >= 6 && +m[2] <= 10)
    .map(({ f }) => ({
      f,
      data: JSON.parse(readFileSync(join(ACT, grado, f), "utf8")) as ActividadDelTemario,
    }));
}

describe("temario ampliado — malla completa", () => {
  it.each(GRADOS)("%s tiene 4 bloques x 10 unidades en la pedagogía", (grado) => {
    const ped = JSON.parse(readFileSync(join(PED, nivel(grado), `${grado}.json`), "utf8"));
    for (let b = 1; b <= 4; b++) {
      for (let u = 1; u <= 10; u++) {
        const code = `${grado.toUpperCase()}-${b}-${u}`;
        expect(ped[code]).toBeDefined();
        expect(ped[code].title).toBeTruthy();
      }
    }
  });

  it.each(GRADOS)("%s tiene 40 actividades nuevas (20 unidades x 2 slots)", (grado) => {
    expect(actividadesNuevas(grado)).toHaveLength(40);
  });
});

describe("evaluaciones — la correcta no siempre cae en el mismo sitio", () => {
  it.each(GRADOS)("%s: ningún QUIZ nuevo tiene el índice correcto fijo", (grado) => {
    const fijos = actividadesNuevas(grado)
      .filter(({ data }) => data.tipo === "QUIZ" && (data.preguntas?.length ?? 0) >= 5)
      .filter(({ data }) => new Set((data.preguntas ?? []).map((p) => p.correcta)).size === 1)
      .map(({ f }) => f);
    expect(fijos).toEqual([]);
  });

  it("el reparto global de la respuesta correcta está equilibrado", () => {
    const conteo: Record<number, number> = {};
    let total = 0;
    for (const grado of GRADOS) {
      for (const { data } of actividadesNuevas(grado)) {
        if (data.tipo !== "QUIZ") continue;
        for (const p of data.preguntas ?? []) {
          /* Una pregunta sin `correcta` no entra en el reparto: contarla como indice 0 inflaria
             esa posicion y la prueba de equilibrio dejaria de medir lo que dice medir. */
          if (typeof p.correcta !== "number") continue;
          conteo[p.correcta] = (conteo[p.correcta] ?? 0) + 1;
          total++;
        }
      }
    }
    // Con 4 opciones, ninguna posición debería llevarse más del 40%.
    for (const n of Object.values(conteo)) expect(n / total).toBeLessThan(0.4);
  });
});

describe("imágenes de las actividades nuevas", () => {
  it("toda ruta referenciada existe en public/", () => {
    const rotas: string[] = [];
    for (const grado of GRADOS) {
      for (const { f, data } of actividadesNuevas(grado)) {
        const chk = (ruta?: string) => {
          if (ruta && !existsSync(join(RAIZ, "public", ruta))) rotas.push(`${grado}/${f} -> ${ruta}`);
        };
        chk(data.portada);
        chk(data.escena);
        if (data.tipo === "DECIDE") {
          for (const nodo of Object.values(data.nodos ?? {})) chk(nodo.imagen);
        }
      }
    }
    expect(rotas).toEqual([]);
  });

  it("las 360 actividades nuevas tienen portada", () => {
    const sinPortada = GRADOS.flatMap((g) =>
      actividadesNuevas(g).filter(({ data }) => !data.portada).map(({ f }) => `${g}/${f}`)
    );
    expect(sinPortada).toEqual([]);
  });

  it("todos los nodos de las DECIDE nuevas tienen imagen", () => {
    const sinImagen: string[] = [];
    for (const grado of GRADOS) {
      for (const { f, data } of actividadesNuevas(grado)) {
        if (data.tipo !== "DECIDE") continue;
        for (const [id, nodo] of Object.entries<any>(data.nodos ?? {})) {
          if (!nodo.imagen) sinImagen.push(`${grado}/${f}#${id}`);
        }
      }
    }
    expect(sinImagen).toEqual([]);
  });
});
