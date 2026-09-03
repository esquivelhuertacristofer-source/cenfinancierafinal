/**
 * Secundaria 3 — 14 a 15 años. Nueve videos. El último grado.
 *
 * REGISTRO. Patrimonio, impuestos y proyecto de vida. Es el único grado donde
 * el alumno está a meses de que esto le pase de verdad: elegir carrera, cobrar
 * su primer trabajo, decidir un régimen fiscal. Por eso el tono no es "algún
 * día": es "el año que entra".
 *
 * Contenido de `public/data/pedagogia/secundaria/s3.json`.
 * Diccion para XTTS: siglas deletreadas (S A T, I S R, F I R E se dice fáier,
 * S A, S A S, S A P I, F I B R A se dice fibra), sin comillas.
 */

export const ARGUMENTOS = [
  /* ═══ BLOQUE 1 · Primeros Pasos Hacia el Ahorro ═══════════════════════════ */

  {
    id: 's3-b1-general',
    titulo: 'De los quince a los sesenta y cinco',
    imagenes: {
      'cuadro-completo': 'A large life planning board on a wall with a long horizontal timeline and several marked stages, all labels blank, study room',
      'linea-vida': 'A person shown at four ages walking along a single continuous path from left to right, stylized illustration',
      'universidad-decision': 'A fifteen year old Mexican student standing at a university open day with brochures, hopeful and slightly overwhelmed',
      'gig-economy': 'A young person working from a café with a laptop and a delivery bag on the chair beside them, modern mixed income',
      'checklist-adulto': 'A printed checklist on a desk with several empty boxes and a pen, clean organised workspace',
      'hitos-timeline': 'A hand drawn timeline on paper with ten marked points along it, each with a blank note, top down view',
      'costo-carrera': 'Three education paths shown in one composition: a public campus, a private campus and a laptop at home, clean layout',
      'trabajar-estudiar': 'A young person studying late at a desk still wearing a work uniform, tired but determined, night lamp',
      'freelance-cotizacion': 'A written quotation on a laptop screen with blank fields beside a notebook of hours, home office',
      'dinero-compartido': 'Two people sitting together at a kitchen table reviewing a shared budget notebook, calm and equal',
    },
    laminas: [
      'cuadro-completo', 'linea-vida', 'universidad-decision', 'gig-economy', 'checklist-adulto',
      'hitos-timeline', 'costo-carrera', 'trabajar-estudiar', 'freelance-cotizacion', 'dinero-compartido',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'checklist-adulto',
        tomas: [
          'Este es tu último año de esta materia.',
          { t: 'Y también el primero en que todo esto te va a pasar de verdad.', recorte: [0.5, 0.5, 0.6] },
          'Elegir carrera, cobrar tu primer trabajo, firmar tu primer contrato.',
          { t: 'Este bloque no habla de algún día. Habla del año que entra.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'cuadro-completo',
        tomas: [
          'Empieza juntando todo lo aprendido en un solo cuadro.',
          { t: 'Ahorro, gasto, inversión y protección, funcionando al mismo tiempo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y con un plan que va de los quince a los sesenta y cinco.', fondo: 'linea-vida' },
          { t: 'Con sus hitos: la universidad, el primer hogar, el retiro.', fondo: 'linea-vida', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'universidad-decision',
        tomas: [
          'Vas a evaluar cómo se financia la educación superior en México.',
          { t: 'Becas, créditos educativos, y qué devuelve realmente una carrera.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y vas a conocer la economía digital y sus formas de ingreso.', fondo: 'gig-economy' },
          { t: 'Con sus implicaciones fiscales, que casi nadie menciona.', fondo: 'gig-economy', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'hitos-timeline',
        tomas: [
          'La segunda mitad es tu propia hoja de ruta.',
          { t: 'Diez hitos con edad y monto, de los quince a los treinta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El costo real de una carrera pública, privada o en línea.', fondo: 'costo-carrera' },
          { t: 'Y si trabajar mientras estudias te conviene o te sale caro.', fondo: 'trabajar-estudiar', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'freelance-cotizacion',
        tomas: [
          'Y cierra con dos cosas muy prácticas.',
          { t: 'Cómo cobrar y facturar por tu cuenta sin trabajar gratis.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y cómo se maneja el dinero cuando es de dos.', fondo: 'dinero-compartido' },
          { t: 'Diez clases para el año que entra. Empezamos.', fondo: 'checklist-adulto', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's3-b1-u6',
    titulo: 'Ciento sesenta y ocho horas',
    imagenes: {
      'diez-hitos': 'A long hand drawn timeline across a large sheet of paper with ten marked milestones, all notes blank, desk view',
      'hito-edad-monto': 'A single sticky note on a wall with two blank fields, one for an age and one for an amount, clean close up',
      'orden-habilita': 'A staircase of stepping stones across water, each one needed to reach the next, clean symbolic illustration',
      'empezar-hoy': 'Two rising curves on a whiteboard starting at clearly different points, the earlier one far ahead, clean chart',
      'costos-directos': 'Tuition receipts and textbooks stacked on a desk, all text blank, institutional feel',
      'costos-indirectos': 'A bus pass, a laptop, a lunch container and rent papers arranged together on a table, flat lay',
      'costo-oportunidad-carrera': 'A young person in a university corridor and the same person in a work uniform, shown as one split composition',
      'ciento-sesenta-ocho': 'A weekly grid drawn on a whiteboard divided into many small blocks, most already shaded, clean diagram',
      'horas-fuera-aula': 'A student studying alone at a library table late in the day, books open, quiet concentration',
      'punto-quiebre': 'A line rising then falling drawn on a whiteboard with the peak marked, clean chart, no labels',
      'tarifa-freelance': 'A freelancer at a home desk calculating an hourly rate in a notebook beside a laptop, focused',
      'sueldo-fijo-propio': 'A person transferring a fixed monthly amount from a business jar to a personal one, clean symbolic action',
    },
    laminas: [
      'diez-hitos', 'hito-edad-monto', 'orden-habilita', 'empezar-hoy', 'costos-directos',
      'costos-indirectos', 'costo-oportunidad-carrera', 'ciento-sesenta-ocho', 'horas-fuera-aula', 'punto-quiebre',
      'tarifa-freelance', 'sueldo-fijo-propio',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'diez-hitos',
        tomas: [
          'De los quince a los treinta pasa casi todo.',
          { t: 'Estudios, primer empleo, salir de casa, primeras compras grandes, primeras inversiones.', recorte: [0.5, 0.5, 0.62] },
          'Quince años para diez decisiones que van a marcar las siguientes cuatro décadas.',
          { t: 'Y la mayoría de la gente llega a todas improvisando.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'hito-edad-monto',
        tomas: [
          'Un hito necesita dos cosas para serlo.',
          { t: 'Una edad y un monto.', rotulo: 'Edad y monto' },
          { t: 'Una meta sin fecha ni cifra no es un hito: es un deseo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y la estimación no tiene que ser exacta. Solo tiene que existir.' },
          { t: 'El orden importa tanto como el contenido.', fondo: 'orden-habilita' },
          { t: 'Hay hitos que habilitan a otros.', fondo: 'orden-habilita' },
          { t: 'El fondo de emergencia va antes que las primeras inversiones.', fondo: 'orden-habilita' },
          { t: 'Porque sin él, cualquier imprevisto te obliga a liquidarlas justo en mal momento.', fondo: 'orden-habilita' },
          { t: 'Y lo lejano es barato si empieza hoy.', fondo: 'empezar-hoy' },
          { t: 'Un hito a quince años pide una aportación mensual sorprendentemente pequeña. A los treinta pide una enorme.', fondo: 'empezar-hoy', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'costos-directos',
        tomas: [
          'Ahora la decisión más cara que vas a tomar pronto.',
          { t: 'Y casi todo el mundo la evalúa mirando solo la colegiatura.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Los costos directos son inscripción, colegiatura, materiales y titulación.' },
          { t: 'En una institución pública pueden ser muy bajos, aunque casi nunca cero.' },
          { t: 'Los indirectos son los que nadie suma.', fondo: 'costos-indirectos' },
          { t: 'Transporte diario durante años, comida fuera, equipo de cómputo, internet, y a veces mudanza y renta.', fondo: 'costos-indirectos' },
          { t: 'Pero el costo mayor de todos es otro.', fondo: 'costo-oportunidad-carrera' },
          { t: 'El ingreso que dejas de percibir por estudiar en lugar de trabajar tiempo completo.', fondo: 'costo-oportunidad-carrera', rotulo: 'Costo de oportunidad' },
          { t: 'En una carrera de cinco años, esa es una cifra enorme.', fondo: 'costo-oportunidad-carrera' },
          { t: 'Y no es un argumento para no estudiar. Es un argumento para elegir con los ojos abiertos.', fondo: 'costo-oportunidad-carrera', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'ciento-sesenta-ocho',
        tomas: [
          'La semana tiene ciento sesenta y ocho horas.',
          { t: 'Y no más.', cifra: ['168', 'horas'], recorte: [0.5, 0.5, 0.6] },
          { t: 'Contarla completa cambia la conversación.' },
          { t: 'Al sueño, la comida, los traslados y las clases les queda mucho menos espacio del que se cree.' },
          { t: 'Y hay horas que nadie cuenta.', fondo: 'horas-fuera-aula' },
          { t: 'Una materia no consume solo sus horas de clase: exige lectura, tareas, proyectos y exámenes.', fondo: 'horas-fuera-aula' },
          { t: 'La regla práctica es de una a dos horas fuera del aula por cada hora de clase.', fondo: 'horas-fuera-aula' },
          { t: 'Trabajar pocas horas suele ser compatible, y hasta bueno: aporta ingreso, experiencia y disciplina.', fondo: 'punto-quiebre' },
          { t: 'A partir de cierto umbral, cada hora adicional empieza a costar más de lo que aporta.', fondo: 'punto-quiebre' },
          { t: 'La pregunta correcta no es cuánto puedo trabajar. Es cuánto puedo trabajar sin que me cueste más de lo que gano.', fondo: 'punto-quiebre', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'tarifa-freelance',
        tomas: [
          'Y si vas a cobrar por tu cuenta, hay un error que casi todos cometen.',
          { t: 'Tomar el sueldo mensual de un empleo equivalente y dividirlo entre las horas.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Eso ignora que tú pagas tus herramientas, tu seguro y tus periodos sin trabajo.' },
          { t: 'Y hay tiempo que no se factura y sí existe.' },
          { t: 'Cotizar, coordinar, revisar, corregir y cobrar.' },
          { t: 'Si solo facturas el tiempo de producción, estás trabajando gratis buena parte de la semana.' },
          { t: 'Las reglas del cobro son cuatro y se pactan antes.' },
          { t: 'Cotización por escrito con alcance definido, anticipo antes de empezar, plazo de pago acordado y consecuencia clara si se retrasa.' },
          { t: 'Y el ingreso independiente es irregular por naturaleza.', fondo: 'sueldo-fijo-propio' },
          { t: 'El mecanismo que funciona es pagarte un sueldo fijo por debajo de tu promedio.', fondo: 'sueldo-fijo-propio' },
          { t: 'Los meses buenos alimentan el colchón. Los malos salen de ahí.', fondo: 'sueldo-fijo-propio' },
          { t: 'Ponle edad y monto a cada hito. Cuenta las horas fuera del aula. Y cobra anticipo.', fondo: 'sueldo-fijo-propio', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 2 · Construyendo Independencia ═══════════════════════════════ */

  {
    id: 's3-b2-general',
    titulo: 'El año en que empiezas a cobrar',
    imagenes: {
      'declaracion-anual': 'A laptop showing a tax declaration portal with blank fields on a kitchen table, folder of receipts beside it',
      'presupuesto-universitario': 'A student counting limited money at a shared flat kitchen table, modest surroundings, honest light',
      'primer-contrato': 'A young person reading an employment contract carefully at a desk before signing, unhurried',
      'fire-concepto': 'A person walking away from an office building toward open landscape, symbolic freedom, clear daylight',
      'psicologia-dinero': 'A person looking at their own reflection with a wallet in hand, introspective composition',
      'resico-eleccion': 'Two folder tabs on a desk representing two options, both labels blank, a hand about to choose',
      'facturas-carpeta': 'An organised folder of receipts and invoices on a shelf, all text blank, tidy home office',
      'mudarme-cajas': 'A young adult surrounded by moving boxes in a small empty flat, first day, natural light',
      'primer-credito': 'A first credit card lying on a table beside a payment calendar, modest and new',
      'auto-viaje-inversion': 'A car key, a passport and a savings statement arranged side by side on a table, top down view',
    },
    laminas: [
      'declaracion-anual', 'presupuesto-universitario', 'primer-contrato', 'fire-concepto', 'psicologia-dinero',
      'resico-eleccion', 'facturas-carpeta', 'mudarme-cajas', 'primer-credito', 'auto-viaje-inversion',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'primer-contrato',
        tomas: [
          'Muy pronto vas a firmar tu primer contrato de trabajo.',
          { t: 'Y a cobrar dinero que es tuyo, con obligaciones que también lo son.', recorte: [0.5, 0.5, 0.6] },
          'Nadie te va a explicar esto en la oficina.',
          { t: 'Este bloque sí.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'declaracion-anual',
        tomas: [
          'Empieza con tu primera declaración anual.',
          { t: 'Qué es el impuesto sobre la renta y qué deducciones existen.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Después, cómo vivir con un presupuesto limitado en la universidad.', fondo: 'presupuesto-universitario' },
          { t: 'Sin endeudarte a los diecinueve años.', fondo: 'presupuesto-universitario', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'fire-concepto',
        tomas: [
          'Vas a negociar tu primer salario y a leer tu primer contrato.',
          { t: 'Y a conocer el movimiento que propone retirarse muy joven.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Con sus matemáticas y con lo que exige a cambio.' },
          { t: 'Y la psicología del dinero: por qué decidimos como decidimos.', fondo: 'psicologia-dinero', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'resico-eleccion',
        tomas: [
          'La segunda mitad es tu vida fiscal real.',
          { t: 'Qué régimen te conviene el día que empieces a cobrar.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Cómo funcionan las deducciones y cuándo sale una devolución.', fondo: 'facturas-carpeta' },
          { t: 'Y cuándo estás listo de verdad para mudarte solo.', fondo: 'mudarme-cajas', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'primer-credito',
        tomas: [
          'Y cierra con dos decisiones que marcan años.',
          { t: 'Cómo construir historial crediticio desde cero, sin dañarlo en el intento.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y cómo elegir entre un auto, un viaje o una inversión.', fondo: 'auto-viaje-inversion' },
          { t: 'Diez clases para el año en que empiezas a cobrar. Empezamos.', fondo: 'primer-contrato', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's3-b2-u6',
    titulo: 'Tu primera decisión fiscal',
    imagenes: {
      'dos-regimenes': 'Two document folders side by side on a desk, both labels blank, a hand hovering between them',
      'gastos-bajos': 'A laptop and a notebook on a plain desk, almost no equipment or materials, minimal setup',
      'gastos-altos': 'A workshop bench covered with tools, materials and supplier invoices, clearly cost heavy operation',
      'retencion-anual': 'A payroll summary for a full year on a desk with a deduction column visible, all figures blank',
      'comprobante-nombre': 'A receipt on a desk with the name and details area blank, under a magnifying glass',
      'pago-bancario': 'A card payment being made at a clinic counter instead of cash, ordinary healthcare setting',
      'carpeta-enero': 'A folder labelled with a blank tab on a shelf being filled with receipts throughout the year, home office',
      'costo-arranque': 'Moving boxes, basic furniture, kitchenware and bedding laid out together in an empty room, first setup',
      'tres-condiciones': 'Three boxes drawn on a whiteboard with tick marks in each, clean simple diagram',
      'compartir-vivienda': 'Two young flatmates cooking together in a small shared kitchen, warm and functional',
      'pagar-a-tiempo': 'A payment confirmation on a phone screen beside a calendar with a date well before the deadline',
      'usar-poco-linea': 'A credit limit bar drawn on a whiteboard with only a small portion shaded, clean diagram',
    },
    laminas: [
      'dos-regimenes', 'gastos-bajos', 'gastos-altos', 'retencion-anual', 'comprobante-nombre',
      'pago-bancario', 'carpeta-enero', 'costo-arranque', 'tres-condiciones', 'compartir-vivienda',
      'pagar-a-tiempo', 'usar-poco-linea',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'dos-regimenes',
        tomas: [
          'El día que empieces a cobrar por tu cuenta vas a tener que elegir algo.',
          { t: 'Tu régimen fiscal.', recorte: [0.5, 0.5, 0.55] },
          'Y casi nadie sabe que esa elección decide cuánto pagas.',
          { t: 'Elegir el que no corresponde puede costar bastante dinero.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'gastos-bajos',
        tomas: [
          'El régimen determina cuatro cosas.',
          { t: 'Cuánto pagas, con qué frecuencia declaras, qué puedes deducir y cuánta contabilidad llevas.', recorte: [0.5, 0.5, 0.62] },
          { t: 'El simplificado de confianza aplica tasas bajas sobre los ingresos.' },
          { t: 'Y reduce mucho las obligaciones de contabilidad. Pero casi no permite deducir.' },
          { t: 'El de actividad empresarial calcula el impuesto sobre la utilidad.', fondo: 'gastos-altos' },
          { t: 'Es decir, sobre los ingresos menos las deducciones autorizadas.', fondo: 'gastos-altos' },
          { t: 'Exige más obligaciones, pero permite descontar los gastos del negocio.', fondo: 'gastos-altos' },
          { t: 'Y la regla para decidir es directa.', fondo: 'dos-regimenes' },
          { t: 'Si tus gastos son bajos respecto a tus ingresos, el simplificado suele salir mejor.', fondo: 'gastos-bajos' },
          { t: 'Si son altos, poder deducirlos compensa con creces el trabajo extra.', fondo: 'gastos-altos', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'retencion-anual',
        tomas: [
          'Y existe algo que mucha gente ni sabe que puede pedir.',
          { t: 'A lo largo del año te retienen impuestos sobre el sueldo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Al declarar y aplicar tus deducciones personales, puede resultar que retuvieron de más.' },
          { t: 'Y esa diferencia te la devuelven.' },
          { t: 'Se pueden deducir gastos médicos, dentales y hospitalarios, primas de seguros de gastos médicos y colegiaturas dentro de ciertos límites.' },
          { t: 'Pero hay dos requisitos que todo el mundo olvida.', fondo: 'comprobante-nombre' },
          { t: 'El comprobante fiscal debe estar a tu nombre, con tus datos correctos.', fondo: 'comprobante-nombre' },
          { t: 'Y el pago debe haberse hecho por medio bancario, no en efectivo.', fondo: 'pago-bancario' },
          { t: 'Un gasto médico perfectamente deducible pagado en efectivo simplemente no cuenta.', fondo: 'pago-bancario' },
          { t: 'Y esto no se arregla en abril.', fondo: 'carpeta-enero' },
          { t: 'O pediste el comprobante y pagaste con tarjeta en su momento, o la deducción se perdió.', fondo: 'carpeta-enero', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'costo-arranque',
        tomas: [
          'Ahora la mudanza, que casi siempre se calcula mal.',
          { t: 'Antes de la primera renta hay depósito, mes adelantado, mudanza, muebles básicos y contratación de servicios.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Ese desembolso inicial suele ser varias veces la renta mensual.' },
          { t: 'Y los primeros meses cuestan más que los siguientes.' },
          { t: 'Aparece lo que faltó comprar, lo que se rompió al mudarse y los ajustes de la vivienda.' },
          { t: 'Hay tres condiciones para estar listo.', fondo: 'tres-condiciones' },
          { t: 'Ingreso estable que cubra el presupuesto completo con margen, no justo.', fondo: 'tres-condiciones' },
          { t: 'El costo de arranque disponible sin recurrir a crédito.', fondo: 'tres-condiciones' },
          { t: 'Y una reserva de al menos tres meses de gastos.', fondo: 'tres-condiciones' },
          { t: 'Posponerla seis meses para llegar con las tres cumplidas no es renunciar.', fondo: 'compartir-vivienda' },
          { t: 'Es asegurarte de no tener que volver.', fondo: 'compartir-vivienda', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'pagar-a-tiempo',
        tomas: [
          'Y falta construir algo que hoy no tienes: historial.',
          { t: 'De todos los factores, el más importante con diferencia es pagar a tiempo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Un solo atraso puede pesar más que meses de comportamiento correcto.' },
          { t: 'El segundo factor es cuánto usas de lo que te dan.', fondo: 'usar-poco-linea' },
          { t: 'Usar casi toda la línea disponible se lee como señal de presión financiera, aunque pagues completo.', fondo: 'usar-poco-linea' },
          { t: 'Y la antigüedad cuenta.', fondo: 'usar-poco-linea' },
          { t: 'Por eso no conviene cancelar la primera tarjeta cuando lleguen mejores ofertas: su antigüedad es un activo.', fondo: 'usar-poco-linea' },
          { t: 'Y toda decisión grande pasa por cuatro preguntas.', fondo: 'usar-poco-linea' },
          { t: 'Qué problema resuelve. Cuál es el costo total, no el precio.', fondo: 'pagar-a-tiempo' },
          { t: 'A qué renuncio al elegirla. Y si es reversible.', fondo: 'pagar-a-tiempo' },
          { t: 'Una decisión reversible se toma rápido. Una irreversible merece mucho más análisis.', fondo: 'pagar-a-tiempo' },
          { t: 'Elige tu régimen con tus gastos en la mano. Pide comprobante a tu nombre. Y paga a tiempo, siempre.', fondo: 'pagar-a-tiempo', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 3 · Planificación y Crecimiento ══════════════════════════════ */

  {
    id: 's3-b3-general',
    titulo: 'Construir patrimonio',
    imagenes: {
      'retiro-desde-quince': 'A fifteen year old at a desk looking at a long rising curve on a laptop screen, thoughtful, natural light',
      'ladrillos-digitales': 'A physical building and a phone showing a property investment screen side by side, clean composition',
      'blockchain-red': 'A stylized network of connected nodes glowing on a dark background, clean technical illustration',
      'venture-capital': 'A small startup team pitching to investors in a modern meeting room, energetic and tense',
      'blindaje-escudo': 'A protective shield illustrated over a house, a business and a family, clean symbolic composition',
      'regla-110': 'A pie split into two portions of clearly different sizes drawn on a whiteboard, clean diagram',
      'ingreso-pasivo-real': 'A small rental apartment building with a maintenance worker fixing something on site, honest reality of property income',
      'fibra-bolsa': 'A shopping centre and an industrial warehouse shown beside a phone with a trading screen, clean composition',
      'invertir-extranjero': 'A world map on a wall with a few marked points and a phone showing an investment screen, study room',
      'fideicomiso-legal': 'A formal legal document being signed at a notary office with two parties present, institutional setting',
    },
    laminas: [
      'retiro-desde-quince', 'ladrillos-digitales', 'blockchain-red', 'venture-capital', 'blindaje-escudo',
      'regla-110', 'ingreso-pasivo-real', 'fibra-bolsa', 'invertir-extranjero', 'fideicomiso-legal',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'retiro-desde-quince',
        tomas: [
          'A los quince años tienes algo que ningún adulto puede comprar.',
          { t: 'Cincuenta años por delante.', recorte: [0.5, 0.5, 0.6] },
          'Este bloque va de usar eso.',
          { t: 'De construir patrimonio, no solo de administrar un sueldo.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'ladrillos-digitales',
        tomas: [
          'Empieza con un plan de retiro construido desde ahora.',
          { t: 'Después la inversión inmobiliaria, física y digital.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y los criptoactivos con la tecnología que hay detrás.', fondo: 'blockchain-red' },
          { t: 'Evaluados como lo que son: un activo especulativo.', fondo: 'blockchain-red', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'venture-capital',
        tomas: [
          'Vas a conocer cómo se invierte en empresas que apenas nacen.',
          { t: 'Y por qué la mayoría de ellas no llega.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y el blindaje financiero: seguros y herramientas para proteger lo construido.', fondo: 'blindaje-escudo', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'regla-110',
        tomas: [
          'La segunda mitad es totalmente práctica.',
          { t: 'Cuánto riesgo te toca según tu edad, con una regla sencilla.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Qué ingresos pasivos existen de verdad y cuáles son una promesa de internet.', fondo: 'ingreso-pasivo-real' },
          { t: 'Y cómo invertir en bienes raíces desde la bolsa.', fondo: 'fibra-bolsa', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'invertir-extranjero',
        tomas: [
          'Y cierra con dos temas de adulto.',
          { t: 'Invertir fuera de México y qué hace el tipo de cambio con tu resultado.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y los instrumentos legales que protegen un patrimonio.', fondo: 'fideicomiso-legal' },
          { t: 'Diez clases para construir algo que dure. Empezamos.', fondo: 'retiro-desde-quince', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's3-b3-u6',
    titulo: 'Menos pasivo de lo que parece',
    imagenes: {
      'edad-riesgo': 'Two pies split in clearly different proportions drawn side by side on a whiteboard, clean diagram, no labels',
      'restar-edad': 'A simple subtraction written on a whiteboard with a blank result, marker resting below',
      'promesa-internet': 'A phone screen showing an aggressive promotional post about easy income, blank text, held in one hand',
      'inmueble-mantenimiento': 'A landlord fixing a leaking pipe in a rental flat, work clothes and tools, honest and unglamorous',
      'regalias-trabajo-previo': 'A finished book and a recording setup on a desk, the work already done, quiet studio',
      'fibra-centro': 'A large shopping centre exterior in Mexico with shoppers arriving, busy commercial property',
      'fibra-fraccion': 'A tiny fraction shaded on a large drawn rectangle, clean symbolic diagram on plain background',
      'sin-control': 'A person watching a building from across the street with no keys in hand, distant ownership',
      'doble-efecto': 'Two arrows drawn on a whiteboard pointing in different directions from a single point, clean diagram',
      'peso-se-deprecia': 'A foreign banknote and a peso banknote on a scale tipping toward the foreign one, clean composition',
      'gastos-en-pesos': 'A Mexican grocery receipt and a wallet on a kitchen counter, ordinary everyday spending',
      'separar-patrimonio': 'A house and a workshop drawn separated by a clear line on a whiteboard, clean symbolic diagram',
    },
    laminas: [
      'edad-riesgo', 'restar-edad', 'promesa-internet', 'inmueble-mantenimiento', 'regalias-trabajo-previo',
      'fibra-centro', 'fibra-fraccion', 'sin-control', 'doble-efecto', 'peso-se-deprecia',
      'gastos-en-pesos', 'separar-patrimonio',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'promesa-internet',
        tomas: [
          'Gana dinero mientras duermes.',
          { t: 'Es la frase más repetida de internet, y casi siempre está vendiendo algo.', recorte: [0.5, 0.5, 0.6] },
          'El ingreso pasivo existe.',
          { t: 'Pero es bastante menos pasivo de lo que parece.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'edad-riesgo',
        tomas: [
          'Antes de eso, cuánto riesgo te toca a ti.',
          { t: 'La renta variable puede caer con fuerza en periodos cortos, e históricamente ha recuperado en periodos largos.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Por eso el tiempo es lo que permite tomar riesgo.' },
          { t: 'Hay una regla de bolsillo para empezar.', fondo: 'restar-edad' },
          { t: 'Réstale tu edad a ciento diez. Eso da el porcentaje aproximado que podría ir a renta variable.', fondo: 'restar-edad', rotulo: '110 − edad' },
          { t: 'A los veinte años daría alrededor de noventa por ciento. El resto, en renta fija.', fondo: 'restar-edad', cifra: ['90%', 'variable a los 20'] },
          { t: 'Pero la regla ignora cosas importantes.', fondo: 'edad-riesgo' },
          { t: 'Si tu ingreso es estable, si ya tienes fondo de emergencia, y qué tanto aguantas ver caer tu dinero.', fondo: 'edad-riesgo' },
          { t: 'Se usa como punto de partida y se ajusta. No como sentencia.', fondo: 'edad-riesgo', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'inmueble-mantenimiento',
        tomas: [
          'Ahora sí, el ingreso pasivo real.',
          { t: 'Es aquel que no exige intercambiar tiempo por dinero de forma continua.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pero no aparece de la nada: casi siempre es capital acumulado antes, o trabajo hecho antes.' },
          { t: 'Los rendimientos de inversiones requieren capital.' },
          { t: 'Las rentas de inmuebles requieren capital y además gestión, reparaciones y periodos sin inquilino.' },
          { t: 'Y las regalías requieren haber creado algo primero.', fondo: 'regalias-trabajo-previo' },
          { t: 'Casi ninguna fuente es completamente pasiva.', fondo: 'regalias-trabajo-previo' },
          { t: 'Un producto digital deja de venderse si nadie lo actualiza.', fondo: 'regalias-trabajo-previo' },
          { t: 'Y las señales de alarma son siempre las mismas.', fondo: 'promesa-internet' },
          { t: 'Rendimientos fuera de mercado presentados como garantizados. Presión para decidir ya. Ganancias que dependen de reclutar gente.', fondo: 'promesa-internet', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'fibra-centro',
        tomas: [
          'Se puede invertir en bienes raíces sin comprar un inmueble.',
          { t: 'Existen vehículos que reúnen capital de muchos inversionistas para comprar y administrar propiedades que generan renta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Centros comerciales, naves industriales, oficinas, hoteles.' },
          { t: 'Y las ventajas frente a comprar directo son claras.', fondo: 'fibra-fraccion' },
          { t: 'El monto mínimo es una fracción diminuta del precio de un inmueble.', fondo: 'fibra-fraccion' },
          { t: 'Y puedes vender en el mercado en lugar de esperar meses a un comprador.', fondo: 'fibra-fraccion' },
          { t: 'Las limitaciones también son claras.', fondo: 'sin-control' },
          { t: 'No tienes control sobre qué inmuebles se compran ni cómo se administran.', fondo: 'sin-control' },
          { t: 'Y el precio fluctúa en el mercado, así que puede caer aunque las rentas se sigan cobrando.', fondo: 'sin-control', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'doble-efecto',
        tomas: [
          'Y falta salir de México, al menos con una parte.',
          { t: 'Cuando todo tu patrimonio está en un país, una crisis local golpea a la vez tu empleo, tu moneda y tus inversiones.', recorte: [0.5, 0.5, 0.6] },
          { t: 'En una inversión internacional pasan dos cosas al mismo tiempo.' },
          { t: 'El activo se mueve en su moneda, y el tipo de cambio se mueve frente al peso.' },
          { t: 'Un activo que sube diez por ciento en dólares puede darte más o menos en pesos, según qué hizo el tipo de cambio.' },
          { t: 'Y el riesgo cambiario también protege.', fondo: 'peso-se-deprecia' },
          { t: 'Si el peso se deprecia, esa parte de tu patrimonio aumenta su valor medido en pesos.', fondo: 'peso-se-deprecia' },
          { t: 'La pregunta útil no es si exponerse, sino en qué proporción.', fondo: 'gastos-en-pesos' },
          { t: 'Quien va a vivir y gastar toda su vida en pesos no debería tener todo en otra moneda.', fondo: 'gastos-en-pesos' },
          { t: 'Y cuando ya hay algo que proteger, aparece el blindaje legal.', fondo: 'separar-patrimonio' },
          { t: 'Operar un negocio a título personal deja tu patrimonio personal expuesto a las deudas del negocio.', fondo: 'separar-patrimonio' },
          { t: 'Constituir una sociedad crea una persona jurídica distinta, y separa los dos frentes.', fondo: 'separar-patrimonio' },
          { t: 'Blindar no es esconder. Todo esto es legal, público y verificable.', fondo: 'separar-patrimonio' },
          { t: 'Ajusta el riesgo a tu edad. Desconfía de lo garantizado. Y separa el negocio de tu casa.', fondo: 'separar-patrimonio', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 4 · ¡Es Hora de Emprender! ═══════════════════════════════════ */

  {
    id: 's3-b4-general',
    titulo: 'De negocio a empresa',
    imagenes: {
      'sistemas-procesos': 'A small factory floor with clearly marked stations and process boards on the wall, all boards blank, organised operation',
      'exportar-mexico': 'Crates marked for export being loaded at a Mexican warehouse dock, international shipping, bright day',
      'propiedad-intelectual': 'A trademark registration certificate on a desk beside a product prototype, all text blank',
      'exit-strategy': 'Two business people shaking hands over signed documents in a modern office, a deal closing',
      'emprendedor-social': 'A community workshop in Mexico where local people work with modern tools, dignified social enterprise',
      'figuras-societarias': 'Three document folders arranged side by side on a desk, all labels blank, formal setting',
      'term-sheet': 'A short investment offer document on a table with several clauses visible, all text blank, pen beside it',
      'dilucion-pastel': 'A pie divided into progressively more slices across three drawings on a whiteboard, clean sequence',
      'franquicia-red': 'Several identical shopfronts shown along a street in one composition, consistent branding areas left blank',
      'legado-continuidad': 'An older founder handing keys to a younger successor inside a workshop, respectful transition, warm light',
    },
    laminas: [
      'sistemas-procesos', 'exportar-mexico', 'propiedad-intelectual', 'exit-strategy', 'emprendedor-social',
      'figuras-societarias', 'term-sheet', 'dilucion-pastel', 'franquicia-red', 'legado-continuidad',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'sistemas-procesos',
        tomas: [
          'Hay una diferencia enorme entre tener un negocio y tener una empresa.',
          { t: 'Un negocio que se detiene cuando tú te vas es un autoempleo.', recorte: [0.5, 0.5, 0.6] },
          'Una empresa sigue funcionando sin ti.',
          { t: 'Este bloque va de cruzar esa línea.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'exportar-mexico',
        tomas: [
          'Empieza con sistemas, procesos y gobierno corporativo básico.',
          { t: 'Después, cómo exportar desde México aprovechando los tratados.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y cómo proteger tus ideas y tu marca.', fondo: 'propiedad-intelectual' },
          { t: 'Porque un activo intangible sin registro es un activo de cualquiera.', fondo: 'propiedad-intelectual', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'exit-strategy',
        tomas: [
          'Vas a estudiar la salida del emprendedor.',
          { t: 'Cómo se vende una empresa y cómo se prepara para que valga.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y vas a diseñar un proyecto de emprendimiento social.', fondo: 'emprendedor-social' },
          { t: 'Que resuelva algo real de México y además se sostenga solo.', fondo: 'emprendedor-social', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'figuras-societarias',
        tomas: [
          'La segunda mitad es la parte que casi nadie enseña.',
          { t: 'Qué figura societaria le conviene a tu empresa.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Cómo leer la primera oferta de un inversionista.', fondo: 'term-sheet' },
          { t: 'Y cuánto de tu empresa sigue siendo tuya después de varias rondas.', fondo: 'dilucion-pastel', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'franquicia-red',
        tomas: [
          'Y cierra el programa completo con dos temas grandes.',
          { t: 'Las franquicias, que permiten crecer con el capital de otros.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y el legado: qué queda cuando el fundador se va.', fondo: 'legado-continuidad' },
          { t: 'Diez clases para cruzar de negocio a empresa. Empezamos.', fondo: 'sistemas-procesos', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 's3-b4-u6',
    titulo: 'Cuánto sigue siendo tuyo',
    imagenes: {
      'tres-figuras': 'Three formal document folders arranged in a row on a desk, all labels blank, institutional lighting',
      'constituir-linea': 'A person completing a company registration on a laptop at a kitchen table, all fields blank, modern and simple',
      'socios-inversion': 'Founders and investors talking around a table with a document between them, professional atmosphere',
      'tres-cifras': 'Three connected boxes drawn on a whiteboard with arrows between them, all values blank, clean diagram',
      'valuacion-previa': 'A single number box on a whiteboard circled heavily, blank inside, marker resting below',
      'clausulas-no-dinero': 'A contract on a desk with several clauses marked with sticky flags, all text blank',
      'pastel-tres-rondas': 'Three pie diagrams drawn in sequence on a whiteboard, each with more slices than the last, clean progression',
      'porcentaje-vs-valor': 'A small slice of a very large pie beside a whole small pie, drawn on a whiteboard, clean comparison',
      'franquicia-manual': 'An operations manual open on a counter inside a franchise style shop, all pages blank, tidy interior',
      'franquiciatario-local': 'A new franchise owner opening their shop for the first morning, proud and nervous, street view',
      'red-reputacion': 'Several identical shopfronts along a street, one visibly neglected among the others, clear contrast',
      'legado-llaves': 'An older founder handing over keys and a folder to a younger successor in a workshop, warm respectful moment',
    },
    laminas: [
      'tres-figuras', 'constituir-linea', 'socios-inversion', 'tres-cifras', 'valuacion-previa',
      'clausulas-no-dinero', 'pastel-tres-rondas', 'porcentaje-vs-valor', 'franquicia-manual', 'franquiciatario-local',
      'red-reputacion', 'legado-llaves',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'pastel-tres-rondas',
        tomas: [
          'Tres rondas de inversión que ceden veinte por ciento cada una.',
          { t: 'Mucha gente calcula que al fundador le queda cuarenta.', recorte: [0.5, 0.5, 0.6] },
          'Le queda alrededor de cincuenta y uno.',
          { t: 'Y entender por qué cambia cómo negocias toda tu vida.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'tres-figuras',
        tomas: [
          'Antes de eso, con qué figura naces.',
          { t: 'La sociedad anónima es la estructura tradicional para empresas con varios socios.', recorte: [0.35, 0.5, 0.55] },
          { t: 'Capital dividido en acciones y órganos de gobierno definidos.' },
          { t: 'La sociedad por acciones simplificada bajó la barrera de entrada.', fondo: 'constituir-linea' },
          { t: 'Se constituye en línea, con menos costo, y hasta con un solo accionista.', fondo: 'constituir-linea' },
          { t: 'Y la promotora de inversión está diseñada para recibir capital externo.', fondo: 'socios-inversion' },
          { t: 'Permite reglas flexibles sobre derechos de accionistas y mecanismos de salida.', fondo: 'socios-inversion' },
          { t: 'Tres preguntas resuelven la elección.', fondo: 'tres-figuras' },
          { t: 'Voy a tener socios. Voy a buscar inversión externa. Qué formalidad y costo puedo sostener hoy.', fondo: 'tres-figuras' },
          { t: 'Y algo importante: la figura se puede cambiar después. No es una decisión para siempre.', fondo: 'tres-figuras', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'tres-cifras',
        tomas: [
          'Cuando llega la primera oferta de un inversionista, hay tres cifras ligadas.',
          { t: 'El monto que entra, la valuación de la empresa antes de la inversión, y el porcentaje que se lleva.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Conocidas dos, la tercera se calcula sola.' },
          { t: 'Por eso la valuación previa es el punto central de la negociación.', fondo: 'valuacion-previa' },
          { t: 'Con el mismo monto, una valuación previa mayor significa un porcentaje menor cedido.', fondo: 'valuacion-previa' },
          { t: 'Pero hay cláusulas que no son dinero y deciden igual o más.', fondo: 'clausulas-no-dinero' },
          { t: 'Los derechos de preferencia definen quién cobra primero si la empresa se vende.', fondo: 'clausulas-no-dinero' },
          { t: 'Los asientos en el consejo definen quién decide.', fondo: 'clausulas-no-dinero' },
          { t: 'Una oferta con valuación alta y cláusulas duras puede dejarte peor que una con valuación menor y condiciones limpias.', fondo: 'clausulas-no-dinero', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'pastel-tres-rondas',
        tomas: [
          'Y ahora sí, la dilución.',
          { t: 'Cuando entra capital nuevo se emiten acciones nuevas.', recorte: [0.5, 0.5, 0.6] },
          { t: 'No es que le quiten acciones a nadie: es que el total creció.' },
          { t: 'Y la dilución se acumula multiplicando, no restando.' },
          { t: 'Por eso tres rondas del veinte por ciento no dejan cuarenta, sino alrededor de cincuenta y uno.', cifra: ['51%', 'después de 3 rondas'] },
          { t: 'Cada reducción se aplica sobre lo que quedaba, no sobre el total original.' },
          { t: 'Y lo relevante no es qué porcentaje conservas.', fondo: 'porcentaje-vs-valor' },
          { t: 'Es cuánto vale ese porcentaje.', fondo: 'porcentaje-vs-valor' },
          { t: 'Veinte por ciento de una empresa de cien millones vale mucho más que el cien por ciento de una de dos.', fondo: 'porcentaje-vs-valor' },
          { t: 'La dilución sí es mala cuando el capital entra barato y la empresa no lo aprovecha para crecer.', fondo: 'porcentaje-vs-valor', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'franquicia-manual',
        tomas: [
          'Hay otra forma de crecer sin ceder tu empresa.',
          { t: 'Quien otorga una franquicia aporta la marca, el modelo probado, los manuales y la capacitación.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Quien la adquiere pone el capital, el local y la operación diaria.', fondo: 'franquiciatario-local' },
          { t: 'Y recibe un modelo que ya demostró funcionar.', fondo: 'franquiciatario-local' },
          { t: 'Pero franquiciar exige algo que casi nadie tiene al principio.', fondo: 'franquicia-manual' },
          { t: 'Un modelo rentable de forma consistente, no en un solo local afortunado.', fondo: 'franquicia-manual' },
          { t: 'Y procesos documentados con detalle suficiente para que otro los ejecute sin ti.', fondo: 'franquicia-manual' },
          { t: 'Los riesgos van en los dos sentidos.', fondo: 'red-reputacion' },
          { t: 'Quien otorga pierde control directo: un mal franquiciatario daña la reputación de toda la red.', fondo: 'red-reputacion' },
          { t: 'Y quien adquiere queda atado a un contrato con regalías y obligaciones.', fondo: 'red-reputacion' },
          { t: 'Y todo esto termina en una sola pregunta.', fondo: 'legado-llaves' },
          { t: 'Qué queda cuando el fundador se va.', fondo: 'legado-llaves' },
          { t: 'Una empresa que solo funciona con una persona no vale casi nada sin esa persona.', fondo: 'legado-llaves' },
          { t: 'Elige tu figura por tus planes. Mira las cláusulas, no solo la valuación. Y documenta para poder irte.', fondo: 'legado-llaves', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ RETO SUPREMO · Portfolio Builder: Tu Vida Financiera ════════════════ */

  {
    id: 's3-supremo',
    titulo: 'Tu Vida Financiera',
    imagenes: {
      'linea-cincuenta': 'A long horizontal timeline drawn across a large wall with several marked stages, all labels blank, planning room',
      'quince-anos': 'A fifteen year old Mexican student standing at the start of a long path, backpack on, morning light',
      'decisiones-etapa': 'A fork in a road with several branches ahead, seen from behind a walking figure, stylized landscape',
      'crisis-en-camino': 'A storm passing over a long road while a figure keeps walking, dramatic sky, resilient mood',
      'patrimonio-crece': 'A rising curve drawn across a long wall chart with markers at intervals, clean and impressive',
      'sesenta-y-cinco': 'An older Mexican person sitting calmly on a porch at sunset, content and unhurried',
    },
    laminas: ['linea-cincuenta', 'quince-anos', 'decisiones-etapa', 'crisis-en-camino', 'patrimonio-crece', 'sesenta-y-cinco'],
    bloques: [
      {
        paso: 0,
        fondo: 'quince-anos',
        tomas: [
          'Este es el último Reto Supremo del programa.',
          { t: 'Y es el más largo de todos: cincuenta años.', recorte: [0.5, 0.5, 0.6] },
          { t: 'De los quince a los sesenta y cinco.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'linea-cincuenta',
        tomas: [
          'Cada etapa te va a pedir una decisión.',
          { t: 'Cuánto ahorras, cuánto arriesgas, qué proteges y cuándo.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y ninguna decisión se puede deshacer.', fondo: 'decisiones-etapa' },
          { t: 'Como en la vida: no hay botón para volver a los veinte.', fondo: 'decisiones-etapa', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'crisis-en-camino',
        tomas: [
          'Van a llegar crisis. Más de una.',
          { t: 'Porque en cincuenta años siempre llegan.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Quien tenía reglas escritas antes, las cruza. Quien improvisa, vende en el peor día.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'patrimonio-crece',
        tomas: [
          'Y vas a ver el efecto del tiempo con tus propios ojos.',
          { t: 'Lo que aportaste a los veinte pesa más que lo que aportes a los cuarenta.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Esa es la única ventaja que hoy tienes y que después no vas a poder comprar.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'sesenta-y-cinco',
        tomas: [
          'Gana quien llega a los sesenta y cinco con opciones.',
          { t: 'No quien acumuló el número más grande.' },
          { t: 'Empieza a los quince. Es hoy.', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
