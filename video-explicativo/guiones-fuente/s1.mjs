/**
 * Secundaria 1 — 12 a 13 años. Ocho videos.
 *
 * NO HAY GENERAL DEL BLOQUE 1. Ese pilar ya tiene video propio del autor en
 * `PILLAR_VIDEOS`, y esos veintiún videos no se tocan: el catálogo los detecta
 * solo y aquí sólo entra el hueco.
 *
 * REGISTRO. Su propio dinero y su propio tiempo. Es el primer grado que puede
 * mirar un recibo de nómina real, entender por qué le quitan una parte y calcular
 * lo que le corresponde. `estiloDeGrado()` ya devuelve ESTILO_TEEN.
 *
 * Contenido de `public/data/pedagogia/secundaria/s1.json`.
 * Diccion para XTTS: siglas deletreadas (U M A, I S R, I M S S, P T U, M V P,
 * S A T), sin comillas, sin puntos suspensivos.
 */

export const ARGUMENTOS = [
  /* ═══ BLOQUE 1 · Primeros Pasos Hacia el Ahorro (solo intermedio) ═════════ */

  {
    id: 's1-b1-u6',
    titulo: 'Lo que de verdad te llega',
    imagenes: {
      'recibo-nomina': 'A printed Mexican payroll receipt on a kitchen table with a pen beside it, all figures blank, top down view',
      'bruto-vs-neto': 'Two banknote stacks of clearly different heights side by side on a table, the second noticeably shorter, plain background',
      'salario-minimo': 'A construction worker and a shop assistant standing at their workplaces, shown in one composition, honest everyday labour, daylight',
      'uma-multa': 'An official notice and a housing credit statement lying side by side on a desk, all fields blank, institutional feel',
      'isr-escalones': 'A staircase of increasing steps drawn on a whiteboard with a marker resting on it, clean diagram, no labels',
      'clinica-imss': 'The entrance of a Mexican public health clinic with people arriving, ordinary weekday morning, functional and busy',
      'trabajo-informal': 'A street vendor working hard at a busy Mexican corner stall, capable and industrious, mid morning light',
      'accidente-informal': 'A person with a bandaged arm sitting at home looking at bills, unable to work, quiet worried afternoon',
      'super-canasta': 'A supermarket trolley with groceries beside an identical trolley holding fewer items, clear side by side comparison',
      'contar-productos': 'A person counting grocery items on a kitchen counter with a receipt in hand, methodical, morning light',
      'seis-categorias': 'Six small grouped piles of everyday household items arranged on a table, food, home, transport, health, education, clothing',
      'dos-ingresos': 'A Mexican couple both leaving for work at dawn from the same home, both in work clothes, early light',
    },
    laminas: [
      'recibo-nomina', 'bruto-vs-neto', 'salario-minimo', 'uma-multa', 'isr-escalones',
      'clinica-imss', 'trabajo-informal', 'accidente-informal', 'super-canasta', 'contar-productos',
      'seis-categorias', 'dos-ingresos',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'recibo-nomina',
        tomas: [
          'Te ofrecen un trabajo y te dicen una cifra.',
          { t: 'Llega el día de pago y en la cuenta hay menos.', fondo: 'bruto-vs-neto', recorte: [0.5, 0.5, 0.6] },
          'Nadie te engañó.',
          { t: 'Te dijeron el bruto, y tú vas a vivir con el neto.', fondo: 'bruto-vs-neto', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'salario-minimo',
        tomas: [
          'Antes de eso, dos referencias que la gente confunde todo el tiempo.',
          { t: 'El salario mínimo es la cantidad más baja que legalmente puede recibir alguien por una jornada.', rotulo: 'Salario mínimo' },
          { t: 'Se fija cada año, y hay un valor general y otro para la zona fronteriza norte, que es mayor.', recorte: [0.5, 0.5, 0.6] },
          { t: 'La U M A es otra cosa completamente distinta.', fondo: 'uma-multa', rotulo: 'UMA' },
          { t: 'Sirve para calcular multas, aportaciones y ciertos créditos de vivienda.', fondo: 'uma-multa' },
          { t: 'Y se separaron por una razón muy concreta.', fondo: 'uma-multa' },
          { t: 'Antes casi todo se calculaba en salarios mínimos, así que subir el salario encarecía automáticamente las multas.', fondo: 'uma-multa' },
          { t: 'Eso frenaba los aumentos. Al separarlos, el salario puede subir sin arrastrar todo lo demás.', fondo: 'uma-multa', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'isr-escalones',
        tomas: [
          'Ahora sí, de dónde sale la diferencia entre el bruto y el neto.',
          { t: 'La retención más grande en casi todos los recibos es el impuesto sobre la renta.', rotulo: 'ISR' },
          { t: 'Y funciona por escalones, no de golpe.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Quien gana más paga un porcentaje mayor sobre la parte alta de su ingreso, no sobre todo.' },
          { t: 'Por eso ganar un peso más nunca te deja con menos dinero en la mano.' },
          { t: 'Y las cuotas de seguridad social no son dinero perdido.', fondo: 'clinica-imss' },
          { t: 'Compran atención médica, pago durante una incapacidad y aportación a tu cuenta de retiro.', fondo: 'clinica-imss' },
          { t: 'Derechos concretos que quien trabaja de manera informal tiene que pagar de su bolsillo o simplemente no tiene.', fondo: 'clinica-imss' },
          { t: 'Y la regla práctica: se presupuesta con el neto. Siempre.', fondo: 'bruto-vs-neto' },
          { t: 'Planear con el bruto genera un faltante todos los meses, porque ese dinero nunca llega.', fondo: 'bruto-vs-neto', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'trabajo-informal',
        tomas: [
          'Cerca de la mitad de quienes trabajan en México lo hacen en la informalidad.',
          { t: 'Trabajan, generan ingresos y sostienen a sus familias.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Lo que no tienen es el paquete de derechos que viene con estar registrado.' },
          { t: 'Y mientras todo va bien, la diferencia parece pequeña. A veces hasta favorable, porque el efectivo puede ser mayor.' },
          { t: 'El costo no llega poco a poco.', fondo: 'accidente-informal' },
          { t: 'Aparece concentrado en un solo momento: una enfermedad, un accidente, la vejez.', fondo: 'accidente-informal' },
          { t: 'Y las causas son estructurales más que personales.', fondo: 'trabajo-informal' },
          { t: 'Escasez de empleos formales, trámites complejos y empleadores que evaden sus obligaciones.', fondo: 'trabajo-informal', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'super-canasta',
        tomas: [
          'Y ahora las tres palabras de las noticias, explicadas con el súper.',
          { t: 'El P I B mide el valor de todo lo que produce el país en un periodo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'La inflación es cuánto suben los precios en promedio.' },
          { t: 'Y el poder adquisitivo es lo único que sientes: cuánto alcanza tu dinero.' },
          { t: 'Aquí está la relación que importa.', fondo: 'contar-productos' },
          { t: 'Si tu ingreso sube cuatro por ciento y la inflación fue seis, tu poder adquisitivo bajó.', fondo: 'contar-productos' },
          { t: 'Aunque tengas más pesos en la mano.', fondo: 'contar-productos' },
          { t: 'Y la forma clara de verlo es contar productos, no pesos.', fondo: 'contar-productos' },
          { t: 'Si con el mismo ingreso comprabas veinte artículos y ahora compras dieciséis, cayó un veinte por ciento.', fondo: 'contar-productos', cifra: ['-20%', 'de poder'] },
          { t: 'Todo eso se aterriza en la canasta básica: lo que cuesta vivir.', fondo: 'seis-categorias' },
          { t: 'Seis categorías: alimentación, vivienda y servicios, transporte, salud, educación y vestido.', fondo: 'seis-categorias', recorte: [0.5, 0.5, 0.75] },
          { t: 'Y al compararla con un solo salario mínimo, en muchos casos no alcanza para una familia.', fondo: 'dos-ingresos' },
          { t: 'Eso explica por qué en tantos hogares trabajan dos o más personas.', fondo: 'dos-ingresos' },
          { t: 'Pregunta el neto, no el bruto. Presupuesta con lo que llega. Y cuenta productos.', fondo: 'dos-ingresos', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 2 · Construyendo Independencia ═══════════════════════════════ */

  {
    id: 's1-b2-general',
    titulo: 'Vivir de lo que ganas',
    imagenes: {
      'seguridad-social': 'The entrance of a large Mexican public hospital with staff and patients arriving, functional institutional architecture, daylight',
      'pension-futuro': 'An older Mexican worker looking at a retirement statement at a kitchen table, thoughtful, warm afternoon light',
      'infonavit-casa': 'A row of modest new Mexican houses in a residential development, ordinary and hopeful, clear sky',
      'apps-finanzas': 'A laptop with a spreadsheet and a phone with a budgeting app side by side on a desk, all fields blank, organised workspace',
      'negociar-aumento': 'A young professional presenting results on paper across a desk to a manager, composed and prepared, office setting',
      'aguinaldo-diciembre': 'A December calendar on a wall with a date circled, festive but ordinary Mexican home in the background',
      'despido-sobre': 'A person receiving a document across a desk in an office, tense but dignified moment',
      'coche-credito': 'A modest used car parked outside a Mexican home with a contract on the bonnet, everyday setting',
      'primer-cuarto': 'A small bare rented room with a bed, a window and boxes still packed, first day of independence',
      'presupuesto-solo': 'A young adult at a small kitchen table writing a budget in a notebook with bills spread out, focused, evening light',
    },
    laminas: [
      'seguridad-social', 'pension-futuro', 'infonavit-casa', 'apps-finanzas', 'negociar-aumento',
      'aguinaldo-diciembre', 'despido-sobre', 'coche-credito', 'primer-cuarto', 'presupuesto-solo',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'primer-cuarto',
        tomas: [
          'Algún día vas a cerrar la puerta de un lugar que pagas tú.',
          { t: 'Y ese día vas a necesitar saber cosas que nadie te enseñó.', recorte: [0.5, 0.5, 0.6] },
          'Este bloque es exactamente eso.',
          { t: 'Lo que hay que saber para vivir de lo que ganas.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'seguridad-social',
        tomas: [
          'Empieza con el sistema que te sostiene cuando algo sale mal.',
          { t: 'Qué es la seguridad social en México y qué te da exactamente.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Después la pensión y el AFORE.', fondo: 'pension-futuro' },
          { t: 'Cuánto vas a tener cuando te retires, que depende sobre todo de cuándo empieces.', fondo: 'pension-futuro' },
          { t: 'Y el crédito de vivienda, que es como la mayoría de los mexicanos compra su casa.', fondo: 'infonavit-casa', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'negociar-aumento',
        tomas: [
          'Vas a aprender a pedir un aumento.',
          { t: 'Con argumentos y resultados, no con antigüedad ni con necesidad.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y a llevar tus propias finanzas con herramientas digitales.', fondo: 'apps-finanzas', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'aguinaldo-diciembre',
        tomas: [
          'La segunda mitad es la más útil de todo el año.',
          { t: 'Tus derechos laborales en pesos: aguinaldo, prima vacacional y reparto de utilidades.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Qué te toca si te despiden, y la diferencia entre finiquito y liquidación.', fondo: 'despido-sobre' },
          { t: 'Y cómo comparar el costo total de un coche, más allá de la mensualidad.', fondo: 'coche-credito', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'presupuesto-solo',
        tomas: [
          'Y cierra con las dos clases que más te van a servir.',
          { t: 'Tu primer presupuesto independiente, con los gastos que nadie cuenta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y cómo rentar tu primer cuarto sin perder el depósito.', fondo: 'primer-cuarto' },
          { t: 'Diez clases para el día en que cierres esa puerta. Empezamos.', fondo: 'primer-cuarto', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's1-b2-u6',
    titulo: 'Lo que te toca, en pesos',
    imagenes: {
      'quince-dias': 'Fifteen small banknote stacks arranged in a neat row on a table, top down view, plain background',
      'prima-olvidada': 'A payroll receipt with one small line highlighted faintly among many, magnifying glass nearby, all figures blank',
      'reparto-utilidades': 'A group of factory workers receiving envelopes from a supervisor, ordinary workplace, natural light',
      'verificar-recibo': 'A young worker comparing a payroll receipt against their own handwritten calculation in a notebook, kitchen table',
      'finiquito-liquidacion': 'Two documents side by side on a desk, clearly different lengths, a pen resting between them',
      'prisa-firmar': 'A person being handed a pen and a document across a desk with visible urgency from the other party, tense moment',
      'mensualidad-baja': 'A car dealership window with a large blank promotional banner emphasising a monthly figure, street view',
      'costo-total-coche': 'A car with all its associated costs laid out around it on the ground: insurance papers, fuel, service receipts, top down illustrative view',
      'gastos-invisibles': 'A kitchen table covered with small everyday expenses receipts that add up, top down view, harsh honest light',
      'un-tercio-renta': 'A pie shape drawn on paper with one third clearly marked off, a pencil resting on it, clean diagram',
      'deposito-garantia': 'A young tenant handing over money to a landlord in a doorway while both hold a written inventory, daylight',
      'fotos-fechadas': 'A phone photographing a small mark on a rented room wall, documenting the state of the property, plain interior',
    },
    laminas: [
      'quince-dias', 'prima-olvidada', 'reparto-utilidades', 'verificar-recibo', 'finiquito-liquidacion',
      'prisa-firmar', 'mensualidad-baja', 'costo-total-coche', 'gastos-invisibles', 'un-tercio-renta',
      'deposito-garantia', 'fotos-fechadas',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'prima-olvidada',
        tomas: [
          'Hay dinero que te corresponde por ley.',
          { t: 'Y que muchísima gente no recibe completo.', recorte: [0.5, 0.5, 0.6] },
          'No por un fraude elaborado.',
          { t: 'Sino porque nadie hizo la cuenta y lo comparó con su recibo.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'quince-dias',
        tomas: [
          'El aguinaldo son al menos quince días de salario.',
          { t: 'Y debe pagarse antes del veinte de diciembre.', rotulo: 'Antes del 20 de diciembre' },
          { t: 'Quien trabajó solo una parte del año lo recibe en proporción. No lo pierde.', recorte: [0.5, 0.5, 0.6] },
          { t: 'La prima vacacional es la prestación que más se olvida.', fondo: 'prima-olvidada' },
          { t: 'Además de los días pagados de vacaciones, la ley establece al menos un veinticinco por ciento sobre el salario de esos días.', fondo: 'prima-olvidada', cifra: ['25%', 'sobre esos días'] },
          { t: 'Y cuando la empresa genera ganancias, una parte se reparte entre quienes trabajan ahí.', fondo: 'reparto-utilidades' },
          { t: 'La mayoría de los incumplimientos persisten porque nadie los detecta.', fondo: 'verificar-recibo' },
          { t: 'Calcular lo que corresponde y compararlo con el recibo toma unos minutos.', fondo: 'verificar-recibo', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'finiquito-liquidacion',
        tomas: [
          'Y si el trabajo termina, hay dos palabras que no significan lo mismo.',
          { t: 'El finiquito corresponde siempre, sin importar por qué terminó.', rotulo: 'Finiquito' },
          { t: 'Días trabajados no pagados, aguinaldo proporcional, vacaciones pendientes y su prima.', recorte: [0.4, 0.5, 0.6] },
          { t: 'La liquidación es distinta: aplica cuando el despido fue injustificado.', rotulo: 'Liquidación' },
          { t: 'Es una indemnización que considera el salario y la antigüedad.', recorte: [0.65, 0.5, 0.6] },
          { t: 'Y hay un momento donde se pierde mucho dinero.', fondo: 'prisa-firmar' },
          { t: 'Cuando te ponen un documento enfrente para firmarlo de inmediato, con los nervios encima.', fondo: 'prisa-firmar' },
          { t: 'Nadie está obligado a firmar en ese instante. Se puede pedir el documento y revisarlo.', fondo: 'prisa-firmar' },
          { t: 'Y cada concepto debe venir desglosado. Si no coincide con tu cálculo, no coincide.', fondo: 'prisa-firmar', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'mensualidad-baja',
        tomas: [
          'Ahora la compra grande que casi todos evalúan mal.',
          { t: 'Un coche se compara por la mensualidad, y la mensualidad esconde el plazo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Una mensualidad baja casi siempre significa más meses generando intereses.' },
          { t: 'El costo total incluye muchas más cosas.', fondo: 'costo-total-coche' },
          { t: 'Enganche, todas las mensualidades, comisión de apertura, el seguro obligatorio, mantenimiento, verificación y combustible.', fondo: 'costo-total-coche', recorte: [0.5, 0.5, 0.7] },
          { t: 'Con crédito, al terminar el coche es tuyo con el valor que conserve.', fondo: 'costo-total-coche' },
          { t: 'Con arrendamiento pagas por usarlo y al final lo devuelves, o pagas para quedártelo.', fondo: 'costo-total-coche' },
          { t: 'Ninguno es mejor en abstracto. Depende de cuántos años lo vas a conservar.', fondo: 'costo-total-coche', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'gastos-invisibles',
        tomas: [
          'Y llega el presupuesto de vivir solo.',
          { t: 'Casi todos cuentan renta y comida, y ahí se detienen.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Faltan servicios, internet, limpieza, transporte diario, ropa, salud y reponer lo que se rompe.' },
          { t: 'Y los imprevistos y el ahorro no son lo que sobra: son una línea propia.' },
          { t: 'Hay una referencia útil sobre la renta.', fondo: 'un-tercio-renta' },
          { t: 'La vivienda no debería consumir más de una tercera parte del ingreso neto.', fondo: 'un-tercio-renta', rotulo: 'Un tercio del neto' },
          { t: 'Cuando pasa de ahí, todo lo demás se comprime y cualquier imprevisto se vuelve una crisis.', fondo: 'un-tercio-renta' },
          { t: 'Y para entrar a rentar hay un desembolso que sorprende.', fondo: 'deposito-garantia' },
          { t: 'Primer mes adelantado, un depósito de una o dos rentas, comprobantes y muchas veces un aval con propiedad.', fondo: 'deposito-garantia' },
          { t: 'Ese depósito no es renta adelantada: es una garantía que debe devolverse al final.', fondo: 'deposito-garantia' },
          { t: 'Y el conflicto más frecuente del mundo es que no lo devuelvan por daños que ya estaban.', fondo: 'fotos-fechadas' },
          { t: 'Se evita con un inventario firmado por las dos partes y fotos fechadas el día que entras.', fondo: 'fotos-fechadas' },
          { t: 'Calcula lo que te toca. No firmes con prisa. Y fotografía el cuarto el primer día.', fondo: 'fotos-fechadas', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 3 · Planificación y Crecimiento ══════════════════════════════ */

  {
    id: 's1-b3-general',
    titulo: 'El tiempo hace el trabajo',
    imagenes: {
      'interes-compuesto': 'A curve rising slowly then steeply drawn on a large whiteboard, someone standing beside it, clean chart',
      'fondos-etf': 'Two baskets of mixed contents side by side on a table, one labelled area blank on each, clean comparison',
      'inflacion-erosion': 'A banknote slowly fading at one corner, symbolic illustration on a plain surface, subtle and clear',
      'bienes-raices': 'A modest apartment building in a Mexican city with a for rent notice in a window, ordinary urban setting',
      'balance-personal': 'A single sheet divided into two halves with entries on both sides and a total at the bottom, all figures blank',
      'cetes-cien': 'A small amount of money beside a phone showing a government investment platform, all fields blank, kitchen table',
      'curva-plazos': 'A gently rising curve plotted across a grid on a screen, clean financial chart with no labels',
      'aportar-fijo': 'Twelve identical small deposits drawn as marks along a timeline on paper, perfectly regular, top down view',
      'comisiones-silenciosas': 'Two rising curves on a screen diverging slowly over time, one ending noticeably lower, clean chart',
      'patrimonio-flecha': 'An upward pointing arrow drawn across a series of quarterly bars on a whiteboard, clean diagram',
    },
    laminas: [
      'interes-compuesto', 'fondos-etf', 'inflacion-erosion', 'bienes-raices', 'balance-personal',
      'cetes-cien', 'curva-plazos', 'aportar-fijo', 'comisiones-silenciosas', 'patrimonio-flecha',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'interes-compuesto',
        tomas: [
          'Hay una fuerza en las finanzas que no depende de que seas listo.',
          { t: 'Depende de que empieces temprano.', recorte: [0.5, 0.5, 0.6] },
          'Se llama interés compuesto.',
          { t: 'Y este bloque empieza justo ahí, porque es tu mayor ventaja sobre cualquier adulto.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'fondos-etf',
        tomas: [
          'Vas a comparar fondos de inversión con fondos cotizados.',
          { t: 'Costos, gestión y qué tan rápido puedes salir.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y a ver cómo la inflación se come el ahorro que se queda quieto.', fondo: 'inflacion-erosion', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'bienes-raices',
        tomas: [
          'Vas a analizar los bienes raíces sin romanticismo.',
          { t: 'Lo que rinden, lo que cuestan y lo difícil que es venderlos rápido.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y a hacer tu propio balance personal.', fondo: 'balance-personal' },
          { t: 'Que es el diagnóstico más honesto que existe.', fondo: 'balance-personal', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'cetes-cien',
        tomas: [
          'La segunda mitad es totalmente aplicable ya.',
          { t: 'Cómo invertir con el gobierno desde cien pesos.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Por qué el plazo cambia la tasa.', fondo: 'curva-plazos' },
          { t: 'Y la estrategia de aportar lo mismo cada mes, sin adivinar el momento.', fondo: 'aportar-fijo', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'comisiones-silenciosas',
        tomas: [
          'Y cierra con el enemigo que nadie ve.',
          { t: 'Las comisiones, que se cobran siempre aunque el rendimiento no llegue.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y tu estado patrimonial: todo lo que tienes, menos todo lo que debes.', fondo: 'patrimonio-flecha' },
          { t: 'Diez clases para que el tiempo trabaje para ti. Empezamos.', fondo: 'interes-compuesto', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's1-b3-u6',
    titulo: 'Desde cien pesos',
    imagenes: {
      'prestarle-gobierno': 'A stylized government building with a small path of coins leading to it and a larger path returning, clean infographic',
      'comprar-descuento': 'Two banknote amounts drawn on paper with an arrow between them and the difference marked, clean diagram, no labels',
      'plazo-vence': 'A calendar with a maturity date circled and a small savings note beside it, desk setting',
      'salir-antes': 'A hand pulling a document out of a folder before its time, slight tension in the gesture, close up',
      'curva-normal': 'A gently ascending curve on a grid drawn on a whiteboard, a finger tracing it, clean chart',
      'curva-invertida': 'The same grid with the curve descending instead, clearly different shape, clean chart',
      'adivinar-momento': 'A person staring intently at a fluctuating chart trying to decide, hand hovering, tense expression',
      'monto-fijo-mensual': 'Twelve identical coin stacks arranged along a marked timeline on a table, perfectly regular, top down view',
      'comision-anual': 'A small slice being taken repeatedly from a growing pile, illustrative sequence on a plain surface',
      'documentos-publicados': 'A product information document open on a desk with one section under a magnifying glass, text blank',
      'activos-pasivos': 'A balance scale with several objects on one side and documents on the other, clean symbolic composition',
      'evolucion-trimestre': 'Four bars of increasing height drawn on a whiteboard with a date under each, clean chart, no labels',
    },
    laminas: [
      'prestarle-gobierno', 'comprar-descuento', 'plazo-vence', 'salir-antes', 'curva-normal',
      'curva-invertida', 'adivinar-momento', 'monto-fijo-mensual', 'comision-anual', 'documentos-publicados',
      'activos-pasivos', 'evolucion-trimestre',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'prestarle-gobierno',
        tomas: [
          'Puedes prestarle dinero al gobierno mexicano.',
          { t: 'Desde cien pesos.', cifra: ['100', 'para empezar'], recorte: [0.5, 0.5, 0.6] },
          'No hace falta ser rico ni tener contactos.',
          { t: 'Y es de los instrumentos con menor riesgo que existen en el país.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'comprar-descuento',
        tomas: [
          'Los de corto plazo funcionan de una forma curiosa.',
          { t: 'Se compran por debajo de su valor nominal, y al vencer te pagan el valor completo.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Esa diferencia es tu rendimiento. No hay pagos en el camino.' },
          { t: 'Los de plazo largo hacen lo contrario: pagan intereses periódicamente y devuelven el capital al final.', fondo: 'plazo-vence' },
          { t: 'Y el error más común es elegir el de mayor tasa sin ver cuándo necesitas el dinero.', fondo: 'salir-antes' },
          { t: 'Comprometer a un año fondos que harán falta en tres meses obliga a salir antes, y ahí se pierde.', fondo: 'salir-antes', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'curva-normal',
        tomas: [
          'Y hay una razón por la que más plazo suele pagar más.',
          { t: 'Comprometer dinero más tiempo implica no poder usarlo si aparece una necesidad.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y asumir la incertidumbre de lo que pase con las tasas en ese periodo.' },
          { t: 'Si grafícas las tasas de un mismo emisor contra sus plazos, sale una curva.', rotulo: 'Curva de rendimiento' },
          { t: 'Su forma normal es ascendente.' },
          { t: 'Pero a veces se aplana, o se invierte.', fondo: 'curva-invertida' },
          { t: 'Los plazos cortos pagan casi lo mismo que los largos, o incluso más.', fondo: 'curva-invertida' },
          { t: 'Suele leerse como que el mercado espera que las tasas bajen. Informa sobre expectativas, no garantiza nada.', fondo: 'curva-invertida', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'adivinar-momento',
        tomas: [
          'Todo el mundo quiere comprar barato y vender caro.',
          { t: 'Identificar esos momentos por adelantado es extremadamente difícil, incluso para quien se dedica a eso.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y mucha gente termina esperando el momento perfecto durante años, sin invertir nada.' },
          { t: 'Hay una estrategia que quita esa decisión de encima.', fondo: 'monto-fijo-mensual' },
          { t: 'Invertir la misma cantidad en intervalos regulares, sin importar el precio.', fondo: 'monto-fijo-mensual', rotulo: 'Monto fijo, siempre' },
          { t: 'Cuando el precio está alto compras menos unidades. Cuando está bajo, más.', fondo: 'monto-fijo-mensual' },
          { t: 'No garantiza ganancias ni te protege de una caída general.', fondo: 'monto-fijo-mensual' },
          { t: 'Lo que elimina es el riesgo de haber entrado con todo justo en el peor momento.', fondo: 'monto-fijo-mensual' },
          { t: 'Y su mayor valor no es matemático: es que convierte la inversión en un hábito.', fondo: 'monto-fijo-mensual', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'comision-anual',
        tomas: [
          'Ahora el enemigo silencioso.',
          { t: 'La comisión de administración se cobra cada año sobre el saldo total, no sobre la ganancia.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y hay un segundo efecto menos evidente.' },
          { t: 'Cada peso cobrado deja de estar ahí generando rendimiento los años siguientes.' },
          { t: 'Comparar dos productos por su rendimiento histórico sin mirar comisiones es comparar mal.', fondo: 'documentos-publicados' },
          { t: 'El rendimiento pasado no se repite. La comisión sí se cobra siempre.', fondo: 'documentos-publicados' },
          { t: 'Y están publicadas. Es información disponible que casi nadie consulta.', fondo: 'documentos-publicados' },
          { t: 'Y para cerrar, la foto más honesta de tu situación.', fondo: 'activos-pasivos' },
          { t: 'Tu patrimonio es todo lo que tienes menos todo lo que debes.', fondo: 'activos-pasivos', rotulo: 'Activos − pasivos' },
          { t: 'El ingreso mide cuánto entra. El patrimonio mide dónde estás parado. No son lo mismo.', fondo: 'activos-pasivos' },
          { t: 'Alguien con ingreso alto y deudas mayores tiene patrimonio negativo.', fondo: 'activos-pasivos' },
          { t: 'Y eso no es una condena, sobre todo al principio.', fondo: 'evolucion-trimestre' },
          { t: 'Lo que importa es la dirección: si cada trimestre la cifra mejora, vas bien.', fondo: 'evolucion-trimestre' },
          { t: 'Empieza con cien. Iguala el plazo. Y mira las comisiones antes que el rendimiento.', fondo: 'evolucion-trimestre', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 4 · ¡Es Hora de Emprender! ═══════════════════════════════════ */

  {
    id: 's1-b4-general',
    titulo: 'Validar antes de gastar',
    imagenes: {
      'lean-ciclo': 'A circular three step diagram drawn on a whiteboard with arrows connecting the steps, clean and simple',
      'investigar-cliente': 'A young entrepreneur interviewing a person at a Mexican market, notebook out, attentive listening',
      'estrategia-precio': 'Three price cards on a table representing different pricing methods, all blank, clean layout',
      'contabilidad-basica': 'A simple accounting ledger open on a desk with two columns of entries, all figures blank, pen resting',
      'emprendedores-mexicanos': 'A modern Mexican business office with a young diverse team working together, energetic and real',
      'entrevista-problema': 'Two people in conversation at a café table, one taking notes, the other gesturing while explaining a frustration',
      'mvp-simple': 'A simple but well made product on a workbench beside a long list of crossed out features on paper',
      'canales-venta': 'Three selling scenes shown in one composition: a street stall, a phone screen and a shop counter, clean spacing',
      'flujo-efectivo': 'An empty cash box on a desk beside a profitable looking sales ledger, ironic contrast, clean composition',
      'alta-sat': 'A person completing a tax registration on a laptop at a kitchen table, all screen fields blank, focused',
    },
    laminas: [
      'lean-ciclo', 'investigar-cliente', 'estrategia-precio', 'contabilidad-basica', 'emprendedores-mexicanos',
      'entrevista-problema', 'mvp-simple', 'canales-venta', 'flujo-efectivo', 'alta-sat',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'lean-ciclo',
        tomas: [
          'La mayoría de los negocios nuevos gasta primero y pregunta después.',
          { t: 'Este bloque hace lo contrario.', recorte: [0.5, 0.5, 0.6] },
          'Construir, medir, aprender. Y volver a empezar.',
          { t: 'Validar antes de gastar es la idea que sostiene las diez clases.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'investigar-cliente',
        tomas: [
          'Vas a aprender a investigar tu mercado de verdad.',
          { t: 'A saber quién es tu cliente real, que casi nunca es todo el mundo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y a fijar precios por tres métodos distintos: costo, valor y competencia.', fondo: 'estrategia-precio', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'contabilidad-basica',
        tomas: [
          'Vas a llevar contabilidad básica.',
          { t: 'Activos, pasivos y utilidades, sin miedo a las palabras.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y vas a analizar emprendedores mexicanos que sí lo lograron.', fondo: 'emprendedores-mexicanos' },
          { t: 'Para ver qué se repite en todos ellos.', fondo: 'emprendedores-mexicanos', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'entrevista-problema',
        tomas: [
          'La segunda mitad es puro trabajo de campo.',
          { t: 'Entrevistas centradas en el problema, no en tu solución.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El producto mínimo que ya sirve.', fondo: 'mvp-simple' },
          { t: 'Y dónde encontrar a tu cliente, con lo que cuesta cada canal.', fondo: 'canales-venta', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'flujo-efectivo',
        tomas: [
          'Y cierra con la lección que más negocios ha matado.',
          { t: 'Por qué un negocio rentable puede quebrar de todos modos.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y qué implica darte de alta ante el S A T.', fondo: 'alta-sat' },
          { t: 'Diez clases para no gastar tus ahorros en algo que nadie quería. Empezamos.', fondo: 'lean-ciclo', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's1-b4-u6',
    titulo: 'Rentable y quebrado',
    imagenes: {
      'idea-divertida': 'A young entrepreneur excitedly sketching product designs alone at a desk, absorbed in the fun part, night light',
      'contar-ultima-vez': 'Two people talking at a café, one recalling something specific while the other writes it down verbatim',
      'pregunta-sesgada': 'A person nodding politely at an enthusiastic pitch, non committal expression, plain background',
      'patrones-repiten': 'Several interview notes spread on a table with the same phrase underlined on many of them, top down view',
      'mvp-tres-funciones': 'A simple product on a workbench that does a few things well, clean and finished, beside a long crossed out list',
      'minimo-no-malo': 'Two versions of a product side by side, one simple and well made, one complicated and shoddy, clear contrast',
      'senal-confirma': 'A tally of repeat customers marked on a notebook page, growing column of marks, top down view',
      'canal-directo': 'A seller talking face to face with a customer at a small stall, high trust low reach, warm daylight',
      'canal-plataforma': 'A phone showing an online marketplace listing with blank fields, held above a packing table with parcels',
      'costo-adquisicion': 'A division written on a whiteboard with two blank numbers and a result, clean simple maths',
      'venta-a-credito': 'An invoice marked as pending on a desk beside an empty cash box, clean honest composition',
      'nomina-el-viernes': 'A small business owner looking at a payroll obligation on a calendar with visible concern, workshop background',
      'alta-sat-formal': 'A young entrepreneur completing a tax registration on a laptop at a kitchen table, all screen fields blank, focused and unhurried',
    },
    laminas: [
      'idea-divertida', 'contar-ultima-vez', 'pregunta-sesgada', 'patrones-repiten', 'mvp-tres-funciones',
      'minimo-no-malo', 'senal-confirma', 'canal-directo', 'canal-plataforma', 'costo-adquisicion',
      'venta-a-credito', 'nomina-el-viernes', 'alta-sat-formal',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'venta-a-credito',
        tomas: [
          'Un negocio puede ser rentable y quebrar de todos modos.',
          { t: 'Sin haber perdido dinero en ninguna venta.', recorte: [0.5, 0.5, 0.6] },
          'Suena imposible y pasa todos los días.',
          { t: 'Y para llegar ahí, primero hay que empezar por el principio.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'idea-divertida',
        tomas: [
          'Es tentador empezar por la idea del producto, porque es la parte divertida.',
          { t: 'Pero un producto excelente para un problema inexistente no tiene mercado.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Una entrevista de descubrimiento sigue reglas estrictas.', fondo: 'contar-ultima-vez' },
          { t: 'No se menciona tu solución. No se piden opiniones. No se pregunta por el futuro.', fondo: 'contar-ultima-vez' },
          { t: 'Se pide que cuenten qué hicieron la última vez que tuvieron ese problema.', fondo: 'contar-ultima-vez' },
          { t: 'Porque te gustaría una app que haga esto genera un sí amable que no significa nada.', fondo: 'pregunta-sesgada' },
          { t: 'Y no crees que sería útil arrastra a la persona a la respuesta que quieres oír.', fondo: 'pregunta-sesgada' },
          { t: 'Después se buscan patrones, no anécdotas.', fondo: 'patrones-repiten' },
          { t: 'Un problema mencionado por la mayoría, aunque lo cuenten sin emoción, pesa más que una historia dramática de una sola persona.', fondo: 'patrones-repiten', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'mvp-tres-funciones',
        tomas: [
          'Con eso ya se puede construir algo, y ese algo tiene nombre.',
          { t: 'M V P. El producto mínimo que ya sirve.', rotulo: 'MVP' },
          { t: 'La versión más simple que entrega valor real a un cliente y te enseña algo del mercado.', recorte: [0.5, 0.5, 0.6] },
          { t: 'No es un prototipo interno: alguien lo usa de verdad.' },
          { t: 'Y aquí está la confusión más común.', fondo: 'minimo-no-malo' },
          { t: 'Mínimo no significa mal hecho. Se reduce el alcance, no la calidad.', fondo: 'minimo-no-malo' },
          { t: 'Un producto con tres funciones que funcionan bien vale más que uno con diez a medias.', fondo: 'minimo-no-malo' },
          { t: 'Se define con una pregunta por cada función: sin esto, el cliente todavía resuelve su problema.', fondo: 'mvp-tres-funciones' },
          { t: 'Si la respuesta es sí, esa función sale de la primera versión.', fondo: 'mvp-tres-funciones' },
          { t: 'Y antes de lanzarlo se define qué señal confirmaría que funcionó.', fondo: 'senal-confirma' },
          { t: 'Cuántos lo usan más de una vez, cuántos pagan, cuántos lo recomiendan.', fondo: 'senal-confirma', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'canal-directo',
        tomas: [
          'Después hay que encontrar al cliente donde ya está.',
          { t: 'La venta directa da mucho control y poco alcance.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Las redes dan alcance amplio con costo variable.', fondo: 'canal-plataforma' },
          { t: 'Y las plataformas dan visibilidad pero cobran comisión y se quedan con la relación con el cliente.', fondo: 'canal-plataforma' },
          { t: 'Hay una métrica que ordena todo esto.', fondo: 'costo-adquisicion' },
          { t: 'El costo de adquisición: cuánto cuesta conseguir un cliente por ese canal.', fondo: 'costo-adquisicion', rotulo: 'Costo por cliente' },
          { t: 'Se divide lo invertido entre los clientes conseguidos.', fondo: 'costo-adquisicion' },
          { t: 'Tres mil pesos entre diez clientes son trescientos por cliente.', fondo: 'costo-adquisicion', cifra: ['300', 'por cliente'] },
          { t: 'Si cada cliente te deja menos que eso, el canal te está costando dinero.', fondo: 'costo-adquisicion', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'venta-a-credito',
        tomas: [
          'Y ahora sí, cómo quiebra un negocio rentable.',
          { t: 'La utilidad dice si ganas. El flujo de efectivo dice si tienes dinero hoy.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Son cosas distintas y se comportan distinto.' },
          { t: 'Vendes a crédito y la factura se cobra en sesenta días.' },
          { t: 'Esa venta ya cuenta como utilidad. Pero el dinero no está.' },
          { t: 'Y el viernes hay que pagar la nómina.', fondo: 'nomina-el-viernes' },
          { t: 'Los proveedores no esperan a que tus clientes te paguen.', fondo: 'nomina-el-viernes' },
          { t: 'Por eso crecer rápido puede matar un negocio: cada venta nueva exige material y sueldos antes de cobrar.', fondo: 'nomina-el-viernes' },
          { t: 'Y por eso todo lo anterior tiene un cierre burocrático que conviene entender.', fondo: 'alta-sat-formal' },
          { t: 'Darte de alta como persona física con actividad empresarial te permite facturar.', fondo: 'alta-sat-formal' },
          { t: 'Y te obliga a declarar, aunque un mes no hayas vendido nada.', fondo: 'alta-sat-formal' },
          { t: 'Pregunta por la última vez. Reduce el alcance, no la calidad. Y mira el flujo, no solo la utilidad.', fondo: 'nomina-el-viernes', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ RETO SUPREMO · Negocia Tu Sueldo ════════════════════════════════════ */

  {
    id: 's1-supremo',
    titulo: 'Negocia Tu Sueldo',
    imagenes: {
      'tres-ofertas': 'Three job offer letters laid side by side on a desk, all text blank, a pen resting between them',
      'sueldo-vs-total': 'A single large banknote stack beside a group of smaller stacks that together are taller, clean comparison',
      'entrevista-mesa': 'A young professional sitting across a desk from a recruiter, composed and prepared, modern office',
      'primer-numero': 'Two people in a negotiation, one waiting silently while the other hesitates to speak first, tense pause',
      'prestaciones': 'Icons of everyday benefits arranged around a job offer on a desk: health, savings, days off, food, clean flat lay',
      'firmar-tranquilo': 'A young professional signing a contract calmly with a copy already read beside them, unhurried, bright office',
    },
    laminas: ['tres-ofertas', 'sueldo-vs-total', 'entrevista-mesa', 'primer-numero', 'prestaciones', 'firmar-tranquilo'],
    bloques: [
      {
        paso: 0,
        fondo: 'tres-ofertas',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Tres ofertas de trabajo reales en México.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y una sola decisión: cuál te conviene de verdad.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'sueldo-vs-total',
        tomas: [
          'La oferta con el sueldo más alto no siempre es la mejor.',
          { t: 'Lo que cuenta es la compensación total.', rotulo: 'Compensación total' },
          { t: 'Sueldo neto, prestaciones, vales, fondo de ahorro y días libres.', fondo: 'prestaciones', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'primer-numero',
        tomas: [
          'Va a llegar el momento incómodo.',
          { t: 'Cuánto esperas ganar.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Quien llega sin un número investigado, acepta el primero que le dicen.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'entrevista-mesa',
        tomas: [
          'Negociar no es pedir más porque sí.',
          { t: 'Es mostrar qué aportas y qué paga el mercado por eso.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Con argumentos, no con necesidad.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'firmar-tranquilo',
        tomas: [
          'Gana quien maximiza la compensación total.',
          { t: 'No quien consigue el número más grande en una sola línea.' },
          { t: 'Investiga, compara y habla. Te esperan las tres ofertas.', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
