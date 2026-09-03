/**
 * Los videos de experto tienen que llegar a una pantalla.
 *
 * Estos diecisiete videos son del autor y estuvieron catalogados —con sus códigos de unidad y
 * todo— sin que ninguna pantalla los mostrara: `ContentModal` importaba el archivo y no lo usaba.
 * Nada fallaba, no había error en consola ni test en rojo; simplemente no se veían.
 *
 * Lo que se vigila aquí:
 *  1. Cada código sugerido existe de verdad en el temario. Un código con una errata no rompe nada,
 *     solo hace que el video no aparezca nunca.
 *  2. Los diecisiete son alcanzables desde alguna unidad.
 *  3. Las URL son enlaces de YouTube con id válido, que es lo que `VideoFrame` sabe convertir a
 *     embed. Una URL con otra forma se serviría como iframe crudo y quedaría en negro.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  EXPERT_VIDEOS,
  UNIDADES_CON_EXPERTO,
  videosDeExperto,
} from "@/lib/expertVideos";

const RAIZ = process.cwd();
const PED = join(RAIZ, "public", "data", "pedagogia");
const GRADOS = ["p1", "p2", "p3", "p4", "p5", "p6", "s1", "s2", "s3"];
const nivel = (g: string) => (g.startsWith("p") ? "primaria" : "secundaria");

const codigosDelTemario = new Set(
  GRADOS.flatMap((g) =>
    Object.keys(JSON.parse(readFileSync(join(PED, nivel(g), `${g}.json`), "utf8")))
  )
);

/* La misma expresión que usa VideoFrame para sacar el id de un enlace de YouTube. */
const ID_YOUTUBE = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

describe("videos de experto", () => {
  it("el catálogo no está vacío", () => {
    expect(EXPERT_VIDEOS.length).toBeGreaterThan(0);
  });

  it("todos los códigos de unidad sugeridos existen en el temario", () => {
    const inventados = EXPERT_VIDEOS.flatMap((v) =>
      v.suggestedUnitCodes
        .filter((c) => !codigosDelTemario.has(c))
        .map((c) => `${v.id} -> ${c}`)
    );
    expect(inventados).toEqual([]);
  });

  it("cada video es alcanzable desde al menos una unidad", () => {
    const huerfanos = EXPERT_VIDEOS.filter(
      (v) => !v.suggestedUnitCodes.some((c) => videosDeExperto(c).includes(v))
    ).map((v) => v.id);
    expect(huerfanos).toEqual([]);
  });

  it("todas las URL son enlaces de YouTube con id de 11 caracteres", () => {
    const malas = EXPERT_VIDEOS.filter((v) => {
      const m = v.url.match(ID_YOUTUBE);
      return !m || m[2].length !== 11;
    }).map((v) => `${v.id}: ${v.url}`);
    expect(malas).toEqual([]);
  });

  it("ninguna unidad recibe el mismo video dos veces", () => {
    for (const code of codigosDelTemario) {
      const ids = videosDeExperto(code).map((v) => v.id);
      expect(ids).toEqual([...new Set(ids)]);
    }
  });

  it("una unidad sin videos devuelve lista vacía, no undefined", () => {
    expect(videosDeExperto("NO-EXISTE-1-1")).toEqual([]);
  });

  it("el conteo de unidades con experto cuadra con el catálogo", () => {
    const esperadas = new Set(EXPERT_VIDEOS.flatMap((v) => v.suggestedUnitCodes));
    expect(UNIDADES_CON_EXPERTO).toBe(esperadas.size);
  });
});
