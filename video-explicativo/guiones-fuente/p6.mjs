/**
 * Primaria 6 — 11 a 12 años. Nueve videos.
 *
 * ES EL PRIMER GRADO CON VIDEOS GENERALES. Los cuatro pilares de P6 no tienen
 * video propio en `PILLAR_VIDEOS`, así que aquí entran los dos formatos:
 *
 *   `<grado>-b<n>-general`  presenta el pilar entero, las diez unidades. No
 *                           enseña ninguna: dice de qué va el camino y por qué
 *                           vale la pena recorrerlo. Diez láminas bastan.
 *   `<grado>-b<n>-u6`       la ampliación, unidades 6 a 10, como en los grados
 *                           anteriores. Doce láminas.
 *
 * REGISTRO. Decisiones con costo y comparación de alternativas. Ya se puede
 * plantear un dilema sin resolverlo en la misma frase (comprar contra rentar,
 * deuda buena contra deuda mala) y sostener una cifra de seis dígitos.
 *
 * Contenido de `public/data/pedagogia/primaria/p6.json`.
 */

export const ARGUMENTOS = [
  /* ═══ BLOQUE 1 · Primeros Pasos Hacia el Ahorro ═══════════════════════════ */

  {
    id: 'p6-b1-general',
    titulo: 'Todo el sistema, de una vez',
    imagenes: {
      'mapa-sistema': 'A clean illustrated map of a financial system with a central bank building, commercial banks, a family home and a small business all connected by paths, infographic style',
      'etapas-vida': 'Four figures of the same person at different ages walking left to right along a path, student, young worker, adult and older adult, stylized illustration',
      'universidad-costo': 'A Mexican university campus entrance with students walking in, bright morning light, hopeful atmosphere',
      'fintech-celular': 'A preteen holding a phone showing a modern financial app interface with blank fields, sitting on a bus, urban Mexican setting',
      'cripto-grafica': 'A screen showing a wildly jagged price line rising and crashing repeatedly, dark room, tense mood',
      'letra-chiquita': 'A magnifying glass over the dense bottom section of a financial contract, the text blank and smooth, desk lamp light',
      'afore-tiempo': 'Two savings jars side by side, one filled slowly over many marked years and much fuller, the other started late and emptier, illustrative timeline',
      'identidad-papeles': 'Three official looking Mexican documents laid out neatly on a table, all fields blank, top down view, even light',
      'preteen-decide': 'An eleven year old Mexican student at a desk with two options drawn on paper in front of them, weighing a decision, natural light',
      'camino-pilar': 'A winding path drawn across a landscape with ten marked stops along it, the last one on a hilltop, clean illustrative style',
    },
    laminas: [
      'mapa-sistema', 'etapas-vida', 'universidad-costo', 'fintech-celular', 'cripto-grafica',
      'letra-chiquita', 'afore-tiempo', 'identidad-papeles', 'preteen-decide', 'camino-pilar',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'mapa-sistema',
        tomas: [
          'Llevas cinco años aprendiendo piezas sueltas.',
          { t: 'El ahorro, el banco, el crédito, la inversión.', recorte: [0.5, 0.5, 0.62] },
          'Este bloque es donde las piezas se juntan.',
          { t: 'Y donde vas a ver el sistema financiero mexicano completo, de una vez.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'etapas-vida',
        tomas: [
          'Empieza con algo que casi nunca se dice.',
          { t: 'Tus finanzas cambian de forma según la etapa de tu vida.', recorte: [0.5, 0.5, 0.65] },
          { t: 'Lo que le conviene a un estudiante no es lo que le conviene a alguien de cuarenta.' },
          { t: 'Y una de esas etapas está muy cerca de ti.', fondo: 'universidad-costo' },
          { t: 'La universidad, que se puede ver como un gasto o como una inversión en ti mismo.', fondo: 'universidad-costo', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'fintech-celular',
        tomas: [
          'Después viene lo nuevo.',
          { t: 'Las fintech, los neobancos, las billeteras digitales.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y las criptomonedas, que vas a estudiar con nombre y apellido.', fondo: 'cripto-grafica' },
          { t: 'Sin entusiasmo y sin miedo. Qué son, cómo se mueven y qué riesgos reales tienen.', fondo: 'cripto-grafica', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'letra-chiquita',
        tomas: [
          'Vas a aprender a leer la letra chiquita.',
          { t: 'Las seis cláusulas que cambian el costo total de cualquier producto financiero.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y vas a hacer una cuenta que sorprende a todos.', fondo: 'afore-tiempo' },
          { t: 'Cuánto cambia empezar a ahorrar para el retiro a los veinte en vez de a los cuarenta.', fondo: 'afore-tiempo' },
          { t: 'La respuesta no es el doble. Es mucho más que el doble.', fondo: 'afore-tiempo', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'identidad-papeles',
        tomas: [
          'Y cierra con tres claves que te van a pedir toda la vida.',
          { t: 'La C U R P, el R F C y el número de seguridad social.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Diez clases para pasar de saber ahorrar a entender el sistema entero.', fondo: 'camino-pilar' },
          { t: 'Empezamos.', fondo: 'preteen-decide', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 'p6-b1-u6',
    titulo: 'Si esto desaparece, ¿quién responde?',
    imagenes: {
      'app-nueva': 'A preteen opening a brand new financial app on a phone, bright modern interface with blank fields, bedroom desk',
      'sin-sucursal-neo': 'A modern office building with no bank branch signage and no counter, only laptops and staff, contemporary workspace',
      'quien-responde': 'An empty customer service counter with the shutter half down and nobody behind it, unsettling quiet, plain interior',
      'seis-filas': 'A hand drawn comparison table on paper with two columns and six rows, all cells blank, pencil beside it, top down view',
      'vigencia-promo': 'A calendar showing twelve months with the first few marked differently from the rest, plain wall, clean composition',
      'afore-estado': 'A retirement account statement lying unopened on a table beside other post, slightly dusty, domestic setting',
      'veinte-vs-cuarenta': 'Two rising curves drawn on a whiteboard, one starting much earlier and ending far higher, clean chart with no labels',
      'cripto-caida': 'A phone screen showing a steep downward line, held by a shocked young adult, dim room, harsh screen light',
      'llave-perdida': 'A single small key lying at the bottom of a dark crevice, out of reach, symbolic composition, dramatic light',
      'curp-rfc-nss': 'Three official Mexican document forms laid out in a row on a desk, all fields blank, top down view',
      'no-compartir': 'A hand covering a document protectively while a stranger tries to photograph it with a phone, protective gesture',
      'preteen-verifica': 'An eleven year old checking an official registry on a laptop with a parent beside them, careful and unhurried',
    },
    laminas: [
      'app-nueva', 'sin-sucursal-neo', 'quien-responde', 'seis-filas', 'vigencia-promo',
      'afore-estado', 'veinte-vs-cuarenta', 'cripto-caida', 'llave-perdida', 'curp-rfc-nss',
      'no-compartir', 'preteen-verifica',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'app-nueva',
        tomas: [
          'Bajas una app, te abre una cuenta en cinco minutos.',
          { t: 'Sin sucursal, sin fila, sin comisiones.', recorte: [0.5, 0.5, 0.6] },
          'Todo suena mejor que el banco de siempre.',
          { t: 'Y hay una sola pregunta que decide si conviene o no.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'quien-responde',
        tomas: [
          'Si esta empresa desapareciera mañana, quién responde por mi dinero y hasta cuánto.',
          { t: 'Si la respuesta está clara y respaldada, adelante.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Si no la encuentras, ese es el riesgo, y no está en el precio.' },
          { t: 'Un banco tradicional tiene licencia bancaria y la supervisión más estricta.', fondo: 'sin-sucursal-neo' },
          { t: 'Un neobanco opera solo por aplicación, y la pregunta clave es su figura legal.', fondo: 'sin-sucursal-neo' },
          { t: 'Algunos tienen licencia de banco. Otros operan bajo otra figura, con otra protección.', fondo: 'sin-sucursal-neo' },
          { t: 'Y una billetera digital guarda saldo para pagar, pero no es un banco.', fondo: 'app-nueva', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'seis-filas',
        tomas: [
          'Que las condiciones importantes estén enterradas en un documento larguísimo no es un accidente.',
          { t: 'Un contrato difícil de leer reduce la probabilidad de que alguien compare.', fondo: 'seis-filas', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y comparar es lo que baja el precio.', fondo: 'seis-filas' },
          { t: 'Son seis cosas las que hay que encontrar, siempre las mismas.', fondo: 'seis-filas' },
          { t: 'Costo anual total, comisiones y cuándo aplican, saldo mínimo, cómo cancelar, penalizaciones y vigencia de la promoción.', fondo: 'seis-filas', recorte: [0.5, 0.5, 0.7] },
          { t: 'La vigencia es la que más sorpresas causa.', fondo: 'vigencia-promo' },
          { t: 'Sin anualidad el primer año. Tasa preferencial por seis meses. Todas terminan, y casi nadie recuerda cuándo.', fondo: 'vigencia-promo' },
          { t: 'Compara por tabla, no por publicidad. Seis filas iguales para los dos productos.', fondo: 'seis-filas', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'veinte-vs-cuarenta',
        tomas: [
          'Ahora la cuenta que casi nadie hace a tiempo.',
          { t: 'El AFORE administra tu cuenta individual de retiro.', rotulo: 'AFORE' },
          { t: 'Y aquí el tiempo pesa más que el monto.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Quien aporta poco desde los veinte suele terminar con más que quien aporta el doble desde los cuarenta.' },
          { t: 'Aunque el segundo haya puesto más dinero en total.' },
          { t: 'Y hay una aportación voluntaria que cualquiera puede hacer, desde montos muy pequeños.', fondo: 'afore-estado' },
          { t: 'Ahí también hay comisiones. Y también hay un estado de cuenta que casi nadie abre.', fondo: 'afore-estado', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cripto-caida',
        tomas: [
          'Las criptomonedas, sin entusiasmo y sin miedo.',
          { t: 'Caídas de más de la mitad del valor en pocos meses no son la excepción: son el comportamiento normal.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y a diferencia de un depósito bancario, aquí no hay seguro que responda.' },
          { t: 'Si la plataforma quiebra, no hay institución a la cual reclamar.' },
          { t: 'Existe además un riesgo que no tiene equivalente en el sistema tradicional.', fondo: 'llave-perdida' },
          { t: 'Si se pierde la clave de acceso, el dinero se pierde de forma definitiva.', fondo: 'llave-perdida' },
          { t: 'No hay ventanilla donde recuperar una contraseña.', fondo: 'llave-perdida' },
          { t: 'Y cierra con lo más tuyo: tres claves que te van a pedir toda la vida.', fondo: 'curp-rfc-nss' },
          { t: 'La C U R P dice quién eres. El R F C es tu identidad ante la autoridad fiscal.', fondo: 'curp-rfc-nss', recorte: [0.35, 0.5, 0.55] },
          { t: 'Y el número de seguridad social te vincula con los servicios médicos y con tu cuenta de retiro.', fondo: 'curp-rfc-nss', recorte: [0.7, 0.5, 0.55] },
          { t: 'Esos mismos datos sirven para contratar productos a nombre de otra persona.', fondo: 'no-compartir' },
          { t: 'No se publican en redes ni se comparten con desconocidos.', fondo: 'no-compartir' },
          { t: 'Pregunta quién responde. Compara por tabla. Y empieza temprano.', fondo: 'preteen-verifica', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 2 · Construyendo Independencia ═══════════════════════════════ */

  {
    id: 'p6-b2-general',
    titulo: 'Deber sin ahogarse',
    imagenes: {
      'tarjeta-tentacion': 'A credit card lying on a table beside a shopping bag, warm light, everyday domestic setting',
      'hablar-acreedor': 'A young adult speaking calmly on the phone with a notebook of figures open in front of them, composed body language',
      'ingreso-pasivo': 'A person reading in a hammock while a small workshop operates in the background, stylized illustration of income without direct labour',
      'contrato-credito': 'A credit contract on a desk with a pen resting on it, someone reading it attentively before signing',
      'ensenar-familia': 'A preteen explaining something on paper to their parents and younger sibling at the kitchen table, everyone attentive',
      'base-cero': 'A budget sheet where every category starts at zero, a pencil adding entries one by one, top down view',
      'deuda-buena-mala': 'A balance scale with a set of tools on one side and a pile of disposable goods on the other, clean illustrative composition',
      'buro-mitos': 'A large question mark drawn on a whiteboard beside an organised filing cabinet, office setting, clean composition',
      'estres-dinero': 'A person sitting awake at night at the kitchen table with bills in front of them, tired and worried, single lamp',
      'camino-independencia': 'A path leading up a hill with markers along it toward a sunlit summit, clean illustrative landscape',
    },
    laminas: [
      'tarjeta-tentacion', 'hablar-acreedor', 'ingreso-pasivo', 'contrato-credito', 'ensenar-familia',
      'base-cero', 'deuda-buena-mala', 'buro-mitos', 'estres-dinero', 'camino-independencia',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'tarjeta-tentacion',
        tomas: [
          'Este bloque va del tema que más gente hunde y que casi nadie explica bien.',
          { t: 'La deuda.', recorte: [0.5, 0.5, 0.55] },
          'No para decirte que nunca te endeudes.',
          { t: 'Sino para que sepas exactamente cuándo sí y cuándo no.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'hablar-acreedor',
        tomas: [
          'Vas a aprender algo que casi nadie hace.',
          { t: 'Hablar con quien te prestó, antes de dejar de pagar.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y vas a conocer el concepto que le da nombre al bloque.', fondo: 'ingreso-pasivo' },
          { t: 'Independencia financiera: llegar a vivir de lo que tu dinero genera, no solo de tu trabajo.', fondo: 'ingreso-pasivo' },
          { t: 'Y vas a leer un contrato de crédito de verdad, para saber qué firmas antes de firmarlo.', fondo: 'contrato-credito', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'base-cero',
        tomas: [
          'Después viene un método distinto de presupuestar.',
          { t: 'Base cero: cada categoría empieza en cero y cada peso tiene que justificarse.', recorte: [0.5, 0.5, 0.62] },
          { t: 'No para gastar menos, sino para que nada siga ahí por inercia.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'deuda-buena-mala',
        tomas: [
          'Y llega el criterio definitivo.',
          { t: 'Tres preguntas que separan la deuda buena de la mala en cualquier situación.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Además vas a desarmar los mitos del Buró de Crédito.', fondo: 'buro-mitos' },
          { t: 'Que no es una lista negra, y que nadie puede borrarlo por dinero.', fondo: 'buro-mitos', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'estres-dinero',
        tomas: [
          'Y cierra con algo que no aparece en ningún libro de finanzas.',
          { t: 'El efecto del dinero en el sueño, el ánimo y la familia.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Diez clases para deber sin ahogarse, y para construir el camino de salida.', fondo: 'camino-independencia' },
          { t: 'Empezamos.', fondo: 'ensenar-familia', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 'p6-b2-u6',
    titulo: 'Las tres preguntas de la deuda',
    imagenes: {
      'presupuesto-heredado': 'A budget spreadsheet printout where every line has the same number copied down from the month before, top down view',
      'cada-linea-cero': 'A blank budget sheet with all category rows starting empty and a pencil beginning to fill the first one, clean desk',
      'liberado-destino': 'An arrow drawn on paper leading from a freed budget line to a savings jar, simple hand drawn diagram',
      'curso-herramienta': 'A person in a workshop using a good quality tool they clearly invested in, competent and productive, warm workshop light',
      'compra-desechable': 'A pile of barely used impulse purchases gathering dust in a corner of a room, slightly sad composition',
      'cabe-presupuesto': 'A monthly payment amount weighed against essential household bills on a simple balance scale, illustrative',
      'plan-hasta-ultima': 'A payment schedule drawn on paper with every month marked to the final one, a pencil tracing the last row',
      'negociar-numeros': 'A young adult at a desk presenting a written proposal across a table to a bank representative, businesslike and calm',
      'alargar-plazo': 'Two payment timelines drawn one above the other, the lower one much longer with more markers, clean diagram',
      'borrar-buro-fraude': 'A suspicious flyer promising to erase a credit record, lying on a pavement, blank text, slightly grimy',
      'dos-columnas-control': 'A sheet of paper divided into two columns with short entries on each side, a pencil resting on it, top down view',
      'hablarlo-familia': 'A Mexican family talking around the kitchen table with a notebook between them, one person visibly relieved, evening light',
    },
    laminas: [
      'presupuesto-heredado', 'cada-linea-cero', 'liberado-destino', 'curso-herramienta', 'compra-desechable',
      'cabe-presupuesto', 'plan-hasta-ultima', 'negociar-numeros', 'alargar-plazo', 'borrar-buro-fraude',
      'dos-columnas-control', 'hablarlo-familia',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'presupuesto-heredado',
        tomas: [
          'Casi todos los presupuestos se hacen copiando el del mes pasado.',
          { t: 'Y cada categoría arrastra su monto sin que nadie vuelva a preguntar si sigue haciendo falta.', recorte: [0.5, 0.5, 0.6] },
          'Suscripciones que ya no se usan. Rutinas que ya cambiaron.',
          { t: 'El presupuesto heredado conserva lo que ya no sirve, solo porque estaba ahí.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'cada-linea-cero',
        tomas: [
          'El base cero le da la vuelta.',
          { t: 'Todas las categorías empiezan en cero, y cada gasto entra solo si se puede justificar.', rotulo: 'Base cero' },
          { t: 'La pregunta para cada línea es directa: qué pasaría si no hiciera este gasto.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y ojo, base cero no significa gastar lo mínimo posible.' },
          { t: 'Un gasto grande perfectamente justificado se queda. Uno pequeño sin razón vigente se va.' },
          { t: 'Y falta el paso que casi todos omiten.', fondo: 'liberado-destino' },
          { t: 'Decidir a dónde va el dinero que quedó libre.', fondo: 'liberado-destino' },
          { t: 'Sin destino explícito, en pocas semanas se reabsorbe en gastos pequeños y el ejercicio no sirvió de nada.', fondo: 'liberado-destino', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'curso-herramienta',
        tomas: [
          'Ahora la deuda, y las dos posturas extremas que fallan.',
          { t: 'Nunca te endeudes cierra puertas que convienen.', fondo: 'curso-herramienta', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y aprovecha el crédito lleva a gente muy trabajadora a la ruina.', fondo: 'compra-desechable' },
          { t: 'Hay tres preguntas, y las tres tienen que dar sí.', fondo: 'curso-herramienta', rotulo: 'Tres preguntas' },
          { t: 'Uno: lo que financias produce o conserva más valor que el costo del crédito.', fondo: 'curso-herramienta' },
          { t: 'Un curso que aumenta tus ingresos, una herramienta que te permite trabajar. Eso sí.', fondo: 'curso-herramienta' },
          { t: 'Dos: cabe en el presupuesto.', fondo: 'cabe-presupuesto' },
          { t: 'Si la mensualidad obliga a sacrificar comida, salud o el fondo de emergencia, la respuesta es no.', fondo: 'cabe-presupuesto' },
          { t: 'Tres, la más olvidada: hay un plan que llega hasta la última mensualidad.', fondo: 'plan-hasta-ultima' },
          { t: 'No basta con poder pagar la primera.', fondo: 'plan-hasta-ultima', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'negociar-numeros',
        tomas: [
          'Y si la deuda ya no se puede pagar, hay algo que cambia todo.',
          { t: 'Hablar antes de dejar de pagar.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Quien avisa antes del primer atraso conserva credibilidad y consigue mejores condiciones.' },
          { t: 'Quien desaparece llega a la mesa sin nada que ofrecer.' },
          { t: 'Reestructurar es acordar condiciones nuevas: alargar el plazo, bajar la tasa, unificar deudas.', fondo: 'alargar-plazo' },
          { t: 'Pero no es gratis. Alargar el plazo baja la mensualidad y casi siempre sube el total.', fondo: 'alargar-plazo' },
          { t: 'Y se llega con números, no con explicaciones.', fondo: 'negociar-numeros' },
          { t: 'Puedo pagar tanto al mes, empezando en tal fecha, durante tantos meses.', fondo: 'negociar-numeros', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'borrar-buro-fraude',
        tomas: [
          'Sobre el Buró circulan tres mentiras.',
          { t: 'Que es una lista negra. No lo es: es un registro de comportamiento de pago de todos.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Que alguien puede borrarlo por dinero. Eso es un fraude.' },
          { t: 'Y que lo mejor es no tener ningún crédito nunca.' },
          { t: 'Quien no tiene historial es un desconocido para las instituciones, y eso también complica.' },
          { t: 'Y falta lo que ningún estado de cuenta muestra.', fondo: 'dos-columnas-control' },
          { t: 'El estrés financiero afecta el sueño, la concentración y las relaciones familiares.', fondo: 'dos-columnas-control' },
          { t: 'Y tiene un efecto circular: el estrés reduce la capacidad de tomar buenas decisiones.', fondo: 'dos-columnas-control' },
          { t: 'Dos columnas ayudan. Lo que puedo controlar y lo que no.', fondo: 'dos-columnas-control', recorte: [0.5, 0.5, 0.65] },
          { t: 'Y nombrar el problema con números lo vuelve manejable.', fondo: 'hablarlo-familia' },
          { t: 'No es estamos ahogados. Es faltan dos mil trescientos pesos este mes.', fondo: 'hablarlo-familia', cifra: ['2300', 'este mes'] },
          { t: 'Empieza en cero. Pasa las tres preguntas. Y habla antes de dejar de pagar.', fondo: 'hablarlo-familia', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 3 · Planificación y Crecimiento ══════════════════════════════ */

  {
    id: 'p6-b3-general',
    titulo: 'El dinero a treinta años',
    imagenes: {
      'proyeccion-curva': 'A long rising curve drawn across a whiteboard with markers at intervals, someone tracing it with a finger, clean chart',
      'retiro-lejano': 'An older Mexican couple walking calmly in a park, content and unhurried, golden afternoon light',
      'comprar-rentar': 'A house key and a rental contract lying side by side on a table, equally weighted, top down view',
      'impuestos-comun': 'A well maintained public street with a school, a clinic and a bus, ordinary Mexican neighbourhood working well, sunny day',
      'perfil-inversor': 'A person looking at their reflection in a window with an investment screen faintly visible, introspective composition',
      'regla-cuatro': 'A large pie divided into twenty five equal slices with one slice separated slightly, clean illustrative diagram',
      'seguros-tres': 'Three protective umbrellas of different sizes standing over a small house, a car and a person, clean symbolic illustration',
      'inflacion-real': 'Two shopping baskets side by side holding visibly different amounts of the same groceries, clear comparison',
      'invertir-poco': 'A small handful of coins beside a phone showing an investment app with blank fields, modest and hopeful',
      'testamento-carpeta': 'A neatly organised folder of documents on a shelf with a family photograph beside it, warm domestic light',
    },
    laminas: [
      'proyeccion-curva', 'retiro-lejano', 'comprar-rentar', 'impuestos-comun', 'perfil-inversor',
      'regla-cuatro', 'seguros-tres', 'inflacion-real', 'invertir-poco', 'testamento-carpeta',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'proyeccion-curva',
        tomas: [
          'Este bloque tiene un tema raro para alguien de once años.',
          { t: 'El futuro lejano.', recorte: [0.5, 0.5, 0.55] },
          'Treinta, cuarenta, cincuenta años adelante.',
          { t: 'Y hay una razón: es la única edad en que el tiempo todavía juega totalmente a tu favor.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'retiro-lejano',
        tomas: [
          'Vas a proyectar tu propio futuro con números.',
          { t: 'Y a ver cómo funciona una AFORE y el interés compuesto a muy largo plazo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Después viene el dilema que discute media familia mexicana.', fondo: 'comprar-rentar' },
          { t: 'Comprar casa o rentar. Sin respuesta única: con criterios para decidir.', fondo: 'comprar-rentar', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'impuestos-comun',
        tomas: [
          'Vas a entender para qué sirven los impuestos.',
          { t: 'Y la diferencia entre lo que gana alguien y lo que recibe en la mano.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y vas a descubrir tu propio perfil de inversor.', fondo: 'perfil-inversor' },
          { t: 'Porque la mejor inversión del mundo es mala si no te deja dormir.', fondo: 'perfil-inversor', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'regla-cuatro',
        tomas: [
          'En la segunda mitad viene una de las cuentas más famosas que existen.',
          { t: 'La regla del cuatro por ciento: cuánto capital hace falta para vivir de los rendimientos.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Los seguros y por qué no son lo mismo que el fondo de emergencia.', fondo: 'seguros-tres' },
          { t: 'Y el interés real, que es el único que dice si de verdad ganaste.', fondo: 'inflacion-real', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'invertir-poco',
        tomas: [
          'Y cierra con dos cosas que suenan de adultos y no lo son.',
          { t: 'Que se puede empezar a invertir con muy poco.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y un testamento, que sirve sobre todo para evitarle un conflicto a tu familia.', fondo: 'testamento-carpeta' },
          { t: 'Diez clases para pensar tu dinero a treinta años. Empezamos.', fondo: 'proyeccion-curva', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 'p6-b3-u6',
    titulo: 'Veinticinco veces lo que gastas',
    imagenes: {
      'vivir-rendimientos': 'A person having coffee on a sunny terrace on a weekday morning while others hurry to work below, calm and free',
      'veinticinco-porciones': 'Twenty five identical small stacks of coins arranged in a grid on a table, one slightly separated, top down view',
      'bajar-gasto': 'A hand crossing out one recurring expense line on a budget sheet, decisive pencil stroke, close up',
      'seguro-vs-fondo': 'A small jar of coins beside a large protective umbrella, both on the same table, clean illustrative comparison',
      'deducible-poliza': 'An insurance policy document open on a table with a section under a magnifying glass, the text blank',
      'exclusiones': 'The last page of a policy document sitting untouched at the bottom of a stack of papers, dust visible, desk setting',
      'nominal-vs-real': 'Two numbers drawn on a whiteboard with a subtraction sign between them and a smaller result below, clean chart, no labels',
      'efectivo-pierde': 'A stack of banknotes in a drawer with a calendar on the wall showing a year passing, quiet domestic setting',
      'monto-minimo': 'A very small amount of coins beside a phone showing an investment confirmation screen, modest beginning',
      'constancia-veinte': 'A long row of small monthly deposits drawn as marks across a timeline on paper, steady and unbroken',
      'testamento-familia': 'A family sitting together with a lawyer at a simple desk, calm and organised, institutional office',
      'inventario-bienes': 'A single sheet listing accounts and institutions with all fields blank, resting in an organised folder, top down view',
    },
    laminas: [
      'vivir-rendimientos', 'veinticinco-porciones', 'bajar-gasto', 'seguro-vs-fondo', 'deducible-poliza',
      'exclusiones', 'nominal-vs-real', 'efectivo-pierde', 'monto-minimo', 'constancia-veinte',
      'testamento-familia', 'inventario-bienes',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'vivir-rendimientos',
        tomas: [
          'Vivir de lo que genera tu dinero, sin tener que trabajar por obligación.',
          { t: 'Suena a fantasía, y en realidad es una división.', recorte: [0.5, 0.5, 0.6] },
          'Existe una regla para estimar cuánto capital hace falta.',
          { t: 'Y sale un número sorprendentemente concreto.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'veinticinco-porciones',
        tomas: [
          'Se llama la regla del cuatro por ciento.',
          { t: 'Si un capital está invertido, se puede retirar una parte cada año sin agotarlo rápido.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Retirar el cuatro por ciento al año es lo mismo que decir que el capital debe ser veinticinco veces el gasto anual.', rotulo: '× 25' },
          { t: 'Porque cien entre cuatro da veinticinco.' },
          { t: 'Alguien que gasta ciento ochenta mil al año necesitaría alrededor de cuatro millones y medio.', cifra: ['4.5M', 'de capital'] },
          { t: 'Y aquí viene la consecuencia que nadie espera.', fondo: 'bajar-gasto' },
          { t: 'Cada peso de gasto anual que eliminas baja la meta en veinticinco pesos.', fondo: 'bajar-gasto' },
          { t: 'Reducir mil pesos mensuales baja la meta en trescientos mil.', fondo: 'bajar-gasto', cifra: ['300000', 'menos'] },
          { t: 'Por eso el gasto manda más que el ingreso.', fondo: 'bajar-gasto', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'seguro-vs-fondo',
        tomas: [
          'Ahora, algo que la gente confunde todo el tiempo.',
          { t: 'El fondo de emergencia y un seguro no cubren lo mismo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El fondo cubre eventos medianos y frecuentes, y se usa varias veces en la vida.' },
          { t: 'El seguro cubre eventos poco probables pero de un tamaño que ningún ahorro razonable alcanzaría.' },
          { t: 'Y tiene tres palabras que hay que entender antes de firmar.', fondo: 'deducible-poliza' },
          { t: 'El deducible es lo que pagas tú antes de que la aseguradora empiece a pagar.', fondo: 'deducible-poliza', recorte: [0.5, 0.5, 0.6] },
          { t: 'El coaseguro es el porcentaje que sigues pagando después. Y la suma asegurada es el máximo que cubre.', fondo: 'deducible-poliza' },
          { t: 'Pero lo que de verdad decide está en la sección que nadie lee.', fondo: 'exclusiones' },
          { t: 'Las exclusiones: lo que la póliza no cubre.', fondo: 'exclusiones', rotulo: 'Exclusiones' },
          { t: 'Un seguro que no cubre lo que te pasó es un gasto, no una protección.', fondo: 'exclusiones', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'nominal-vs-real',
        tomas: [
          'Y llega el número que separa ganar de creer que ganaste.',
          { t: 'El interés nominal es el que anuncia la institución.', recorte: [0.4, 0.5, 0.55] },
          { t: 'El real es lo que queda después de descontar la inflación.', rotulo: 'Interés real' },
          { t: 'Nueve por ciento nominal con cinco de inflación deja un real cercano al cuatro.' },
          { t: 'Y el efectivo guardado en casa da cero nominal.', fondo: 'efectivo-pierde' },
          { t: 'Así que su interés real es exactamente la inflación en negativo.', fondo: 'efectivo-pierde' },
          { t: 'Con cinco por ciento, diez mil pesos guardados un año compran lo que antes compraban nueve mil quinientos.', fondo: 'efectivo-pierde', cifra: ['9500', 'de poder'] },
          { t: 'Y después de la inflación quedan dos restas más: comisiones e impuestos.', fondo: 'nominal-vs-real', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'monto-minimo',
        tomas: [
          'Todo esto suena a que hace falta mucho dinero para empezar. No es así.',
          { t: 'Hay plataformas donde se compra un instrumento gubernamental con montos muy bajos.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Se comparan tres cosas: el monto mínimo, la liquidez y el riesgo.' },
          { t: 'Y la constancia importa más que el monto.', fondo: 'constancia-veinte' },
          { t: 'Trescientos pesos cada mes durante veinte años superan a mil pesos durante ocho.', fondo: 'constancia-veinte' },
          { t: 'El tiempo es el ingrediente que no se puede comprar después.', fondo: 'constancia-veinte' },
          { t: 'Y cierra un tema que parece lejanísimo y no lo es.', fondo: 'testamento-familia' },
          { t: 'Un testamento no reparte riqueza. Evita que la familia pase años en un proceso.', fondo: 'testamento-familia' },
          { t: 'Y hay cosas que ni siquiera pasan por testamento: el AFORE y los seguros de vida van a quien esté designado como beneficiario.', fondo: 'testamento-familia' },
          { t: 'Existe una cantidad enorme de cuentas y saldos que nunca se reclaman porque nadie supo que existían.', fondo: 'inventario-bienes' },
          { t: 'Un inventario simple lo resuelve: qué hay, en qué institución y dónde están los papeles.', fondo: 'inventario-bienes' },
          { t: 'Multiplica tu gasto por veinticinco. Lee las exclusiones. Y empieza con lo que tengas.', fondo: 'inventario-bienes', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ BLOQUE 4 · ¡Es Hora de Emprender! ═══════════════════════════════════ */

  {
    id: 'p6-b4-general',
    titulo: 'Sesenta segundos para convencer',
    imagenes: {
      'pitch-elevador': 'A young person confidently explaining an idea to an adult inside a lift, brief and focused encounter, modern building',
      'formalidad-rfc': 'A small business owner receiving an official registration document at a government office counter, proud moment',
      'ventas-escucha': 'Two people at a market stall in conversation, the seller listening attentively rather than talking, warm daylight',
      'financiamiento-fuentes': 'Three different funding sources illustrated around a small workshop: family, a bank and an investor, clean composition',
      'kpis-tablero': 'A whiteboard in a small business back room with four simple gauges drawn on it, blank faces, organised',
      'diez-clientes': 'A young entrepreneur talking with a potential customer in a Mexican street, notebook in hand, genuine conversation',
      'costos-ocultos': 'A desk covered with permit forms, receipts and a clock, more paperwork than product, slightly overwhelming',
      'precio-valor': 'A beautifully presented handmade cake on a stand beside its plain ingredients, striking difference in perceived value',
      'contrato-escrito': 'Two people signing a simple written agreement across a table, both relaxed, small workshop background',
      'cerrar-bien': 'A shop owner shaking hands with a supplier while closing up the shop for the last time, dignified and calm',
    },
    laminas: [
      'pitch-elevador', 'formalidad-rfc', 'ventas-escucha', 'financiamiento-fuentes', 'kpis-tablero',
      'diez-clientes', 'costos-ocultos', 'precio-valor', 'contrato-escrito', 'cerrar-bien',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'pitch-elevador',
        tomas: [
          'Sesenta segundos.',
          { t: 'Ese es todo el tiempo que vas a tener para convencer a alguien de tu idea.', recorte: [0.5, 0.5, 0.6] },
          'Y este bloque empieza justo ahí.',
          { t: 'Aprendiendo a decir en un minuto lo que otros no dicen en veinte.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'formalidad-rfc',
        tomas: [
          'Después viene la parte que casi nadie explica a esta edad.',
          { t: 'Qué significa formalizar un negocio, y la diferencia entre persona física y moral.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y las ventas, que no son hablar bonito.', fondo: 'ventas-escucha' },
          { t: 'Son escuchar bien.', fondo: 'ventas-escucha', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'financiamiento-fuentes',
        tomas: [
          'Vas a conocer de dónde sale el dinero para arrancar.',
          { t: 'Y la diferencia entre pedir prestado y vender una parte de tu negocio.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y a medir, con cuatro indicadores que dicen la verdad.', fondo: 'kpis-tablero', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'diez-clientes',
        tomas: [
          'La segunda mitad es la más práctica de todo el año.',
          { t: 'La prueba de los diez clientes, antes de gastar un peso.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Los costos que nunca aparecen en el plan inicial.', fondo: 'costos-ocultos' },
          { t: 'Y cómo poner precio por el valor que percibe el cliente, no por lo que te costó.', fondo: 'precio-valor', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'contrato-escrito',
        tomas: [
          'Y cierra con dos cosas que nadie quiere pensar y todos necesitan.',
          { t: 'Por qué todo se pone por escrito.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y cómo cerrar bien un negocio que no funcionó.', fondo: 'cerrar-bien' },
          { t: 'Porque casi todos los que llegan lejos cerraron algo antes. Empezamos.', fondo: 'cerrar-bien', respiro: 1.2 },
        ],
      },
    ],
  },

  {
    id: 'p6-b4-u6',
    titulo: 'Diez conversaciones antes del primer peso',
    imagenes: {
      'enamorado-idea': 'A young entrepreneur surrounded by boxes of unsold stock in a garage, the product clearly overproduced, disappointed',
      'diez-conversaciones': 'A young person talking with a stranger at a market, notebook open, genuine listening posture, sunny daylight',
      'amigos-amables': 'A group of friends nodding encouragingly at a product without much real interest, polite smiles, schoolyard',
      'compromiso-vale': 'A customer handing over a deposit and receiving a written note in return, market stall, the moment of real commitment',
      'permisos-tramites': 'A counter at a government office with stacks of forms and a queue, bureaucratic reality, institutional lighting',
      'reloj-horas': 'A wall clock beside a work table full of unfinished product late at night, exhausted workspace',
      'desgaste-familia': 'A person working late in a home workshop while family life continues in the next room without them, warm but distant',
      'pastel-celebracion': 'A birthday celebration in a Mexican home with a beautiful cake at the centre and happy people around it, warm evening light',
      'tres-limites-precio': 'Three horizontal lines drawn on a whiteboard at different heights with a marker resting between them, clean diagram',
      'memoria-versiones': 'Two people recalling an agreement differently, each gesturing their own version, mild disagreement, plain background',
      'seis-elementos': 'A simple one page written agreement on a desk with six short sections, all text areas blank, pen beside it',
      'cerrar-cara': 'A small business owner personally explaining the closure to a loyal customer at the counter, honest and respectful',
    },
    laminas: [
      'enamorado-idea', 'diez-conversaciones', 'amigos-amables', 'compromiso-vale', 'permisos-tramites',
      'reloj-horas', 'desgaste-familia', 'pastel-celebracion', 'tres-limites-precio', 'memoria-versiones',
      'seis-elementos', 'cerrar-cara',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'enamorado-idea',
        tomas: [
          'El patrón se repite y siempre termina igual.',
          { t: 'Alguien tiene una idea, la desarrolla en su cabeza, invierte sus ahorros en producto, empaque e imagen.', recorte: [0.5, 0.5, 0.6] },
          'Y hasta entonces sale a vender.',
          { t: 'Si el mercado no la quería, el dinero ya se gastó.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'diez-conversaciones',
        tomas: [
          'La prueba de los diez clientes le da la vuelta.',
          { t: 'Hablar con diez personas del público objetivo real antes de invertir un peso.', rotulo: '10 clientes' },
          { t: 'No amigos ni familiares.', fondo: 'amigos-amables' },
          { t: 'Ellos van a decir que les gusta, porque te quieren, y eso no es información.', fondo: 'amigos-amables', recorte: [0.5, 0.5, 0.6] },
          { t: 'Personas que efectivamente tienen el problema.', fondo: 'diez-conversaciones' },
          { t: 'Y se pregunta por lo que ya hacen, no por tu idea.', fondo: 'diez-conversaciones' },
          { t: 'Cómo resuelves esto hoy. Cuánto pagas. Qué te molesta de la solución actual.', fondo: 'diez-conversaciones', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'compromiso-vale',
        tomas: [
          'Y hay una escala de valor en las respuestas.',
          { t: 'Qué buena idea no vale absolutamente nada.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Yo ya pago doscientos al mes por algo parecido vale muchísimo, porque describe un gasto real.', cifra: ['200', 'al mes ya gasta'] },
          { t: 'Y te lo compro ahora vale más que todo lo anterior junto.' },
          { t: 'Solo el compromiso valida.', rotulo: 'Solo el compromiso valida' },
          { t: 'Todo lo demás es cortesía.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'permisos-tramites',
        tomas: [
          'Después están los costos que nunca aparecen en el plan inicial.',
          { t: 'Registros, permisos según el giro, obligaciones fiscales, a veces apoyo contable.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pero el más ignorado de todos es otro.', fondo: 'reloj-horas' },
          { t: 'Tu propio tiempo.', fondo: 'reloj-horas', rotulo: 'Tu tiempo cuesta' },
          { t: 'Si dedicas veinte horas semanales al negocio, esas horas valen algo.', fondo: 'reloj-horas' },
          { t: 'Un negocio que deja cuatro mil al mes por ochenta horas de trabajo paga cincuenta pesos la hora.', fondo: 'reloj-horas', cifra: ['50', 'por hora'] },
          { t: 'Y el desgaste también se paga, aunque no aparezca en ningún estado financiero.', fondo: 'desgaste-familia' },
          { t: 'Costear completo casi siempre revela que la utilidad real es menor de lo calculado.', fondo: 'desgaste-familia' },
          { t: 'La respuesta correcta casi nunca es abandonar. Es ajustar el precio o simplificar el modelo.', fondo: 'desgaste-familia', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'pastel-celebracion',
        tomas: [
          'Y aquí está el cambio de mentalidad más grande del bloque.',
          { t: 'Nadie compra un pastel.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Compra una celebración que salga bien.' },
          { t: 'Nadie compra una reparación: compra volver a usar su coche.' },
          { t: 'El costo solo marca el piso. El valor percibido marca el techo.', fondo: 'tres-limites-precio' },
          { t: 'Y la competencia define el rango en el que te mueves.', fondo: 'tres-limites-precio' },
          { t: 'La rapidez, la garantía, la presentación y la atención suben el valor sin subir mucho el costo.', fondo: 'pastel-celebracion' },
          { t: 'Y todo acuerdo se pone por escrito, porque la memoria no es un contrato.', fondo: 'memoria-versiones' },
          { t: 'Cada parte guarda su versión, y las dos suelen ser sinceras.', fondo: 'memoria-versiones' },
          { t: 'Seis elementos mínimos, y dos que casi siempre se olvidan.', fondo: 'seis-elementos' },
          { t: 'Qué no incluye el trabajo, y qué pasa si algo falla.', fondo: 'seis-elementos', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y si al final no funcionó, cerrar bien es parte del oficio.', fondo: 'cerrar-cara' },
          { t: 'Quien cierra dando la cara conserva su reputación, que es el activo que se lleva al siguiente negocio.', fondo: 'cerrar-cara' },
          { t: 'Habla con diez. Costea tu tiempo. Y pon por escrito lo que no incluye.', fondo: 'cerrar-cara', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ═══ RETO SUPREMO · Mi Primer Negocio ════════════════════════════════════ */

  {
    id: 'p6-supremo',
    titulo: 'Mi Primer Negocio',
    imagenes: {
      'quinientos-capital': 'A small stack of banknotes on a kitchen table beside a blank notebook and a pencil, the starting capital, morning light',
      'puesto-aguas': 'A colourful street stall selling fresh fruit waters in Mexico with big glass jars, sunny and inviting',
      'elegir-lugar': 'Two possible stall locations shown in one composition, one on a busy corner and one on a quiet street, clear contrast',
      'precio-inventario': 'A young entrepreneur writing calculations in a notebook beside fruit and ice on a work table, planning',
      'dia-venta': 'A busy moment at the stall with a queue of customers and the young owner serving quickly, energetic midday',
      'cierre-cuentas': 'The same young entrepreneur counting the takings at the end of the day beside the notebook of numbers, satisfied and tired',
    },
    laminas: ['quinientos-capital', 'puesto-aguas', 'elegir-lugar', 'precio-inventario', 'dia-venta', 'cierre-cuentas'],
    bloques: [
      {
        paso: 0,
        fondo: 'quinientos-capital',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Quinientos pesos de capital.', cifra: ['500', 'de capital'], recorte: [0.5, 0.5, 0.6] },
          { t: 'Y un puesto de aguas frescas que existe sólo si tú lo planeas bien.', fondo: 'puesto-aguas' },
          { t: 'Nadie te va a decir el precio ni cuántos vasos preparar. Eso lo decides tú.', fondo: 'puesto-aguas', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'elegir-lugar',
        tomas: [
          'Primera decisión: dónde te pones.',
          { t: 'Una esquina con mucha gente y renta alta, o una calle tranquila y barata.', recorte: [0.5, 0.5, 0.62] },
          { t: 'No hay opción correcta. Hay una que cuadra con tu precio y tu inventario.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'precio-inventario',
        tomas: [
          'Segunda: cuánto cobras y cuánto produces.',
          { t: 'El costo por vaso es el piso. Lo que la gente está dispuesta a pagar es el techo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y si te sobra producto que se echa a perder, ese costo ya lo pagaste.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'dia-venta',
        tomas: [
          'Y llega el día.',
          { t: 'Va a haber una hora en que se acaba todo y otra en que no llega nadie.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Las dos cosas son información para el siguiente día.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cierre-cuentas',
        tomas: [
          'Gana quien cierra con la utilidad más alta.',
          { t: 'No quien vendió más vasos.' },
          { t: 'Cobrar no es ganar. Monta tu puesto.', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
