import {
  PRESETS_BALANCE,
  estadoInicial,
  avanzarBalance,
  puntuarBalance,
  resolverDificultad,
  type ConfigBalance,
  type EstadoBalance,
  type EntradaBalance,
} from '@/lib/activities/balance-sim';

/** Juega una partida completa con una estrategia dada y devuelve el desenlace. */
function jugar(
  cfg: ConfigBalance,
  estrategia: (s: EstadoBalance) => EntradaBalance,
  maxSegundos = 200,
) {
  const s = estadoInicial();
  const dt = 1 / 60;
  while (s.transcurrido < maxSegundos && s.meta < 100) {
    avanzarBalance(s, cfg, estrategia(s), dt);
  }
  return { gano: s.meta >= 100, segundos: s.transcurrido, puntaje: puntuarBalance(s), estado: s };
}

const SOLO_SABIDURIA = () => ({ sabiduria: true, ejecucion: false });
const SOLO_EJECUCION = () => ({ sabiduria: false, ejecucion: true });
const AMBOS = () => ({ sabiduria: true, ejecucion: true });
const NADA = () => ({ sabiduria: false, ejecucion: false });
const ALTERNAR = (s: EstadoBalance) =>
  s.sabiduria <= s.ejecucion
    ? { sabiduria: true, ejecucion: false }
    : { sabiduria: false, ejecucion: true };

describe('motor BALANCE — los exploits del motor anterior', () => {
  // El motor original puntuaba `score = skills`, así que se ganaba con solo
  // mantener presionado el botón azul. El naranja ni siquiera entraba en la fórmula.
  it.each(['FACIL', 'MEDIO', 'ALTA'] as const)(
    'espamear una sola fuerza no gana y puntúa 0 (%s)',
    (nivel) => {
      const cfg = PRESETS_BALANCE[nivel];
      for (const estrategia of [SOLO_SABIDURIA, SOLO_EJECUCION]) {
        const r = jugar(cfg, estrategia);
        expect(r.gano).toBe(false);
        expect(r.puntaje).toBe(0);
        expect(r.estado.resbalones).toBeGreaterThan(0);
      }
    },
  );

  it.each(['FACIL', 'MEDIO', 'ALTA'] as const)(
    'mantener ambos controles a la vez no avanza (%s)',
    (nivel) => {
      const r = jugar(PRESETS_BALANCE[nivel], AMBOS, 60);
      expect(r.gano).toBe(false);
      expect(r.estado.meta).toBe(0);
      expect(r.puntaje).toBe(0);
    },
  );

  it('no hacer nada puntúa 0, no 45', () => {
    // Con la fórmula anterior, 0/0 contaba como "equilibrio perfecto".
    const r = jugar(PRESETS_BALANCE.FACIL, NADA, 60);
    expect(r.puntaje).toBe(0);
  });
});

describe('motor BALANCE — el juego real sí funciona', () => {
  it.each(['FACIL', 'MEDIO', 'ALTA'] as const)('alternar fuerzas gana en %s', (nivel) => {
    const r = jugar(PRESETS_BALANCE[nivel], ALTERNAR);
    expect(r.gano).toBe(true);
    expect(r.puntaje).toBeGreaterThanOrEqual(85);
  });

  it('la partida dura lo suficiente para ser una actividad, no un clic', () => {
    const r = jugar(PRESETS_BALANCE.FACIL, ALTERNAR);
    expect(r.segundos).toBeGreaterThan(20);
    expect(r.segundos).toBeLessThan(90);
  });

  it('la dificultad escala: ALTA cuesta más tiempo que FACIL', () => {
    const facil = jugar(PRESETS_BALANCE.FACIL, ALTERNAR);
    const alta = jugar(PRESETS_BALANCE.ALTA, ALTERNAR);
    expect(alta.segundos).toBeGreaterThan(facil.segundos);
  });

  it('descuidar una fuerza drena la meta ya ganada', () => {
    const cfg = PRESETS_BALANCE.FACIL;
    const s = estadoInicial();
    const dt = 1 / 60;
    // Se juega bien un rato...
    while (s.meta < 40) avanzarBalance(s, cfg, ALTERNAR(s), dt);
    const cima = s.meta;
    // ...y luego se abandona una de las dos fuerzas.
    for (let i = 0; i < 60 * 12; i++) avanzarBalance(s, cfg, SOLO_SABIDURIA(), dt);
    expect(s.meta).toBeLessThan(cima);
    expect(s.resbalones).toBeGreaterThan(0);
  });
});

describe('motor BALANCE — dificultad según el alumno', () => {
  it('la edad manda sobre la etiqueta editorial "complejidad"', () => {
    // El caso real: act-p1-1-3-a.json es de 6-7 años y viene como "MAESTRÍA".
    expect(resolverDificultad({ edad: '6-7 años', complejidad: 'MAESTRÍA' })).toBe('FACIL');
  });

  it('escala con la edad', () => {
    expect(resolverDificultad({ edad: '10-11 años' })).toBe('MEDIO');
    expect(resolverDificultad({ edad: '14-15 años' })).toBe('ALTA');
  });

  it('una dificultad explícita gana sobre todo lo demás', () => {
    expect(resolverDificultad({ edad: '6-7 años', dificultad: 'ALTA' })).toBe('ALTA');
  });

  it('sin edad cae a complejidad, y sin nada a MEDIO', () => {
    expect(resolverDificultad({ complejidad: 'BAJA' })).toBe('FACIL');
    expect(resolverDificultad({})).toBe('MEDIO');
  });
});
