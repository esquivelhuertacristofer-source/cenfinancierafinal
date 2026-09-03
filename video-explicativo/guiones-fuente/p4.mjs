/**
 * Primaria 4 — 9 a 10 años. Cinco videos.
 *
 * REGISTRO. Es el grado donde empieza el porqué y no solo el qué. Ya se puede
 * decir "la razón es que" sin perderlo, y ya aguanta un porcentaje y una resta
 * entre dos porcentajes (el GAT real). Sigue sin aguantar una fórmula.
 *
 * Contenido de `public/data/pedagogia/primaria/p4.json`, unidades 6 a 10.
 * Diccion para XTTS: siglas deletreadas en el texto (G A T, S O F I P O,
 * S M S, N I P), sin comillas, sin puntos suspensivos.
 */

export const ARGUMENTOS = [
  /* ── BLOQUE 1 · Primeros Pasos Hacia el Ahorro, segunda parte ──────────────
     P4-1-6 tipos de cuenta · P4-1-7 el GAT · P4-1-8 bancos SOFIPOs y cajas
     P4-1-9 remesas · P4-1-10 hablar de dinero en familia */
  {
    id: 'p4-b1-u6',
    titulo: 'El número que no te dicen',
    imagenes: {
      'tres-cuentas': 'Three bank card designs laid side by side on a desk, clearly different from each other, blank surfaces, clean product photography style',
      'nomina-quincena': 'A Mexican worker in uniform checking a phone notification outside a workplace at the end of a shift, factory gate behind, late afternoon',
      'cuenta-ahorro': 'A closed savings passbook and a small locked box on a shelf, undisturbed and dusty free, quiet domestic setting',
      'cuenta-digital': 'A teenager opening a bank account entirely from a smartphone at a kitchen table, no paperwork anywhere, morning light',
      'dos-carteles': 'Two bank storefronts side by side on a Mexican street, each with a large blank promotional banner in the window',
      'gat-lupa': 'A magnifying glass held over the fine print at the bottom of a financial brochure, the fine print blank and smooth, desk setting',
      'inflacion-carrito': 'A shopping trolley with the same groceries shown twice side by side, the second one visibly holding fewer items, illustrative comparison',
      'banco-vs-sofipo': 'A large formal bank building and a smaller neighbourhood financial branch shown side by side in one street composition, both legitimate looking',
      'caja-informal': 'A small folding table set up in a doorway of a Mexican street with a metal cash box and a notebook, an informal savings collection, slightly precarious',
      'verificar-registro': 'A parent and a nine year old child checking an official registry on a laptop at the kitchen table, focused and calm',
      'remesa-frontera': 'A person in a remittance office abroad sending money at a counter, and a Mexican family receiving it at a counter, shown as one split composition',
      'familia-conversa': 'A Mexican family of four talking calmly around the dinner table with a notebook open between them, respectful and unhurried, evening light',
    },
    laminas: [
      'tres-cuentas', 'nomina-quincena', 'cuenta-ahorro', 'cuenta-digital', 'dos-carteles',
      'gat-lupa', 'inflacion-carrito', 'banco-vs-sofipo', 'caja-informal', 'verificar-registro',
      'remesa-frontera', 'familia-conversa',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'dos-carteles',
        tomas: [
          'Un banco dice que paga seis por ciento.',
          { t: 'Otro dice cinco, pero sin comisiones.', recorte: [0.7, 0.5, 0.5] },
          'Un tercero promete el mejor rendimiento del mercado.',
          { t: 'Y ninguno de esos tres números sirve para comparar.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'tres-cuentas',
        tomas: [
          'Empecemos por lo primero: no todas las cuentas son la misma cuenta.',
          { t: 'La de nómina la abre una empresa para depositar sueldos.', fondo: 'nomina-quincena' },
          { t: 'Como el banco gana con ese flujo cada quincena, casi nunca cobra manejo ni pide saldo mínimo.', fondo: 'nomina-quincena', recorte: [0.5, 0.5, 0.6] },
          { t: 'La de ahorro está pensada para guardar, no para mover dinero todos los días.', fondo: 'cuenta-ahorro' },
          { t: 'Y la digital se abre desde el celular en minutos.', fondo: 'cuenta-digital' },
          { t: 'A cambio tiene límites: un tope de saldo y un tope de lo que puedes mover al mes.', fondo: 'cuenta-digital' },
          { t: 'Cuatro preguntas y la elección deja de ser adivinanza. Para qué la voy a usar, cuánto cobra, qué pide y qué límites tiene.', fondo: 'tres-cuentas', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'gat-lupa',
        tomas: [
          'Ahora sí, el número que resume todo.',
          { t: 'Se llama G A T. Ganancia Anual Total.', rotulo: 'GAT' },
          { t: 'Es un porcentaje que dice cuánto rinde de verdad un ahorro en un año, ya descontadas las comisiones.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Por ley tiene que venir publicado. No hay que pedirlo, hay que buscarlo.' },
          { t: 'Pero viene en dos versiones, y ahí está el truco.', fondo: 'inflacion-carrito' },
          { t: 'El G A T nominal dice cuánto crece tu dinero en pesos. Mil pesos al cinco por ciento son mil cincuenta.', fondo: 'inflacion-carrito', cifra: ['1050', 'al año'] },
          { t: 'Pero si mientras tanto los precios subieron seis por ciento, con esos mil cincuenta compras menos que antes.', fondo: 'inflacion-carrito' },
          { t: 'El G A T real le resta la inflación al nominal. Ese es el que dice la verdad.', fondo: 'inflacion-carrito', rotulo: 'GAT real' },
          { t: 'Real positivo: tu dinero compra más. Real negativo: compra menos, aunque tengas más pesos.', fondo: 'inflacion-carrito', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'banco-vs-sofipo',
        tomas: [
          'Y no todas las instituciones que reciben dinero son iguales.',
          { t: 'Los bancos tienen la supervisión más estricta y el respaldo del I P A B.', recorte: [0.35, 0.5, 0.6] },
          { t: 'Las S O F I P O son sociedades financieras populares, autorizadas y con su propio fondo de protección.', recorte: [0.72, 0.5, 0.55] },
          { t: 'Llegan a gente y comunidades donde la banca tradicional no llega.' },
          { t: 'Y luego están las cajas de ahorro, donde está la trampa.', fondo: 'caja-informal' },
          { t: 'Hay cajas y cooperativas debidamente autorizadas, que son opciones legítimas.', fondo: 'caja-informal' },
          { t: 'Y hay cajas informales que no responden ante nadie.', fondo: 'caja-informal', recorte: [0.5, 0.5, 0.6] },
          { t: 'La diferencia no se ve en el letrero de la puerta.', fondo: 'verificar-registro' },
          { t: 'Se verifica en los registros oficiales. Es gratis y toma dos minutos.', fondo: 'verificar-registro' },
          { t: 'Una oficina elegante y un uniforme bonito no son una autorización.', fondo: 'verificar-registro', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'remesa-frontera',
        tomas: [
          'Hay un dinero que sostiene a millones de familias mexicanas.',
          { t: 'Las remesas: lo que alguien que trabaja en otro país manda a los suyos.', rotulo: 'Remesa' },
          { t: 'Suman decenas de miles de millones de dólares al año.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y enviarlas cuesta de dos formas, no de una.' },
          { t: 'La comisión, que está a la vista. Y el tipo de cambio, que casi nunca lo está.' },
          { t: 'Por eso hay una sola pregunta que sirve para comparar.' },
          { t: 'Cuántos pesos va a recibir la familia. Ese número ya incluye todo.' },
          { t: 'Y falta la conversación que en muchas casas no existe.', fondo: 'familia-conversa' },
          { t: 'Hablar de dinero mezcla números con emociones, por eso termina en discusión.', fondo: 'familia-conversa', recorte: [0.5, 0.5, 0.6] },
          { t: 'Tres reglas. La peor hora para hablar de dinero es en medio de un problema de dinero.', fondo: 'familia-conversa' },
          { t: 'Números, no culpas. Este mes gastamos ochocientos y teníamos quinientos planeados abre una conversación distinta.', fondo: 'familia-conversa' },
          { t: 'Y terminar con un acuerdo concreto, aunque sea pequeño.', fondo: 'familia-conversa' },
          { t: 'Busca el G A T real. Verifica antes de confiar. Y ten la conversación en calma.', fondo: 'familia-conversa', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 2 · Construyendo Independencia, segunda parte ──────────────────
     P4-2-6 suscripciones · P4-2-7 compras en videojuegos · P4-2-8 phishing
     P4-2-9 robo de tarjeta · P4-2-10 huella digital */
  {
    id: 'p4-b2-u6',
    titulo: 'Los cobros que se hacen solos',
    imagenes: {
      'cobros-automaticos': 'A smartphone screen showing a long list of blank recurring charge rows, held in a hand, kitchen table, warm light',
      'cinco-servicios': 'Five different app style tiles arranged in a row on a tablet screen, all blank and colourful, top down view',
      'prueba-gratis': 'A calendar with a start date circled and a date thirty days later circled in red, a phone beside it, desk setting',
      'revision-trimestral': 'A ten year old and a parent going through a phone together with a notebook, cancelling items from a list, focused',
      'gemas-juego': 'A child playing a colourful mobile game showing a shop screen full of blank gem icons, absorbed expression, dim bedroom light',
      'paquetes-sobrante': 'Three coin pouches of different sizes beside a price tag, none of them matching it exactly, illustrative flat composition',
      'oferta-reloj': 'A countdown timer graphic glowing on a phone screen with a bright offer banner, urgent visual pressure, dark room',
      'mensaje-banco': 'A smartphone lock screen showing an alarming looking blank message notification at night, a worried hand reaching for it',
      'nunca-pide': 'A bank clerk shaking their head calmly across a counter with an open palm gesture of refusal, professional and reassuring',
      'tarjeta-perdida': 'A person searching an empty pocket and a bag with growing alarm on a Mexican street, phone already in the other hand',
      'bloquear-primero': 'A hand pressing a large clear button on a phone banking screen with urgency, the rest of the screen blank, close up',
      'huella-anuncios': 'A person browsing shoes on a laptop, and the same shoes appearing on a phone screen beside them later, one composition, illustrative',
    },
    laminas: [
      'cobros-automaticos', 'cinco-servicios', 'prueba-gratis', 'revision-trimestral', 'gemas-juego',
      'paquetes-sobrante', 'oferta-reloj', 'mensaje-banco', 'nunca-pide', 'tarjeta-perdida',
      'bloquear-primero', 'huella-anuncios',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'cobros-automaticos',
        tomas: [
          'Hay gastos que no decides cada mes.',
          { t: 'Se cobran solos.', recorte: [0.5, 0.5, 0.55] },
          'Y siguen cobrando aunque hayas dejado de usarlos.',
          { t: 'Se llaman suscripciones, y la razón por la que funcionan es que nadie las revisa.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'cinco-servicios',
        tomas: [
          'Los precios están puestos para no doler.',
          { t: 'Setenta y nueve, noventa y nueve, ciento cuarenta y nueve al mes.', recorte: [0.5, 0.5, 0.65] },
          { t: 'Cada uno por separado parece irrelevante. Y esa es exactamente la idea.' },
          { t: 'Cinco suscripciones de cien pesos son quinientos al mes.', cifra: ['6000', 'al año'] },
          { t: 'Y seis mil pesos al año, que ya no es irrelevante.' },
          { t: 'La prueba gratis pide tu tarjeta desde el primer día, aunque no cobre nada todavía.', fondo: 'prueba-gratis' },
          { t: 'Al terminar el periodo empieza a cobrar sin avisar. Quien no anotó la fecha se entera meses después.', fondo: 'prueba-gratis' },
          { t: 'El hábito que lo resuelve: revisar cada tres meses y una sola pregunta por cada una.', fondo: 'revision-trimestral' },
          { t: 'La usé en este periodo. Si la respuesta es no, se cancela. Siempre se puede volver a contratar.', fondo: 'revision-trimestral', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'gemas-juego',
        tomas: [
          'En muchos juegos no pagas con pesos.',
          { t: 'Pagas con gemas, monedas o créditos. Eso tampoco es casualidad.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Si algo cuesta setecientas cincuenta gemas, no hay forma de saber si es caro sin hacer una conversión.' },
          { t: 'Y como convertir cuesta esfuerzo, casi nadie lo hace.' },
          { t: 'Además, los paquetes nunca cuadran.', fondo: 'paquetes-sobrante' },
          { t: 'Si el artículo cuesta setecientas cincuenta, los paquetes serán de quinientas o de mil doscientas.', fondo: 'paquetes-sobrante', recorte: [0.5, 0.5, 0.7] },
          { t: 'Siempre queda un sobrante que no alcanza para nada y que te empuja al siguiente paquete.', fondo: 'paquetes-sobrante' },
          { t: 'Y trabajan tres cosas juntas: la prisa, el azar y la presión de los amigos.', fondo: 'oferta-reloj' },
          { t: 'La oferta por tiempo limitado existe para que no pienses.', fondo: 'oferta-reloj' },
          { t: 'Contra todo eso hay una sola herramienta: espera veinticuatro horas.', fondo: 'oferta-reloj' },
          { t: 'Si al día siguiente lo sigues queriendo, cómpralo dentro de tu límite. Si se te olvidó, nunca fue tuyo.', fondo: 'oferta-reloj', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'mensaje-banco',
        tomas: [
          'Llega un mensaje que dice ser de tu banco.',
          { t: 'Hay un cargo sospechoso. Tu cuenta será bloqueada. Haz clic aquí.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El corazón se acelera, y ahí está el problema.' },
          { t: 'Eso se llama phishing, y su herramienta principal no es la tecnología. Es la prisa.', rotulo: 'Phishing' },
          { t: 'Una persona apurada no verifica.' },
          { t: 'Hay cosas que ninguna institución legítima pide por mensaje ni por llamada.', fondo: 'nunca-pide' },
          { t: 'Tu contraseña completa, tu N I P, el código que te llegó por S M S, los datos completos de tu tarjeta.', fondo: 'nunca-pide', recorte: [0.5, 0.5, 0.62] },
          { t: 'El protocolo son tres pasos. No des clic en nada ni llames al número del mensaje.', fondo: 'nunca-pide' },
          { t: 'Entra por la app oficial o llama al número impreso atrás de la tarjeta.', fondo: 'nunca-pide' },
          { t: 'Y si era falso, repórtalo. Lo que tú reportas protege al siguiente.', fondo: 'nunca-pide', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'tarjeta-perdida',
        tomas: [
          'Metes la mano a la bolsa y la tarjeta no está.',
          { t: 'Lo que hagas en los siguientes cinco minutos define si pierdes cero o lo pierdes todo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Bloquear va primero. Antes de buscarla, antes de avisar en casa.', fondo: 'bloquear-primero', rotulo: 'Bloquear' },
          { t: 'Mientras la tarjeta esté activa, cada minuto es una oportunidad para que alguien la use.', fondo: 'bloquear-primero' },
          { t: 'Y bloquear es gratis, es inmediato y no tiene ninguna desventaja si luego aparece.', fondo: 'bloquear-primero' },
          { t: 'El banco te da un folio con fecha y hora. Ese folio es la prueba.', fondo: 'bloquear-primero' },
          { t: 'Es lo que separa los cargos de antes del bloqueo de los de después.', fondo: 'bloquear-primero' },
          { t: 'Y hay algo que dejas atrás con cada clic, aunque nadie te robe nada.', fondo: 'huella-anuncios' },
          { t: 'Buscas unos tenis y en la tarde te aparecen anuncios de tenis en todas partes.', fondo: 'huella-anuncios', recorte: [0.5, 0.5, 0.6] },
          { t: 'No es magia ni es robo: es un intercambio. Cuando una app es gratis, muchas veces el producto es tu atención.', fondo: 'huella-anuncios' },
          { t: 'Ese anuncio no llega porque el producto sea mejor. Llega porque es mejor momento para venderte.', fondo: 'huella-anuncios' },
          { t: 'Revisa cada tres meses. Espera veinticuatro horas. Y bloquea antes de buscar.', fondo: 'huella-anuncios', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 3 · Planificación y Crecimiento, segunda parte ─────────────────
     P4-3-6 fondo de emergencia · P4-3-7 tres horizontes · P4-3-8 ahorro automatico
     P4-3-9 costo de oportunidad · P4-3-10 revisar el plan */
  {
    id: 'p4-b3-u6',
    titulo: 'Págate a ti primero',
    imagenes: {
      'imprevisto-casa': 'A Mexican family looking at a burst water pipe under the kitchen sink with water on the floor, sudden problem, midday light',
      'colchon-fondo': 'A sealed jar of banknotes sitting apart on a high shelf, separate from everything else in the room, quiet and untouched',
      'tres-meses': 'Three identical stacks of banknotes lined up on a table with household bills beside them, top down view, plain background',
      'tres-frascos-plazo': 'Three glass jars of increasing size on a shelf, each holding a different amount, clear visual progression left to right',
      'corto-plazo': 'A gift, a school course flyer and a first aid kit arranged together on a table, near term goals, flat lay',
      'largo-plazo': 'A university building photograph and a small house key resting on a table together, long term goals, warm light',
      'ahorra-lo-que-sobra': 'An empty wallet lying open on a table at the end of the month, a few coins scattered, disappointed atmosphere',
      'apartar-primero': 'A person dividing an envelope of money the moment it arrives, putting one portion straight into a separate jar, decisive gesture',
      'transferencia-automatica': 'A phone screen showing a scheduled transfer with a repeat icon, blank fields, resting on a desk beside a calendar',
      'dos-caminos': 'A person standing at a fork in a path with two clearly different routes ahead, seen from behind, stylized illustrative landscape',
      'audifonos-vs': 'A pair of headphones on one side of a table and a small stack of banknotes on the other, equally weighted composition, top down view',
      'revisar-calendario': 'A parent and child reviewing a plan on paper with a calendar open beside them, calm quarterly review, kitchen table',
    },
    laminas: [
      'imprevisto-casa', 'colchon-fondo', 'tres-meses', 'tres-frascos-plazo', 'corto-plazo',
      'largo-plazo', 'ahorra-lo-que-sobra', 'apartar-primero', 'transferencia-automatica', 'dos-caminos',
      'audifonos-vs', 'revisar-calendario',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'imprevisto-casa',
        tomas: [
          'A todas las familias les pasa algo inesperado.',
          { t: 'Se descompone algo, alguien se enferma, se cae un ingreso.', recorte: [0.5, 0.5, 0.6] },
          'Y la diferencia entre las que salen adelante y las que se endeudan',
          { t: 'casi siempre es una sola cosa: tener dinero apartado antes.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'colchon-fondo',
        tomas: [
          'Eso es un fondo de emergencia.',
          { t: 'No es el ahorro para un viaje ni para un celular nuevo.', rotulo: 'Fondo de emergencia' },
          { t: 'Es el colchón que evita que un problema se convierta en una deuda.', recorte: [0.5, 0.5, 0.6] },
          { t: 'La referencia son de tres a seis meses de gastos esenciales.', fondo: 'tres-meses' },
          { t: 'De los esenciales, no de todos. Vivienda, comida, servicios, transporte y salud.', fondo: 'tres-meses' },
          { t: 'Y tiene dos requisitos que parecen contradecirse.', fondo: 'colchon-fondo' },
          { t: 'Disponible de inmediato, porque una emergencia no espera. Y separado, porque si está a la mano se gasta en cualquier cosa.', fondo: 'colchon-fondo' },
          { t: 'Antes de tocarlo, tres preguntas. Es inesperado. Es necesario. Es urgente.', fondo: 'colchon-fondo' },
          { t: 'Solo si las tres son sí. Una oferta de temporada no es inesperada.', fondo: 'colchon-fondo', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'tres-frascos-plazo',
        tomas: [
          'Mucha gente ahorra todo en el mismo lugar.',
          { t: 'Y después se pregunta a dónde se fue el dinero de lo importante.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Se lo llevó algo pequeño, porque el dinero junto no tiene nombre.' },
          { t: 'Sepáralo en tres plazos.', rotulo: 'Tres plazos' },
          { t: 'Corto: hasta un año. Un regalo, un curso, y el fondo de emergencia.', fondo: 'corto-plazo' },
          { t: 'Este dinero debe estar disponible y sin riesgo.', fondo: 'corto-plazo' },
          { t: 'Mediano: de uno a cinco años. Algo grande, un viaje, parte de los estudios.', fondo: 'tres-frascos-plazo' },
          { t: 'Largo: más de cinco años. Lo que no se va a tocar en mucho tiempo.', fondo: 'largo-plazo' },
          { t: 'Como el tiempo es largo, aguanta variaciones y puede buscar más rendimiento.', fondo: 'largo-plazo', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'ahorra-lo-que-sobra',
        tomas: [
          'Casi todo el mundo se propone ahorrar lo que sobre.',
          { t: 'Y casi nunca sobra.', recorte: [0.5, 0.5, 0.55] },
          { t: 'El problema no es la voluntad. Es el orden.' },
          { t: 'Cuando el ahorro queda al final, compite contra todo lo demás y pierde siempre.' },
          { t: 'Porque el gasto crece hasta llenar el dinero disponible. Si hay más, se gasta más, casi sin notarlo.' },
          { t: 'Se invierte el orden.', fondo: 'apartar-primero' },
          { t: 'En cuanto entra el dinero, se aparta el ahorro. Y después se decide cómo gastar el resto.', fondo: 'apartar-primero', rotulo: 'Págate primero' },
          { t: 'Se llama pagarse a uno mismo primero, porque se trata al ahorro como a cualquier otro cobro.', fondo: 'apartar-primero' },
          { t: 'Y lo sorprendente es que funciona sin sacrificio proporcional: uno se organiza con lo que queda.', fondo: 'apartar-primero' },
          { t: 'El paso final es automatizarlo: una transferencia programada el día que entra el ingreso.', fondo: 'transferencia-automatica' },
          { t: 'Así el ahorro deja de depender de tener ganas ese día.', fondo: 'transferencia-automatica', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'dos-caminos',
        tomas: [
          'Cada vez que eliges algo, dejas de elegir otra cosa.',
          { t: 'Eso tiene nombre y hasta se puede calcular: costo de oportunidad.', rotulo: 'Costo de oportunidad' },
          { t: 'Es el valor de la mejor alternativa que dejaste de lado.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Si con quinientos pesos compras unos audífonos, el costo de oportunidad es lo mejor que podrías haber hecho con esos quinientos.', fondo: 'audifonos-vs' },
          { t: 'Y también aplica al tiempo.', fondo: 'dos-caminos' },
          { t: 'Dos horas diarias en algo son más de setecientas al año.', fondo: 'dos-caminos', cifra: ['700', 'horas al año'] },
          { t: 'La herramienta es una sola pregunta antes de decidir.', fondo: 'dos-caminos' },
          { t: 'Si elijo esto, qué es lo mejor que estoy dejando de hacer.', fondo: 'dos-caminos' },
          { t: 'Y por último: ningún plan sobrevive intacto al paso del tiempo.', fondo: 'revisar-calendario' },
          { t: 'Ajustar por causa real es correcto: subió el precio, bajó el ingreso.', fondo: 'revisar-calendario' },
          { t: 'Abandonar por cansancio se disfraza de ajuste. Si no puedes nombrar qué cambió, no cambió nada.', fondo: 'revisar-calendario' },
          { t: 'Aparta primero. Separa por plazos. Y revisa en calendario, no en crisis.', fondo: 'revisar-calendario', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 4 · Emprendimiento, segunda parte ──────────────────────────────
     P4-4-6 problema que valga la pena · P4-4-7 propuesta de valor · P4-4-8 proveedores
     P4-4-9 registro diario · P4-4-10 reinvertir o repartir */
  {
    id: 'p4-b4-u6',
    titulo: 'Cobrar no es ganar',
    imagenes: {
      'idea-brillante': 'A ten year old with a bright imagined lightbulb above their head, excited, standing alone in an empty schoolyard, nobody around to care',
      'observar-entorno': 'A child sitting on a bench in a Mexican school corridor watching people pass, notebook open on their lap, attentive',
      'solucion-improvisada': 'A wobbly improvised fix on a school object held together with tape and string, close up, clearly a workaround someone made',
      'dispuesto-pagar': 'A child offering a small handmade product to a classmate who is reaching into their pocket, the moment of deciding to pay or not',
      'frase-unica': 'A single short sentence written in large letters on a blank card held up by a child, the card mostly empty, classroom background',
      'taladro-hoyo': 'A drill lying on a workbench beside a wall with a single clean hole in it, illustrative comparison, workshop light',
      'dos-proveedores': 'Two market stalls selling the same craft materials side by side in a Mexican market, one busier than the other, morning light',
      'material-roto': 'A broken handmade product on a table beside the material it was made from, a disappointed young maker looking at it',
      'entrega-tarde': 'A child checking a wall calendar anxiously beside an empty work table with no materials on it, waiting',
      'tres-columnas': 'A notebook page ruled into three neat columns with rows of short entries, pencil beside it, top down view',
      'cobrar-vs-ganar': 'A cash box full of coins on one side of a table and a much smaller pile of coins on the other side, clear contrast, top down view',
      'tres-destinos': 'Three labelled jars behind a small business stall, one next to fresh materials, one closed, one beside a small personal treat',
    },
    laminas: [
      'idea-brillante', 'observar-entorno', 'solucion-improvisada', 'dispuesto-pagar', 'frase-unica',
      'taladro-hoyo', 'dos-proveedores', 'material-roto', 'entrega-tarde', 'tres-columnas',
      'cobrar-vs-ganar', 'tres-destinos',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'idea-brillante',
        tomas: [
          'La mayoría de los negocios que fracasan no fracasan por trabajar mal.',
          { t: 'Fracasan porque resolvían algo que a nadie le importaba.', recorte: [0.5, 0.5, 0.6] },
          'Por eso los buenos emprendedores no salen a buscar ideas geniales.',
          { t: 'Salen a buscar problemas reales.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'observar-entorno',
        tomas: [
          'Una idea es algo que se te ocurre. Un problema es algo que a alguien le pasa.',
          { t: 'Y los problemas no se inventan: se observan.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Qué cosas tardan de más. Qué molesta. Qué resuelve la gente de forma improvisada.' },
          { t: 'Esas soluciones improvisadas son la mejor pista que existe.', fondo: 'solucion-improvisada' },
          { t: 'Alguien ya se tomó la molestia de arreglarlo mal. Eso significa que le importa.', fondo: 'solucion-improvisada', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'dispuesto-pagar',
        tomas: [
          'Pero no todo problema merece un proyecto.',
          { t: 'Vale la pena si pasa tres pruebas.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Le pasa a mucha gente. Les molesta de verdad. Y estarían dispuestos a pagar por resolverlo.' },
          { t: 'La tercera es la que descarta más ideas, y la que más se evita aplicar.' },
          { t: 'Mucha gente dice que algo le molesta, pero no lo suficiente para pagar.' },
          { t: 'Y si el problema pasa las tres, hay que poder decirlo en una frase.', fondo: 'frase-unica' },
          { t: 'Para quién es. Qué problema resuelve. Y por qué es mejor que lo que ya existe.', fondo: 'frase-unica', recorte: [0.5, 0.5, 0.6] },
          { t: 'Para todos suena ambicioso y en realidad significa para nadie.', fondo: 'frase-unica' },
          { t: 'Y va el problema, no las características.', fondo: 'taladro-hoyo' },
          { t: 'Nadie compra un taladro porque tenga tres velocidades. Lo compra porque necesita un hoyo en la pared.', fondo: 'taladro-hoyo', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'dos-proveedores',
        tomas: [
          'Ahora, de dónde sale tu material.',
          { t: 'Elegir proveedor solo por precio es el error más común al empezar.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El precio es uno de cuatro. Faltan la calidad, el tiempo y la confiabilidad.' },
          { t: 'El material barato que se rompe se paga dos veces.', fondo: 'material-roto' },
          { t: 'Cuando lo compras, y cuando repones o devuelves el dinero a un cliente molesto.', fondo: 'material-roto' },
          { t: 'Si de cada diez piezas dos salen mal, el precio real es mucho mayor que el de la etiqueta.', fondo: 'material-roto' },
          { t: 'Y el tiempo también cuesta, aunque no aparezca en ninguna factura.', fondo: 'entrega-tarde' },
          { t: 'Un proveedor que tarda tres semanas te obliga a guardar más inventario y te hace perder ventas.', fondo: 'entrega-tarde' },
          { t: 'Y pedir un mejor precio no es grosería: es parte de comprar.', fondo: 'dos-proveedores', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cobrar-vs-ganar',
        tomas: [
          'Pregúntale a alguien que vende cuánto ganó ayer.',
          { t: 'Casi siempre te dice cuánto cobró.', recorte: [0.35, 0.5, 0.6] },
          { t: 'Cobrar es todo el dinero que entró. Ganar es lo que queda después de restar lo que costó.', rotulo: 'Cobrar ≠ ganar' },
          { t: 'Un negocio puede cobrar muchísimo y ganar poco, o incluso perder.' },
          { t: 'La diferencia solo aparece si se lleva registro, y basta con tres columnas.', fondo: 'tres-columnas' },
          { t: 'La fecha, lo que entró y lo que salió.', fondo: 'tres-columnas', recorte: [0.5, 0.5, 0.65] },
          { t: 'El mismo día, al cerrar. La memoria a tres días ya no es confiable.', fondo: 'tres-columnas' },
          { t: 'Y el valor no está en llenarlo: está en leerlo.', fondo: 'tres-columnas' },
          { t: 'Con dos semanas de datos ya se ve qué días se vende más y qué gasto está creciendo.', fondo: 'tres-columnas' },
          { t: 'Al final, la ganancia se reparte en tres.', fondo: 'tres-destinos' },
          { t: 'Reinvertir para crecer, reservar para los imprevistos, y retirar como recompensa.', fondo: 'tres-destinos', recorte: [0.5, 0.55, 0.8] },
          { t: 'El error no es retirar. Es retirar todo.', fondo: 'tres-destinos' },
          { t: 'Busca el problema, no la idea. Compara cuatro cosas, no una. Y registra el mismo día.', fondo: 'tres-destinos', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── RETO SUPREMO · Banco del Tiempo: Tres Crisis ──────────────────────────
     1994, 2008 y 2020: decisiones de inversión en las tres grandes crisis. */
  {
    id: 'p4-supremo',
    titulo: 'Banco del Tiempo',
    imagenes: {
      'maquina-tiempo': 'A stylized time machine console with three glowing dials inside a warm study full of old books, adventurous mood',
      'crisis-1994': 'A Mexican street scene in the nineteen nineties with people queuing outside a bank, period clothing and cars, tense atmosphere',
      'crisis-2008': 'A modern office corridor with worried professionals carrying boxes, late two thousands setting, grey daylight',
      'crisis-2020': 'An empty Mexican street with closed shop shutters and a lone masked person walking, quiet pandemic atmosphere',
      'panico-vender': 'A person staring at a falling line on a screen with a hand over their mouth, panic and hesitation, dim room',
      'quedarse-firme': 'The same person sitting calmly with the screen turned off and a plan on paper in front of them, composed and decided',
    },
    laminas: ['maquina-tiempo', 'crisis-1994', 'crisis-2008', 'crisis-2020', 'panico-vender', 'quedarse-firme'],
    bloques: [
      {
        paso: 0,
        fondo: 'maquina-tiempo',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Vas a viajar al pasado tres veces.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y en cada viaje vas a decidir qué hacer con tu dinero.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'crisis-1994',
        tomas: [
          'Mil novecientos noventa y cuatro.',
          { t: 'Dos mil ocho.', fondo: 'crisis-2008', cifra: ['2008', ''] },
          { t: 'Dos mil veinte.', fondo: 'crisis-2020', cifra: ['2020', ''], respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'panico-vender',
        tomas: [
          'En las tres pasó lo mismo.',
          { t: 'Todo bajó, y la mayoría de la gente vendió con miedo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Vender con miedo convierte una caída temporal en una pérdida definitiva.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'quedarse-firme',
        tomas: [
          'Quien tenía un plan escrito antes, lo siguió.',
          { t: 'No porque fuera valiente, sino porque ya había decidido en calma.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y las tres veces, la economía volvió a subir.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'maquina-tiempo',
        tomas: [
          'Tres crisis, tres oportunidades de aprender lo mismo.',
          { t: 'Decide antes. Diversifica. Y no vendas en el peor día.', fondo: 'quedarse-firme' },
          { t: 'Sube al Banco del Tiempo. Te esperan mil novecientos noventa y cuatro.', fondo: 'maquina-tiempo', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
