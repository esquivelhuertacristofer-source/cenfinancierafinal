/**
 * Secundaria 2 — 13 a 14 años. Nueve videos.
 *
 * REGISTRO. Riesgo, deuda y contratos, sin paternalismo. Es el grado donde se
 * puede decir "esto es difícil y la mayoría pierde dinero intentándolo" sin
 * suavizarlo, y donde una cadena causal de cuatro pasos —tasa objetivo, crédito,
 * gasto, precios— se sostiene entera.
 *
 * Contenido de `public/data/pedagogia/secundaria/s2.json`.
 * Diccion para XTTS: siglas deletreadas (I N P C, I G A E, E T F, C A C,
 * L T V, I S R), sin comillas, sin puntos suspensivos.
 */

export const ARGUMENTOS = [
  /* ═══ BLOQUE 1 · Primeros Pasos Hacia el Ahorro ═══════════════════════════ */

  {
    id: 's2-b1-general',
    titulo: 'La economía que sí te toca',
    imagenes: {
      'noticiero-economia': 'A television news broadcast about the economy playing in a Mexican living room while a teenager watches from the sofa, evening light',
      'banxico-fachada': 'The imposing facade of the central bank building in Mexico City, formal institutional architecture, clear daylight',
      'puerto-contenedores': 'A busy Mexican container port with cranes loading ships, industrial scale, bright morning',
      'organismos-globales': 'A large international conference room with national flags around a round table, empty chairs, institutional formality',
      'crisis-historica': 'A queue of worried people outside a bank on a Mexican street, period ambiguous, tense atmosphere',
      'termostato-economia': 'A large wall thermostat dial in a stylized economic setting with a hand adjusting it, clean symbolic illustration',
      'peso-dolar': 'A Mexican peso banknote and a US dollar banknote lying side by side on a table, plain even light, top down view',
      'calificadora-letras': 'A report on a desk with a prominent blank grade box and a magnifying glass beside it, institutional document',
      'remesas-familia': 'A Mexican family receiving money at a small remittance counter in a rural town, ordinary and warm',
      'indicadores-tablero': 'Three simple gauges drawn on a whiteboard in an office, blank faces, clean and organised',
    },
    laminas: [
      'noticiero-economia', 'banxico-fachada', 'puerto-contenedores', 'organismos-globales', 'crisis-historica',
      'termostato-economia', 'peso-dolar', 'calificadora-letras', 'remesas-familia', 'indicadores-tablero',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'noticiero-economia',
        tomas: [
          'Las noticias de economía suenan a un idioma que no es el tuyo.',
          { t: 'P I B, inflación, tipo de cambio, calificación crediticia.', recorte: [0.5, 0.5, 0.6] },
          'Y sin embargo cada una de esas palabras termina en tu casa.',
          { t: 'Este bloque las traduce.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'banxico-fachada',
        tomas: [
          'Empieza con los indicadores grandes y quién los mueve.',
          { t: 'Cómo el Banco de México controla la inflación, y con qué herramienta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Después el comercio internacional: qué vende México y qué compra.', fondo: 'puerto-contenedores' },
          { t: 'Y quiénes son el Fondo Monetario y el Banco Mundial.', fondo: 'organismos-globales', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'crisis-historica',
        tomas: [
          'Vas a estudiar tres crisis mexicanas.',
          { t: 'Noventa y cuatro, dos mil ocho y dos mil veinte.', recorte: [0.5, 0.5, 0.6] },
          { t: 'No como historia, sino para saber qué hacer cuando vuelva a pasar.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'termostato-economia',
        tomas: [
          'La segunda mitad baja todo a tu bolsillo.',
          { t: 'La tasa objetivo, que funciona como el termostato de la economía.', recorte: [0.5, 0.5, 0.6] },
          { t: 'La diferencia entre devaluación y depreciación.', fondo: 'peso-dolar' },
          { t: 'Y por qué importa la calificación de México.', fondo: 'calificadora-letras', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'remesas-familia',
        tomas: [
          'Y cierra con el peso real de las remesas.',
          { t: 'Y con los tres indicadores que sí vale la pena seguir, y con qué frecuencia.', fondo: 'indicadores-tablero', recorte: [0.5, 0.5, 0.6] },
          { t: 'Diez clases para dejar de escuchar las noticias como si hablaran de otro país. Empezamos.', fondo: 'noticiero-economia', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's2-b1-u6',
    titulo: 'El termostato de la economía',
    imagenes: {
      'termostato-mano': 'A hand adjusting a large stylized thermostat dial mounted on a wall, clean symbolic illustration, neutral background',
      'cadena-tasa': 'Four linked shapes drawn in a row on a whiteboard with arrows between them, clean diagram, no labels',
      'credito-variable': 'A loan statement on a desk with one figure area circled in pen, all values blank, close up',
      'peso-debil': 'A Mexican peso banknote shown smaller beside a foreign banknote, symbolic size difference, plain surface',
      'exportador-gana': 'A Mexican factory shipping crates onto a truck bound for export, busy and productive, morning light',
      'importador-pierde': 'An electronics shop owner in Mexico reviewing supplier invoices with concern, blank figures, shop interior',
      'comprar-dolares-tarde': 'A queue at a currency exchange window after a news event, people hurrying, urban Mexican street',
      'deuda-publica': 'A government treasury building with a stylized flow of bonds and money circulating around it, clean infographic',
      'porcentaje-pib': 'Two containers of very different sizes each holding proportionally similar amounts, clean visual comparison',
      'rating-letras': 'A credit rating report on a desk with a large blank grade box, magnifying glass beside it',
      'remesa-cuantos-pesos': 'Two remittance counters shown side by side, each with a blank amount board above it, clean comparison',
      'indicadores-mensuales': 'A wall calendar with a few specific days marked and a small chart pinned beside it, organised office wall',
    },
    laminas: [
      'termostato-mano', 'cadena-tasa', 'credito-variable', 'peso-debil', 'exportador-gana',
      'importador-pierde', 'comprar-dolares-tarde', 'deuda-publica', 'porcentaje-pib', 'rating-letras',
      'remesa-cuantos-pesos', 'indicadores-mensuales',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'termostato-mano',
        tomas: [
          'Hay una sola perilla que mueve casi toda la economía.',
          { t: 'La tasa objetivo del banco central.', recorte: [0.5, 0.5, 0.6] },
          'No es la tasa que tú pagas.',
          { t: 'Pero es el punto de partida desde donde se calculan todas las demás.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'cadena-tasa',
        tomas: [
          'Y la cadena tiene cuatro eslabones.',
          { t: 'Suben la tasa. El crédito se encarece. La gente y las empresas gastan menos.', recorte: [0.5, 0.5, 0.65] },
          { t: 'Y con menos gasto, la presión sobre los precios cede.' },
          { t: 'Al revés funciona igual: bajan la tasa y el crédito se abarata para reactivar la economía.' },
          { t: 'Pero no llega de inmediato ni igual a todos los productos.', fondo: 'credito-variable' },
          { t: 'Los créditos con tasa variable se ajustan rápido. Los de tasa fija ya pactada no cambian.', fondo: 'credito-variable' },
          { t: 'Con tasas altas conviene revisar tus deudas variables y aprovechar que el ahorro rinde más.', fondo: 'credito-variable', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'peso-debil',
        tomas: [
          'Ahora dos palabras que se usan como sinónimos y no lo son.',
          { t: 'Devaluación es una decisión oficial, dentro de un régimen de tipo de cambio fijo.', rotulo: 'Devaluación' },
          { t: 'Depreciación es la pérdida de valor que ocurre sola, por oferta y demanda.', rotulo: 'Depreciación' },
          { t: 'Y cuando el peso se debilita, no todos pierden.', fondo: 'exportador-gana' },
          { t: 'Ganan los exportadores: venden en moneda extranjera y sus costos son en pesos.', fondo: 'exportador-gana' },
          { t: 'Ganan quienes reciben remesas, porque cada dólar se convierte en más pesos.', fondo: 'exportador-gana' },
          { t: 'Pierden los importadores y todo lo que dependa de insumos comprados fuera.', fondo: 'importador-pierde' },
          { t: 'Y pierde quien tiene deudas en moneda extranjera.', fondo: 'importador-pierde' },
          { t: 'La reacción más común es comprar dólares justo cuando ya subieron.', fondo: 'comprar-dolares-tarde' },
          { t: 'Eso es comprar caro después de la noticia.', fondo: 'comprar-dolares-tarde', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'deuda-publica',
        tomas: [
          'La deuda pública es el dinero que un gobierno debe por haberse financiado emitiendo títulos.',
          { t: 'Y los acreedores no son otros países, como se suele creer.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Son inversionistas, fondos de pensiones y bancos. Incluso mexicanos.' },
          { t: 'El monto absoluto engaña.', fondo: 'porcentaje-pib' },
          { t: 'Billones suenan enormes, pero solo cobran sentido comparados con el tamaño de la economía que los sostiene.', fondo: 'porcentaje-pib' },
          { t: 'Por eso se mide como porcentaje del producto interno bruto.', fondo: 'porcentaje-pib' },
          { t: 'Y las calificadoras evalúan la probabilidad de que el emisor cumpla sus pagos.', fondo: 'rating-letras' },
          { t: 'No miden si un gobierno es bueno ni si la economía va bien. Solo eso.', fondo: 'rating-letras' },
          { t: 'Si la calificación baja, el país paga más por financiarse, y eso presiona las tasas internas hacia arriba.', fondo: 'rating-letras', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'remesa-cuantos-pesos',
        tomas: [
          'Las remesas son un flujo enorme de divisas hacia el país.',
          { t: 'Y en varias regiones son la principal fuente de ingreso de los hogares.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Cada envío tiene dos costos: uno visible y uno que casi nadie compara.' },
          { t: 'La comisión es el visible. El diferencial cambiario es el invisible.' },
          { t: 'Y solo hay una comparación válida.' },
          { t: 'Cuántos pesos llegan finalmente a manos de quien recibe, con el mismo monto enviado.' },
          { t: 'Y para cerrar, los indicadores que de verdad sirven.', fondo: 'indicadores-mensuales' },
          { t: 'El índice de precios te dice si tu ahorro está perdiendo poder de compra.', fondo: 'indicadores-mensuales' },
          { t: 'El indicador de actividad anticipa el ambiente laboral.', fondo: 'indicadores-mensuales' },
          { t: 'Y en México la informalidad revela más que la tasa de desempleo.', fondo: 'indicadores-mensuales' },
          { t: 'Se publican una vez al mes o al trimestre. Revisarlos a diario no aporta nada: el dato no cambió.', fondo: 'indicadores-mensuales' },
          { t: 'Sigue la cadena de la tasa. Compara cuántos pesos llegan. Y mira los datos cuando salen, no todos los días.', fondo: 'indicadores-mensuales', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 2 · Construyendo Independencia ═══════════════════════════════ */

  {
    id: 's2-b2-general',
    titulo: 'Proteger lo que ya tienes',
    imagenes: {
      'cat-contrato': 'A credit contract on a desk with one summary box outlined, all figures blank, pen resting beside it',
      'ciberseguridad': 'A laptop and a phone on a desk with a two step verification screen showing blank fields, secure and calm workspace',
      'perder-empleo': 'A person leaving an office building carrying a small box of belongings, dignified, overcast day',
      'escenarios-plan': 'Three branching paths drawn on a whiteboard from a single starting point, clean diagram',
      'testamento-notario': 'A family sitting with a notary at a simple desk signing documents, calm institutional office',
      'hospital-cuenta': 'A hospital admissions desk with a patient family waiting, institutional and busy, functional lighting',
      'robo-identidad': 'A shadowy figure at a laptop using someone elses documents, symbolic composition, dim light',
      'fondo-capas': 'Three containers of increasing size lined up on a shelf, clean composition, even light',
      'senales-alerta': 'A stack of unopened bank statements on a table beside a phone with notifications, quiet dread',
      'cobranza-llamada': 'A person taking a phone call at a table with a notebook open, writing down details calmly, composed',
    },
    laminas: [
      'cat-contrato', 'ciberseguridad', 'perder-empleo', 'escenarios-plan', 'testamento-notario',
      'hospital-cuenta', 'robo-identidad', 'fondo-capas', 'senales-alerta', 'cobranza-llamada',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'senales-alerta',
        tomas: [
          'Construir patrimonio toma años.',
          { t: 'Perderlo puede tomar una tarde.', recorte: [0.5, 0.5, 0.6] },
          'Este bloque no va de ganar más.',
          { t: 'Va de proteger lo que ya tienes.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'cat-contrato',
        tomas: [
          'Empieza por el costo real del dinero prestado.',
          { t: 'El C A T, las tasas y todo lo que un crédito cobra además del interés.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Después la ciberseguridad de tu patrimonio digital.', fondo: 'ciberseguridad' },
          { t: 'Porque hoy tu dinero vive detrás de una contraseña.', fondo: 'ciberseguridad', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'perder-empleo',
        tomas: [
          'Vas a conocer las protecciones que existen si pierdes el empleo.',
          { t: 'Y a armar un plan de contingencia con escenarios.', fondo: 'escenarios-plan', recorte: [0.5, 0.5, 0.62] },
          { t: 'Qué haría si pasa esto, decidido antes de que pase.', fondo: 'escenarios-plan' },
          { t: 'Y la planeación patrimonial: el testamento, que existe para que tu familia no herede un pleito.', fondo: 'testamento-notario', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'hospital-cuenta',
        tomas: [
          'La segunda mitad es de casos concretos.',
          { t: 'Cuánto pagas realmente en un siniestro médico, con números.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Cómo previenes un robo de identidad y qué haces si ya ocurrió.', fondo: 'robo-identidad' },
          { t: 'Y dónde guardar el fondo de emergencia para que rinda sin dejar de estar disponible.', fondo: 'fondo-capas', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cobranza-llamada',
        tomas: [
          'Y cierra con dos temas que nadie enseña y todos necesitan.',
          { t: 'Las señales tempranas de que una deuda se está saliendo de control.', fondo: 'senales-alerta', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y cómo hablar con cobranza sin ceder un solo derecho.', fondo: 'cobranza-llamada' },
          { t: 'Diez clases para que una mala racha no te tumbe. Empezamos.', fondo: 'cobranza-llamada', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's2-b2-u6',
    titulo: 'Cuánto pagas tú de verdad',
    imagenes: {
      'cuenta-hospital': 'A detailed hospital bill lying on a kitchen table with a calculator beside it, all figures blank, harsh honest light',
      'deducible-primero': 'Two stacked bars drawn on paper, the lower portion shaded differently from the upper, clean diagram, no labels',
      'coaseguro-reparto': 'A pie split into two very uneven portions drawn on a whiteboard, clean simple diagram',
      'tope-proteccion': 'A ceiling line drawn above a rising bar on a whiteboard, the bar stopping at the line, clean diagram',
      'prima-baja': 'Two insurance quotes side by side on a desk, all figures blank, a pen resting between them',
      'mensaje-falso': 'A phone showing an alarming message notification at night, the screen glare on a worried face',
      'dos-pasos': 'A phone showing a two step verification prompt with blank code fields, held securely in two hands',
      'ya-ocurrio': 'A person at a desk methodically working through a checklist while on the phone, focused damage control',
      'tres-capas': 'Three containers of increasing size lined up on a table, the smallest closest to the viewer, clean composition',
      'razon-endeudamiento': 'A division written on a whiteboard with two blank values and a percentage result, clean simple maths',
      'sobres-sin-abrir': 'A pile of unopened bank envelopes accumulating on a side table, dust visible, avoidance made visible',
      'registro-cobranza': 'A notebook with a dated log of phone calls, each entry short, pen resting on it, top down view',
    },
    laminas: [
      'cuenta-hospital', 'deducible-primero', 'coaseguro-reparto', 'tope-proteccion', 'prima-baja',
      'mensaje-falso', 'dos-pasos', 'ya-ocurrio', 'tres-capas', 'razon-endeudamiento',
      'sobres-sin-abrir', 'registro-cobranza',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'cuenta-hospital',
        tomas: [
          'Tienes seguro de gastos médicos mayores.',
          { t: 'Llega una cuenta de hospital y crees que la aseguradora paga todo.', recorte: [0.5, 0.5, 0.6] },
          'No es así, y no es un engaño.',
          { t: 'Está escrito desde el primer día, en tres palabras.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'deducible-primero',
        tomas: [
          'El deducible es lo primero que pagas tú, íntegro.',
          { t: 'Si el deducible es de veinte mil y la cuenta fue de quince mil, la aseguradora no paga nada.', cifra: ['0', 'paga la aseguradora'] },
          { t: 'Después viene el coaseguro: el resto se reparte por porcentaje.', fondo: 'coaseguro-reparto', rotulo: 'Coaseguro' },
          { t: 'Un diez por ciento significa que de cada peso adicional, tú pones diez centavos.', fondo: 'coaseguro-reparto' },
          { t: 'Sobre una cuenta grande, eso es mucho dinero.', fondo: 'coaseguro-reparto' },
          { t: 'Y aquí está la cláusula que más protege y que casi nadie compara.', fondo: 'tope-proteccion' },
          { t: 'El tope de coaseguro. Cuando lo alcanzas, la aseguradora cubre el resto al cien por ciento.', fondo: 'tope-proteccion' },
          { t: 'Por eso una prima baja casi siempre viene con deducible alto o sin tope.', fondo: 'prima-baja' },
          { t: 'La comparación correcta no es cuál cuesta menos al mes. Es cuánto tendrías que poner tú en el peor caso.', fondo: 'prima-baja', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'mensaje-falso',
        tomas: [
          'Ahora el riesgo que no avisa.',
          { t: 'Casi todos los intentos de fraude comparten los mismos rasgos.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Urgencia artificial, amenaza de bloqueo, un enlace que hay que abrir ya.' },
          { t: 'Y solicitud de datos que la institución ya tiene.' },
          { t: 'Ese último es el que delata todo: tu banco no necesita preguntarte tu número de cuenta.' },
          { t: 'La prevención que sí funciona es aburrida y eficaz.', fondo: 'dos-pasos' },
          { t: 'Verificación en dos pasos en tus cuentas financieras y de correo.', fondo: 'dos-pasos' },
          { t: 'Contraseñas distintas para cada servicio, y nada de operaciones bancarias en redes públicas.', fondo: 'dos-pasos' },
          { t: 'Y si ya ocurrió, el orden importa más que la prisa.', fondo: 'ya-ocurrio' },
          { t: 'Bloquear accesos y tarjetas, notificar a las instituciones, presentar la reclamación formal y denunciar.', fondo: 'ya-ocurrio', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'tres-capas',
        tomas: [
          'Con el fondo de emergencia hay dos errores opuestos.',
          { t: 'Guardarlo todo en efectivo garantiza disponibilidad y también una pérdida segura de poder adquisitivo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Invertirlo todo a plazo largo mejora el rendimiento y rompe su función.' },
          { t: 'La pregunta correcta no es cuánto rinde.' },
          { t: 'Es en cuánto tiempo puedo disponer de él.', rotulo: 'En cuánto tiempo dispongo' },
          { t: 'Por eso se diseña por capas.' },
          { t: 'Una primera capa pequeña, disponible hoy mismo, para lo que puede pasar en horas.' },
          { t: 'Una segunda, la más grande, liquidable en pocos días y que sí genere algo.' },
          { t: 'Y lo que nunca debe ser: instrumentos cuyo valor pueda caer justo cuando lo necesitas.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'razon-endeudamiento',
        tomas: [
          'Y falta la señal más objetiva de todas.',
          { t: 'La razón de endeudamiento: todos tus pagos mensuales de deuda entre tu ingreso neto.', rotulo: 'Razón de endeudamiento' },
          { t: 'Conforme sube, el margen para cualquier imprevisto desaparece.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y hay señales objetivas que se pueden verificar.' },
          { t: 'Pagar solo el mínimo de la tarjeta de forma habitual. Usar crédito para comida o servicios.' },
          { t: 'Pedir un crédito para pagar otro. Y no saber cuánto se debe en total.' },
          { t: 'Y hay señales subjetivas que llegan antes que los números.', fondo: 'sobres-sin-abrir' },
          { t: 'Evitar abrir los estados de cuenta. Sentir ansiedad con cada notificación del banco.', fondo: 'sobres-sin-abrir' },
          { t: 'Cada mes de espera reduce las opciones.', fondo: 'sobres-sin-abrir' },
          { t: 'Y si ya llegó cobranza, hay algo que hay que tener claro.', fondo: 'registro-cobranza' },
          { t: 'Deber no es delito. Una deuda de consumo es un asunto civil, no penal.', fondo: 'registro-cobranza', rotulo: 'Deber no es delito' },
          { t: 'Las amenazas de detención son presión, no una descripción de la ley.', fondo: 'registro-cobranza' },
          { t: 'Está prohibido humillar, llamar a horas inhábiles, contactar a tus vecinos o hacerse pasar por autoridad.', fondo: 'registro-cobranza' },
          { t: 'Anota cada contacto con fecha, hora, nombre y empresa. Y cualquier acuerdo, por escrito.', fondo: 'registro-cobranza' },
          { t: 'Compara por exposición. Activa dos pasos. Y calcula tu razón de endeudamiento hoy.', fondo: 'registro-cobranza', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 3 · Planificación y Crecimiento ══════════════════════════════ */

  {
    id: 's2-b3-general',
    titulo: 'Invertir de verdad',
    imagenes: {
      'bolsa-mexicana': 'The modern facade of the Mexican stock exchange building, contemporary architecture, clear daylight',
      'estados-empresa': 'A company annual report open on a desk with charts visible, all figures blank, professional setting',
      'portafolio-piezas': 'Several different containers arranged deliberately on a table in different proportions, clean composition',
      'fija-variable': 'A flat steady line and a jagged line drawn one above the other on a whiteboard, clean chart, no labels',
      'inversion-sostenible': 'Wind turbines on a Mexican hillside with a small town below, clean energy and community together, bright day',
      'tecnico-fundamental': 'Two screens side by side, one showing a price chart and one showing a balance sheet, all values blank',
      'indice-canasta': 'A large basket holding many small identical shapes, clean symbolic illustration on a plain surface',
      'rebalanceo-balanza': 'A balance scale being adjusted by a hand to return it to level, clean symbolic composition',
      'sesgos-emocion': 'A person watching a falling chart with hands on their head, and the same person watching a rising chart cheering, split composition',
      'impuestos-inversion': 'A tax statement for investment income on a desk with a pen, all figures blank, organised paperwork',
    },
    laminas: [
      'bolsa-mexicana', 'estados-empresa', 'portafolio-piezas', 'fija-variable', 'inversion-sostenible',
      'tecnico-fundamental', 'indice-canasta', 'rebalanceo-balanza', 'sesgos-emocion', 'impuestos-inversion',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'bolsa-mexicana',
        tomas: [
          'Hasta aquí has aprendido a guardar y a proteger.',
          { t: 'Este bloque va de hacer crecer.', recorte: [0.5, 0.5, 0.6] },
          'Y sin promesas: invertir de verdad es más aburrido y más difícil de lo que parece.',
          { t: 'Por eso vale la pena aprenderlo bien.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'estados-empresa',
        tomas: [
          'Empieza con cómo funciona la Bolsa Mexicana de Valores.',
          { t: 'Y con cómo se evalúa si una empresa vale lo que cuesta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Después vas a construir un portafolio paso a paso.', fondo: 'portafolio-piezas' },
          { t: 'Y a distinguir renta fija de renta variable según tus metas.', fondo: 'fija-variable', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'inversion-sostenible',
        tomas: [
          'Vas a conocer la inversión con criterios ambientales y sociales.',
          { t: 'Porque dónde pones tu dinero también es una decisión sobre qué se financia.', recorte: [0.5, 0.5, 0.6], respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'tecnico-fundamental',
        tomas: [
          'La segunda mitad separa dos formas de mirar.',
          { t: 'El análisis fundamental mira el negocio. El técnico mira el precio.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Vas a entender los fondos indizados, que compran el mercado completo.', fondo: 'indice-canasta' },
          { t: 'Y el rebalanceo, que mantiene el rumbo cuando el portafolio se desacomoda solo.', fondo: 'rebalanceo-balanza', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'sesgos-emocion',
        tomas: [
          'Y cierra con lo que más dinero cuesta.',
          { t: 'Tus propios sesgos: pánico, euforia y anclaje.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y los impuestos sobre lo que ganes, que también restan.', fondo: 'impuestos-inversion' },
          { t: 'Diez clases para invertir sin adivinar. Empezamos.', fondo: 'bolsa-mexicana', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's2-b3-u6',
    titulo: 'Comprar el mercado completo',
    imagenes: {
      'negocio-numeros': 'A company financial report open on a desk beside a calculator, all figures blank, focused professional workspace',
      'grafica-patrones': 'A candlestick style price chart on a screen with lines drawn over it, no labels, dim trading desk',
      'operar-corto': 'A person surrounded by multiple screens late at night, tense and tired, harsh screen light',
      'elegir-acciones': 'Many company logo shaped cards spread on a table with a hand hovering undecided, all cards blank',
      'canasta-indice': 'One large basket holding dozens of identical small shapes, clean symbolic illustration, plain surface',
      'una-operacion': 'A single confirmation screen on a phone with blank fields, held in one hand, clean and simple',
      'comision-etf': 'A product fact sheet on a desk with one small line under a magnifying glass, all text blank',
      'portafolio-desacomoda': 'Two bars of originally equal height now clearly unequal, drawn on a whiteboard, clean diagram',
      'rebalancear-vender': 'A hand moving a portion from a taller container to a shorter one on a table, clean symbolic action',
      'panico-vender-s2': 'A person hitting sell on a phone during a sharp market drop, panic in the gesture, dim room',
      'euforia-comprar': 'A group of people excitedly showing each other rising charts on their phones, contagious enthusiasm, café setting',
      'retencion-automatica': 'An investment statement with a deduction line highlighted faintly, all figures blank, desk setting',
    },
    laminas: [
      'negocio-numeros', 'grafica-patrones', 'operar-corto', 'elegir-acciones', 'canasta-indice',
      'una-operacion', 'comision-etf', 'portafolio-desacomoda', 'rebalancear-vender', 'panico-vender-s2',
      'euforia-comprar', 'retencion-automatica',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'elegir-acciones',
        tomas: [
          'Vencer al promedio del mercado de forma sostenida es extraordinariamente difícil.',
          { t: 'La mayoría de los fondos profesionales que lo intentan no lo consigue en periodos largos.', recorte: [0.5, 0.5, 0.6] },
          'Y los que lo logran, rara vez repiten.',
          { t: 'Ese dato no es pesimismo. Es el punto de partida.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'negocio-numeros',
        tomas: [
          'Hay dos formas de mirar una inversión, y miran cosas distintas.',
          { t: 'El análisis fundamental mira el negocio.', rotulo: 'Fundamental' },
          { t: 'Si gana dinero, si crece, cuánta deuda tiene y si genera flujo de efectivo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El técnico mira el precio.', fondo: 'grafica-patrones', rotulo: 'Técnico' },
          { t: 'Estudia el comportamiento histórico del precio y el volumen, buscando patrones y niveles.', fondo: 'grafica-patrones' },
          { t: 'No son enemigos: muchos usan el fundamental para decidir qué comprar y el técnico para afinar cuándo.', fondo: 'grafica-patrones' },
          { t: 'Pero hay una advertencia que hay que decir sin suavizarla.', fondo: 'operar-corto' },
          { t: 'Operar en plazos cortos exige tiempo, disciplina y tolerancia a perder.', fondo: 'operar-corto' },
          { t: 'La mayoría de quienes lo intentan sin preparación pierde dinero.', fondo: 'operar-corto', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'canasta-indice',
        tomas: [
          'Por eso existe una alternativa que resuelve el problema de raíz.',
          { t: 'Un índice es una canasta que representa un mercado, con reglas públicas sobre qué incluye y con qué peso.', rotulo: 'Índice' },
          { t: 'Un fondo indizado o un E T F replica esa canasta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Comprarlo es comprar el mercado completo en lugar de apostar a una empresa.' },
          { t: 'Con una sola operación obtienes exposición a decenas o cientos de empresas.', fondo: 'una-operacion' },
          { t: 'Si una quiebra, el efecto sobre el total es limitado.', fondo: 'una-operacion' },
          { t: 'Y antes de comprar se revisan cinco cosas.', fondo: 'comision-etf' },
          { t: 'Qué índice replica exactamente, su comisión anual, qué tan fielmente lo sigue, qué tan fácil es venderlo y en qué moneda está.', fondo: 'comision-etf', recorte: [0.5, 0.5, 0.62] },
          { t: 'La comisión merece atención especial, porque se cobra siempre y el rendimiento no está garantizado.', fondo: 'comision-etf', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'portafolio-desacomoda',
        tomas: [
          'Un portafolio se desacomoda solo, sin que hagas nada.',
          { t: 'Las clases de activo crecen a ritmos distintos.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Si la parte variable sube mucho más que la fija, su peso aumenta aunque nadie compre nada.' },
          { t: 'Y el portafolio termina con más riesgo del que decidiste tener.' },
          { t: 'Rebalancear es devolverlo a su composición objetivo.', fondo: 'rebalancear-vender', rotulo: 'Rebalancear' },
          { t: 'Vendiendo parte de lo que creció de más y comprando lo que quedó rezagado.', fondo: 'rebalancear-vender' },
          { t: 'Y se siente horrible, porque obliga a vender lo que va bien y comprar lo que va mal.', fondo: 'rebalancear-vender' },
          { t: 'Esa incomodidad es su mayor virtud: convierte una decisión emocional en una regla.', fondo: 'rebalancear-vender', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'panico-vender-s2',
        tomas: [
          'Y ahora lo que más dinero cuesta, que no es el mercado.',
          { t: 'El pánico hace vender durante las caídas, y convierte una pérdida temporal en definitiva.', recorte: [0.5, 0.5, 0.6] },
          { t: 'La euforia hace comprar en los máximos, cuando todo el mundo habla de lo mismo y ya subió.', fondo: 'euforia-comprar' },
          { t: 'El anclaje es fijarse en el precio al que compraste como si importara para el futuro.', fondo: 'euforia-comprar' },
          { t: 'No importa. Lo único relevante es qué se espera de aquí en adelante.', fondo: 'euforia-comprar' },
          { t: 'Y después de dos o tres aciertos aparece el exceso de confianza.', fondo: 'euforia-comprar' },
          { t: 'Es fácil concluir que uno tiene talento y no suerte, justo antes del error caro.', fondo: 'euforia-comprar' },
          { t: 'Los sesgos no se vencen con fuerza de voluntad en el momento.', fondo: 'panico-vender-s2' },
          { t: 'Se neutralizan con reglas escritas antes. Aportación automática, fechas fijas, límites definidos.', fondo: 'panico-vender-s2' },
          { t: 'Y falta la última resta.', fondo: 'retencion-automatica' },
          { t: 'En muchos instrumentos la institución retiene una parte a cuenta del impuesto.', fondo: 'retencion-automatica' },
          { t: 'Por eso lo que te abonan es menor que la tasa anunciada.', fondo: 'retencion-automatica' },
          { t: 'La comparación verdadera es tasa bruta, menos comisiones, menos impuestos, menos inflación.', fondo: 'retencion-automatica' },
          { t: 'Compra el mercado. Rebalancea con regla. Y decide en frío.', fondo: 'retencion-automatica', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 4 · ¡Es Hora de Emprender! ═══════════════════════════════════ */

  {
    id: 's2-b4-general',
    titulo: 'Del modelo a la escala',
    imagenes: {
      'canvas-nueve': 'A large business model canvas drawn on a whiteboard with nine empty sections, sticky notes blank, workshop room',
      'crecer-exponencial': 'Two rising lines drawn on a whiteboard, one straight and one curving sharply upward, clean chart',
      'rondas-inversion': 'A meeting between founders and investors around a conference table with a laptop open, professional and tense',
      'cultura-equipo': 'A small diverse startup team working together in a bright open office, collaborative energy',
      'empresa-social': 'A social enterprise workshop in Mexico where local artisans work with modern equipment, dignified and productive',
      'unit-economics': 'A single product on a table with its costs laid out around it in small labelled piles, all labels blank',
      'cac-ltv': 'Two bars of very different heights drawn on a whiteboard side by side, clean chart, no labels',
      'suscripcion-escalera': 'An ascending staircase of bars drawn on a whiteboard, each step slightly taller, clean chart',
      'cadena-proveedores': 'A chain of workshops and delivery vans connected across a stylized map, clean infographic',
      'pivotar-timon': 'A ship wheel being turned decisively by two hands, symbolic composition, clean illustration',
    },
    laminas: [
      'canvas-nueve', 'crecer-exponencial', 'rondas-inversion', 'cultura-equipo', 'empresa-social',
      'unit-economics', 'cac-ltv', 'suscripcion-escalera', 'cadena-proveedores', 'pivotar-timon',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'canvas-nueve',
        tomas: [
          'Ya sabes validar una idea y hacer un producto mínimo.',
          { t: 'Este bloque va del paso siguiente.', recorte: [0.5, 0.5, 0.6] },
          'Convertir eso en un negocio que aguante crecer.',
          { t: 'Que es donde mueren casi todos.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'crecer-exponencial',
        tomas: [
          'Empieza con el modelo de negocio completo, en nueve bloques.',
          { t: 'Y con la diferencia entre crecer en línea recta y crecer de verdad.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Después el financiamiento: qué son las rondas de inversión y qué se entrega a cambio.', fondo: 'rondas-inversion', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'cultura-equipo',
        tomas: [
          'Vas a ver liderazgo y cultura en equipos pequeños.',
          { t: 'Que es lo que decide si la gente buena se queda.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y el emprendimiento con propósito, donde el impacto es parte del modelo.', fondo: 'empresa-social', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'unit-economics',
        tomas: [
          'La segunda mitad son las cifras que deciden todo.',
          { t: 'La economía de una sola venta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El costo de conseguir un cliente y lo que ese cliente deja en toda su vida.', fondo: 'cac-ltv' },
          { t: 'Y el ingreso recurrente, con la cancelación que le pone techo.', fondo: 'suscripcion-escalera', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cadena-proveedores',
        tomas: [
          'Y cierra con lo que sostiene la promesa que le haces al cliente.',
          { t: 'Tus operaciones y tus proveedores.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y con cómo cambiar de rumbo sin tirar lo aprendido.', fondo: 'pivotar-timon' },
          { t: 'Diez clases para pasar del modelo a la escala. Empezamos.', fondo: 'canvas-nueve', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's2-b4-u6',
    titulo: 'Arregla la unidad antes de escalar',
    imagenes: {
      'una-venta': 'A single product on a clean table with small piles of its direct costs arranged beside it, all labels blank',
      'variables-fijos': 'Two groups of items separated on a table, one group varying in size and one identical regardless, clean layout',
      'punto-equilibrio': 'Two lines crossing on a whiteboard chart at a marked point, clean diagram, no labels',
      'escalar-perdida': 'A widening downward curve drawn on a whiteboard with an arrow following it, clean chart',
      'cac-division': 'A division written on a whiteboard with blank values, a marker resting below, clean simple maths',
      'ltv-vida': 'A timeline on paper with repeated purchase marks along it, growing total at the end, top down view',
      'retencion-palanca': 'A shop owner greeting a returning customer warmly by name, genuine relationship, small business interior',
      'venta-unica': 'A single completed sale at a counter with the customer walking away, transaction finished, plain interior',
      'escalera-suscripcion': 'An ascending staircase of bars drawn on a whiteboard, each step slightly taller, clean chart',
      'cancelacion-techo': 'A ceiling line drawn above an ascending staircase on a whiteboard, the steps flattening at the line',
      'proveedor-unico': 'A single supplier van at a loading dock with no alternatives in sight, quiet vulnerability',
      'pivote-timon': 'A ship wheel being turned decisively by two hands while the course markers stay visible, clean illustration',
    },
    laminas: [
      'una-venta', 'variables-fijos', 'punto-equilibrio', 'escalar-perdida', 'cac-division',
      'ltv-vida', 'retencion-palanca', 'venta-unica', 'escalera-suscripcion', 'cancelacion-techo',
      'proveedor-unico', 'pivote-timon',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'escalar-perdida',
        tomas: [
          'Hay un consejo que se repite en todos lados y que arruina negocios.',
          { t: 'Vende más y ya se arreglará.', recorte: [0.5, 0.5, 0.6] },
          'Si cada venta te deja pérdida, vender más acelera la quiebra.',
          { t: 'Primero se arregla la unidad. Después se escala.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'una-venta',
        tomas: [
          'La economía unitaria es el análisis de una sola venta.',
          { t: 'Cuánto entra y cuánto sale por cada unidad vendida.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Precio menos costos variables directos da la contribución unitaria.', rotulo: 'Contribución unitaria' },
          { t: 'Los variables cambian con cada venta: material, empaque, comisión de la plataforma, envío.', fondo: 'variables-fijos' },
          { t: 'Los fijos existen aunque no vendas nada: renta, sueldos base, suscripciones.', fondo: 'variables-fijos' },
          { t: 'Y de ahí sale una cifra que todo negocio debería conocer de memoria.', fondo: 'punto-equilibrio' },
          { t: 'El punto de equilibrio: cuántas unidades hay que vender para cubrir exactamente los costos fijos.', fondo: 'punto-equilibrio' },
          { t: 'Por debajo se pierde. Por encima se gana.', fondo: 'punto-equilibrio', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'cac-division',
        tomas: [
          'Y hay dos cifras que deciden si un negocio puede crecer.',
          { t: 'El costo de adquisición: todo lo invertido en conseguir clientes entre los clientes conseguidos.', rotulo: 'CAC' },
          { t: 'Incluye publicidad, promociones, comisiones y también tu tiempo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y el valor de vida del cliente.', fondo: 'ltv-vida', rotulo: 'LTV' },
          { t: 'Su contribución por compra, por cuántas veces compra al año, por cuántos años se queda.', fondo: 'ltv-vida' },
          { t: 'Si el valor de vida no supera claramente al costo de adquisición, cada cliente nuevo destruye valor.', fondo: 'ltv-vida' },
          { t: 'Y crecer empeora la situación.', fondo: 'ltv-vida' },
          { t: 'Bajar el costo de adquisición es difícil: depende de mercados competidos.', fondo: 'retencion-palanca' },
          { t: 'Subir el valor de vida está mucho más en tus manos. La retención es la palanca barata.', fondo: 'retencion-palanca', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'venta-unica',
        tomas: [
          'Ahora un modelo que cambia la forma de la gráfica.',
          { t: 'En la venta única, el esfuerzo de este mes produce el ingreso de este mes. Y nada más.', recorte: [0.5, 0.5, 0.6] },
          { t: 'En la suscripción, el esfuerzo de este mes produce ingreso este mes y todos los siguientes.', fondo: 'escalera-suscripcion' },
          { t: 'Treinta clientes al mes que casi no se van construyen una escalera ascendente.', fondo: 'escalera-suscripcion' },
          { t: 'Pero hay un número que le pone techo.', fondo: 'cancelacion-techo' },
          { t: 'La tasa de cancelación: el porcentaje de clientes que se van cada mes.', fondo: 'cancelacion-techo', rotulo: 'Cancelación' },
          { t: 'Cuando la base es tan grande que los que se van igualan a los que entran, el crecimiento se detiene solo.', fondo: 'cancelacion-techo' },
          { t: 'Por eso bajar un punto de cancelación suele valer más que vender más.', fondo: 'cancelacion-techo', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'proveedor-unico',
        tomas: [
          'Y todo lo que prometes depende de una cadena.',
          { t: 'Si prometes entregar en tres días, eso depende de tu proveedor, de tu proceso y de la logística.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El cliente no distingue en qué eslabón falló. Solo sabe que no llegó.' },
          { t: 'Y depender de un único proveedor para un insumo crítico es la fragilidad más común.' },
          { t: 'Si sube precios, se retrasa o cierra, el negocio entero se detiene.' },
          { t: 'Un plan de contingencia real tiene cuatro piezas.' },
          { t: 'Identificar el eslabón crítico. Tener un proveedor alterno con el que ya hayas comprado al menos una vez.' },
          { t: 'Mantener inventario de seguridad de lo esencial. Y acordar por escrito qué pasa si falla.' },
          { t: 'Y a veces, después de todo eso, hay que cambiar de rumbo.', fondo: 'pivote-timon' },
          { t: 'Pivotar no es empezar de cero.', fondo: 'pivote-timon', rotulo: 'Pivotar' },
          { t: 'Es cambiar una parte del modelo conservando lo que ya aprendiste del cliente.', fondo: 'pivote-timon' },
          { t: 'Arregla la unidad. Retén antes de adquirir. Y ten un proveedor alterno probado.', fondo: 'pivote-timon', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ RETO SUPREMO · Crisis Room: México 1994 ═════════════════════════════ */

  {
    id: 's2-supremo',
    titulo: 'Crisis Room: México 1994',
    imagenes: {
      'sala-crisis': 'A tense government situation room in the mid nineties with officials around a table and telephones, period detail, dramatic light',
      'reservas-caen': 'A descending bar chart on a large screen in a formal meeting room, no labels, tense atmosphere',
      'peso-presion': 'A Mexican peso banknote under visible strain, symbolic composition, dramatic side light',
      'decision-hora': 'A clock on a wall in a government office showing late night, officials still working below',
      'consecuencias-calle': 'A Mexican street in the mid nineties with a queue outside a bank and worried faces, period clothing',
      'leccion-historia': 'A history book open on a modern desk beside a laptop showing a chart, past and present together',
    },
    laminas: ['sala-crisis', 'reservas-caen', 'peso-presion', 'decision-hora', 'consecuencias-calle', 'leccion-historia'],
    bloques: [
      {
        paso: 0,
        fondo: 'sala-crisis',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Mil novecientos noventa y cuatro. Eres asesor económico del gobierno.', cifra: ['1994', ''], recorte: [0.5, 0.5, 0.6] },
          { t: 'Y el país se está quedando sin reservas.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'reservas-caen',
        tomas: [
          'Ninguna de tus opciones es buena.',
          { t: 'Todas tienen un costo, y el costo lo va a pagar alguien.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Eso es lo que hace difícil la política económica de verdad.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'peso-presion',
        tomas: [
          'Sostener el tipo de cambio cuesta reservas.',
          { t: 'Soltarlo encarece de golpe todo lo importado y las deudas en dólares.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y subir la tasa frena la salida de capital, pero también frena la economía.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'consecuencias-calle',
        tomas: [
          'Cada decisión que tomes llega a una calle.',
          { t: 'A una familia con un crédito, a una empresa que importa, a alguien que perdió su empleo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Los números de la sala son personas afuera.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'leccion-historia',
        tomas: [
          'Gana quien minimiza el daño total, no quien salva un solo indicador.',
          { t: 'Y quien lo hace a tiempo, no cuando ya no quedan opciones.', fondo: 'decision-hora' },
          { t: 'Entra a la sala. Te esperan mil novecientos noventa y cuatro.', fondo: 'sala-crisis', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
