import {
  CONFIG_JORNADA_POR_DEFECTO,
  estadoInicialJornada,
  oficiosDisponibles,
  jornadaTerminada,
  elegirOficio,
  mejorJornada,
  puntuarJornada,
  metaLograda,
  porRendimiento,
  bloquesRestantes,
  type Oficio,
  type EstadoJornada,
} from '@/lib/activities/jornada-sim';

// Los mismos oficios que trae act-p1-1-3-a.json.
const OFICIOS: Oficio[] = [
  { id: 'cartel', nombre: 'Pintar un cartel para la tienda', bloques: 3, paga: 50 },
  { id: 'panaderia', nombre: 'Ayudar en la panadería', bloques: 2, paga: 30 },
  { id: 'biblioteca', nombre: 'Acomodar libros en la biblioteca', bloques: 2, paga: 25 },
  { id: 'perro', nombre: 'Pasear al perro de la vecina', bloques: 1, paga: 15 },
  { id: 'vivero', nombre: 'Regar las plantas del vivero', bloques: 1, paga: 10 },
  { id: 'ropa', nombre: 'Doblar la ropa limpia', bloques: 1, paga: 8 },
];
const CFG = CONFIG_JORNADA_POR_DEFECTO;

/** Juega una jornada completa aplicando un criterio de elección. */
function jugar(criterio: (disponibles: Oficio[]) => Oficio) {
  let e = estadoInicialJornada();
  while (!jornadaTerminada(OFICIOS, e, CFG)) {
    const r = elegirOficio(e, OFICIOS, CFG, criterio(oficiosDisponibles(OFICIOS, e, CFG)).id);
    if (!r.ok) break;
    e = r.estado;
  }
  return { estado: e, puntaje: puntuarJornada(e, OFICIOS, CFG), logro: metaLograda(e, CFG) };
}

describe('JORNADA — el dinero sale del trabajo', () => {
  it('sin trabajar no hay monedas', () => {
    const e = estadoInicialJornada();
    expect(e.monedas).toBe(0);
    expect(metaLograda(e, CFG)).toBe(false);
    expect(puntuarJornada(e, OFICIOS, CFG)).toBe(0);
  });

  it('cada oficio suma monedas y consume horas del día', () => {
    const r = elegirOficio(estadoInicialJornada(), OFICIOS, CFG, 'panaderia');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.estado.monedas).toBe(30);
    expect(r.estado.bloquesUsados).toBe(2);
    expect(bloquesRestantes(r.estado, CFG)).toBe(4);
  });
});

describe('JORNADA — el tiempo es limitado', () => {
  it('no deja elegir un oficio que no cabe en las horas restantes', () => {
    let e: EstadoJornada = estadoInicialJornada();
    e = (elegirOficio(e, OFICIOS, CFG, 'cartel') as any).estado;      // 3h
    e = (elegirOficio(e, OFICIOS, CFG, 'panaderia') as any).estado;   // 2h -> 5h
    const r = elegirOficio(e, OFICIOS, CFG, 'biblioteca');            // pide 2h, solo queda 1
    expect(r).toEqual({ ok: false, motivo: 'sin_tiempo' });
  });

  it('no permite repetir el mismo oficio (se busca variedad de oficios)', () => {
    const e = (elegirOficio(estadoInicialJornada(), OFICIOS, CFG, 'perro') as any).estado;
    expect(elegirOficio(e, OFICIOS, CFG, 'perro')).toEqual({ ok: false, motivo: 'repetido' });
  });

  it('la jornada termina cuando ya nada cabe en el tiempo restante', () => {
    let e: EstadoJornada = estadoInicialJornada();
    for (const id of ['cartel', 'panaderia', 'perro']) e = (elegirOficio(e, OFICIOS, CFG, id) as any).estado;
    expect(bloquesRestantes(e, CFG)).toBe(0);
    expect(jornadaTerminada(OFICIOS, e, CFG)).toBe(true);
  });
});

describe('JORNADA — no todas las horas rinden igual', () => {
  it('calcula la mejor jornada posible con la mochila', () => {
    const mejor = mejorJornada(OFICIOS, CFG);
    expect(mejor.monedas).toBe(95); // cartel(3h,50) + panadería(2h,30) + perro(1h,15)
    expect(mejor.ids.sort()).toEqual(['cartel', 'panaderia', 'perro']);
  });

  it('elegir siempre lo más rápido NO alcanza la meta: es el momento didáctico', () => {
    // Un niño que va por los trabajitos de 1 hora llena el día y se queda corto.
    const rapido = jugar((d) => [...d].sort((a, b) => a.bloques - b.bloques)[0]);
    // Además de quedarse corto, deja una hora muerta: los trabajos cortos se
    // agotan y lo que queda ya no cabe en la hora suelta.
    expect(rapido.estado.bloquesUsados).toBeLessThan(CFG.bloques);
    expect(rapido.logro).toBe(false);
    expect(rapido.estado.monedas).toBeLessThan(CFG.metaMonedas);
  });

  it('elegir por lo que paga cada hora sí alcanza la meta', () => {
    const listo = jugar((d) => porRendimiento(d)[0]);
    expect(listo.logro).toBe(true);
    expect(listo.puntaje).toBeGreaterThanOrEqual(90);
  });

  it('el puntaje distingue una jornada buena de una mediocre', () => {
    const listo = jugar((d) => porRendimiento(d)[0]);
    const rapido = jugar((d) => [...d].sort((a, b) => a.bloques - b.bloques)[0]);
    expect(listo.puntaje).toBeGreaterThan(rapido.puntaje + 15);
  });

  it('ordena los oficios por lo que pagan cada hora', () => {
    const r = porRendimiento(OFICIOS);
    expect(r[0].id).toBe('cartel');   // 50/3 = 16.7
    expect(r[r.length - 1].id).toBe('ropa'); // 8/1 = 8
  });
});
