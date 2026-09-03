/**
 * Primaria 2 — 7 a 8 años. Cinco videos.
 *
 * REGISTRO. Ya aguanta una comparación por idea y un número de dos cifras, pero
 * sigue sin abstracciones: "acumular" se enseña poniendo cinco pesos treinta veces
 * al lado de veinte pesos cuatro veces, no definiendo la palabra.
 *
 * Contenido de `public/data/pedagogia/primaria/p2.json`, unidades 6 a 10.
 * Diccion para XTTS: sin puntos suspensivos, sin comillas, siglas separadas.
 */

export const ARGUMENTOS = [
  /* ── BLOQUE 1 · Primeros Pasos Hacia el Ahorro, segunda parte ──────────────
     P2-1-6 conmemorativas · P2-1-7 el cambio · P2-1-8 los trabajos
     P2-1-9 el dinero se acumula · P2-1-10 no crece en los arboles */
  {
    id: 'p2-b1-u6',
    titulo: 'Cuenta tu cambio',
    imagenes: {
      'moneda-especial': 'A seven year old Mexican boy holding a large commemorative mexican coin up to the light with both hands, curious and impressed, kitchen table, warm morning light',
      'billete-viejo': 'An old worn mexican banknote and a modern polymer one lying side by side on a wooden table, clearly different generations of the same currency, even light',
      'coleccionista': 'A friendly older Mexican man in a small collectors shop showing a coin in a protective case to a child across a glass counter, shelves of albums behind',
      'engano-cambio': 'A stranger offering a handful of old coins to a child in exchange for the childs banknote on a street corner, the child stepping back and looking toward a parent',
      'pagar-cincuenta': 'A childs hand placing a fifty peso banknote on a small shop counter next to a product, the shopkeeper reaching for the till, warm shop light',
      'contar-cambio': 'A child standing at the shop counter counting the returned coins in their own palm before leaving, concentrated, shopkeeper waiting patiently',
      'contar-adelante': 'Coins arranged along a hand drawn number line on paper, a childs finger moving forward across the gaps, top down view',
      'oficios-barrio': 'A lively Mexican neighbourhood street scene with a nurse, a plumber carrying tools, a street food vendor at a cart and a rubbish collector, all working, sunny morning',
      'sueldo-vs-obra': 'A split scene of a teacher standing in front of a classroom on one side and a seamstress finishing a garment at home on the other, both absorbed in their work',
      'cinco-diarios': 'A row of thirty small coins laid out neatly in a long line across a table, a childs hand placing the last one, top down view',
      'veinte-semanal': 'Four larger coin stacks spaced far apart on the same table, clearly fewer coins in total than the long line, top down view',
      'cuentas-casa': 'A Mexican mother at the kitchen table with household bills and a calculator, her seven year old son sitting beside her looking at the papers, evening lamp light',
    },
    laminas: [
      'moneda-especial', 'billete-viejo', 'coleccionista', 'engano-cambio', 'pagar-cincuenta',
      'contar-cambio', 'contar-adelante', 'oficios-barrio', 'sueldo-vs-obra', 'cinco-diarios',
      'veinte-semanal', 'cuentas-casa',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'moneda-especial',
        tomas: [
          'Te llega una moneda distinta a todas.',
          { t: 'Más grande, con un dibujo raro.', recorte: [0.55, 0.42, 0.5] },
          'Alguien te dice que vale muchísimo.',
          { t: 'Antes de creerle, hay que separar dos cosas.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'billete-viejo',
        tomas: [
          'El Banco de México hace monedas para recordar algo importante.',
          { t: 'Se llaman conmemorativas y sirven para pagar igual que cualquiera.', rotulo: 'Conmemorativa' },
          { t: 'Y de vez en cuando cambia los billetes por otros más seguros.', recorte: [0.5, 0.5, 0.65] },
          { t: 'Los viejos se van retirando poco a poco.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'coleccionista',
        tomas: [
          'Aquí está la idea de la clase.',
          { t: 'El valor legal es lo que la pieza compra hoy.', rotulo: 'Valor legal' },
          { t: 'El valor de colección es lo que alguien está dispuesto a pagar por ella.', recorte: [0.5, 0.5, 0.62] },
          'Son dos cosas distintas y casi nunca coinciden.',
          { t: 'Por eso, si alguien te ofrece cambiar tu dinero bueno por piezas viejas, no aceptes solo.', fondo: 'engano-cambio' },
          { t: 'Enséñaselo a un adulto de confianza primero.', fondo: 'engano-cambio', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'pagar-cincuenta',
        tomas: [
          'Ahora lo que usas todos los días.',
          { t: 'Algo vale treinta y siete y pagas con cincuenta.', cifra: ['13', 'de cambio'] },
          { t: 'Te deben devolver trece pesos. Eso es el cambio.', rotulo: 'El cambio' },
          { t: 'No es un regalo ni un favor. Es tu dinero.', recorte: [0.5, 0.55, 0.55] },
          { t: 'Puedes restar. Cincuenta menos treinta y siete son trece.', fondo: 'contar-adelante' },
          { t: 'O contar hacia adelante. De treinta y siete a cuarenta son tres. De cuarenta a cincuenta son diez.', fondo: 'contar-adelante', recorte: [0.5, 0.55, 0.7] },
          { t: 'Tres y diez son trece. El mismo resultado por otro camino.', fondo: 'contar-adelante' },
          { t: 'Y la regla de oro: cuéntalo antes de alejarte del mostrador.', fondo: 'contar-cambio' },
          { t: 'Después ya nadie puede saber qué pasó.', fondo: 'contar-cambio', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'oficios-barrio',
        tomas: [
          'Todo ese dinero viene de algún lado.',
          { t: 'De gente que trabaja en tu barrio.', recorte: [0.5, 0.55, 0.65] },
          { t: 'Unos cobran un sueldo cada quincena por cumplir un horario.', fondo: 'sueldo-vs-obra' },
          { t: 'Otros cobran por obra, por cada trabajo terminado.', fondo: 'sueldo-vs-obra', recorte: [0.72, 0.5, 0.5] },
          { t: 'Ningún trabajo honesto vale menos que otro.', fondo: 'oficios-barrio' },
          { t: 'Y con ese dinero, guardar poquito todos los días le gana a guardar mucho de vez en cuando.', fondo: 'cinco-diarios' },
          { t: 'Cinco pesos diarios durante treinta días son ciento cincuenta.', fondo: 'cinco-diarios', cifra: ['150', 'al mes'] },
          { t: 'Veinte pesos una vez por semana son ochenta.', fondo: 'veinte-semanal', cifra: ['80', 'al mes'] },
          { t: 'La segunda cantidad es cuatro veces más grande, y junta casi la mitad.', fondo: 'veinte-semanal' },
          { t: 'Porque el problema de guardar cuando me acuerde es que uno se acuerda cada vez menos.', fondo: 'veinte-semanal' },
          { t: 'Una última cosa, y es la más importante.', fondo: 'cuentas-casa' },
          { t: 'El dinero de tu casa es una cantidad concreta que sale del trabajo de alguien.', fondo: 'cuentas-casa', recorte: [0.5, 0.5, 0.62] },
          { t: 'Cuando te dicen que no se puede, casi nunca es falta de cariño.', fondo: 'cuentas-casa' },
          { t: 'Cuenta tu cambio. Guarda poquito diario. Y pregunta antes de creer.', fondo: 'cuentas-casa', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 2 · Construyendo Independencia, segunda parte ──────────────────
     P2-2-6 comparar tiendas · P2-2-7 el tamaño engaña · P2-2-8 antojo en la caja
     P2-2-9 prestar a un amigo · P2-2-10 agua y luz */
  {
    id: 'p2-b2-u6',
    titulo: 'El tamaño engaña',
    imagenes: {
      'mismo-cuaderno': 'Two identical school notebooks displayed in two different small Mexican shops, shown side by side in one composition, small blank price cards under each',
      'comparar-bien': 'A seven year old Mexican girl holding two identical packages of the same product, one in each hand, comparing them carefully at eye level in a shop aisle',
      'cajas-distintas': 'Two cereal boxes of very different heights standing side by side on a shop shelf, the tall one narrow and the short one wide, plain even light',
      'letra-pequena': 'Extreme close up of the bottom corner of a food package where the quantity is printed, a childs finger pointing at it, shallow depth of field',
      'caja-dulces': 'The checkout lane of a Mexican supermarket seen from a childs low viewpoint, colourful sweets and small toys arranged at exactly child height beside the till',
      'espera-en-fila': 'A tired family waiting in the checkout queue with a full trolley, the child staring at the sweets rack, end of a long shopping trip',
      'plan-antes': 'A mother and child in the shop entrance agreeing on something before starting, the child nodding, shopping list in hand',
      'prestar-amigo': 'One seven year old handing a coin to a classmate in a school corridor, both smiling, natural daylight',
      'vale-papelito': 'A small handwritten note on a torn piece of paper on a school desk with two childrens signatures at the bottom, pencil beside it, top down view',
      'recordar-amable': 'The same two classmates talking calmly at break time, one gesturing openly, no tension between them, schoolyard',
      'regadera-larga': 'Steam filling a small Mexican bathroom with the shower running and nobody inside, the door half open, slightly wasteful atmosphere',
      'recibo-luz': 'A Mexican mother and child looking together at an electricity bill on the kitchen table, the child pointing at a number on the paper',
    },
    laminas: [
      'mismo-cuaderno', 'comparar-bien', 'cajas-distintas', 'letra-pequena', 'caja-dulces',
      'espera-en-fila', 'plan-antes', 'prestar-amigo', 'vale-papelito', 'recordar-amable',
      'regadera-larga', 'recibo-luz',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'mismo-cuaderno',
        tomas: [
          'El mismo cuaderno, en dos tiendas de la misma calle.',
          { t: 'En una cuesta veinticinco. En la otra, dieciocho.', cifra: ['7', 'de diferencia'] },
          'Es exactamente el mismo cuaderno.',
          { t: 'Un producto no trae su precio pegado de fábrica. Lo decide quien vende.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'comparar-bien',
        tomas: [
          'Para comparar de verdad hay una condición.',
          { t: 'Que sea el mismo producto. Misma marca, mismo tamaño, misma cantidad.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Si un paquete trae quinientos gramos y el otro cuatrocientos, no se pueden comparar así nomás.' },
          { t: 'Y siete pesos parecen poco, pero se acumulan.', fondo: 'mismo-cuaderno' },
          { t: 'Cuarenta pesos por compra, cada semana, son casi dos mil al año.', fondo: 'mismo-cuaderno', cifra: ['2000', 'al año'], respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'cajas-distintas',
        tomas: [
          'Ahora el engaño más común de todos.',
          { t: 'Una caja alta y una caja bajita.', recorte: [0.5, 0.5, 0.7] },
          'Tu ojo dice que la alta trae más.',
          { t: 'Pero tú pagas lo de adentro, no la caja.', rotulo: 'Cantidad real' },
          { t: 'La cantidad está escrita en algún lado, en letra chiquita.', fondo: 'letra-pequena' },
          { t: 'Gramos, mililitros o número de piezas. Ese número es el que importa.', fondo: 'letra-pequena', recorte: [0.5, 0.5, 0.55] },
          { t: 'Dos cajas de distinto tamaño pueden traer exactamente lo mismo.', fondo: 'cajas-distintas', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'caja-dulces',
        tomas: [
          'Y llegas a la caja.',
          { t: 'Ese lugar no es casualidad.', recorte: [0.5, 0.55, 0.6] },
          { t: 'Ahí estás detenido, esperando, sin nada que hacer y con la cartera en la mano.', fondo: 'espera-en-fila' },
          { t: 'Los dulces están a la altura de tu mano. Tampoco es casualidad.', fondo: 'caja-dulces' },
          { t: 'Y hay algo raro que hace tu cabeza.', fondo: 'caja-dulces' },
          { t: 'Para algo de quinientos pesos haces cuentas. Para algo de doce no haces ninguna.', fondo: 'caja-dulces', cifra: ['12', 'sin pensar'] },
          { t: 'Doce pesos cada vez, muchas veces, sí se sienten al final del mes.', fondo: 'caja-dulces' },
          { t: 'Aguantarse con pura fuerza de voluntad funciona a veces. La voluntad se cansa.', fondo: 'plan-antes' },
          { t: 'Lo que sí funciona siempre es decidir en la entrada, antes de empezar.', fondo: 'plan-antes', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'prestar-amigo',
        tomas: [
          'Falta el dinero que sale sin que lo compres.',
          { t: 'Prestar sin fecha es regalar sin decirlo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Tu amigo no es malo. Simplemente no tiene una fecha en la cabeza.' },
          { t: 'Un vale tiene tres datos y cabe en un papelito.', fondo: 'vale-papelito' },
          { t: 'Cuánto, para cuándo, y el nombre de los dos.', fondo: 'vale-papelito', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y si llega el día y no te pagan, recordarlo no es pelear.', fondo: 'recordar-amable' },
          { t: 'Pero la regla más importante es otra. Nunca prestes lo que no puedes perder.', fondo: 'recordar-amable' },
          { t: 'Y queda un ahorro que no se ve.', fondo: 'regadera-larga' },
          { t: 'El agua y la luz se pagan. Salen del mismo bolsillo que todo lo demás.', fondo: 'recibo-luz' },
          { t: 'Lo que calienta y lo que enfría es lo que más gasta.', fondo: 'recibo-luz', recorte: [0.5, 0.5, 0.6] },
          { t: 'Tu parte es lo que tú haces. Tus tiempos de regadera, las luces de tu cuarto.', fondo: 'regadera-larga' },
          { t: 'No te toca vigilar a los demás.', fondo: 'regadera-larga' },
          { t: 'Compara antes. Mira la cantidad, no la caja. Y decide en la entrada.', fondo: 'recibo-luz', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 3 · Planificación y Crecimiento, segunda parte ─────────────────
     P2-3-6 registrar la semana · P2-3-7 sobró dinero · P2-3-8 faltó dinero
     P2-3-9 regreso a clases · P2-3-10 fondo de imprevistos */
  {
    id: 'p2-b3-u6',
    titulo: 'Lo que no se anota, no se ve',
    imagenes: {
      'bolsillo-vacio': 'A seven year old Mexican boy turning his empty trouser pocket inside out at the end of the week, puzzled expression, bedroom light',
      'dos-columnas': 'A simple hand ruled notebook page with two columns of short entries and a total at the bottom, a pencil resting on it, top down view on a desk',
      'anotar-mismo-dia': 'A child sitting on their bed writing in a small notebook right after coming home, backpack still on the floor, afternoon light',
      'gasto-chico': 'A long row of small identical snack items lined up on a table representing a repeated daily purchase, plain background, top down view',
      'sobrante': 'A few coins left alone on a table on a Sunday evening, warm lamp light, calm and quiet composition',
      'tres-frascos': 'Three glass jars of the same size lined up on a shelf, one nearly full, one half full and one almost empty, labels blank',
      'regla-escrita': 'A small handwritten rule taped to the wall above the jars, blank paper with a childs pencil line, close up',
      'cuenta-no-cuadra': 'A childs notebook page where the total of the expenses column is clearly larger than the income column, a worried child looking at it',
      'tres-niveles': 'A staircase of three steps drawn on paper with objects placed on each step, food on the lowest, clothes in the middle, a toy on top, illustrative flat scene',
      'lista-utiles': 'A back to school shopping list beside a pile of last years still usable school supplies on a kitchen table, morning light',
      'comprar-con-tiempo': 'A Mexican mother and child buying school supplies in a calm empty stationery shop weeks before term, relaxed atmosphere',
      'frasco-imprevistos': 'A single glass jar labelled with a blank tag sitting apart from the others on a high shelf, a small amount of coins inside, quiet light',
    },
    laminas: [
      'bolsillo-vacio', 'dos-columnas', 'anotar-mismo-dia', 'gasto-chico', 'sobrante',
      'tres-frascos', 'regla-escrita', 'cuenta-no-cuadra', 'tres-niveles', 'lista-utiles',
      'comprar-con-tiempo', 'frasco-imprevistos',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'bolsillo-vacio',
        tomas: [
          'Es viernes y no queda nada.',
          { t: 'Y lo peor es que no sabes en qué se fue.', recorte: [0.5, 0.5, 0.6] },
          'Cinco pesos aquí, ocho allá.',
          { t: 'El dinero pequeño se va sin hacer ruido.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'dos-columnas',
        tomas: [
          'Un registro arregla eso, y son dos columnas.',
          { t: 'En una, lo que entra. En la otra, lo que sale.', recorte: [0.5, 0.5, 0.65] },
          { t: 'Al final restas y ese es tu saldo.', rotulo: 'Saldo' },
          { t: 'Pero tiene una regla, y es la que decide si sirve o no.', fondo: 'anotar-mismo-dia' },
          { t: 'Anotar el mismo día. Si lo dejas para el domingo, olvidas la mitad.', fondo: 'anotar-mismo-dia', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'gasto-chico',
        tomas: [
          'La primera vez que alguien registra, siempre descubre lo mismo.',
          { t: 'Que un gasto chiquito repetido pesa más que una compra grande.', recorte: [0.5, 0.5, 0.7] },
          { t: 'Diez pesos diarios en la escuela son cincuenta a la semana.', cifra: ['200', 'al mes'] },
          { t: 'Y doscientos al mes.' },
          { t: 'Nadie decidió gastar doscientos pesos. Simplemente pasó.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'sobrante',
        tomas: [
          'Ahora, dos situaciones que se repiten toda la vida.',
          { t: 'La primera: sobró dinero.', recorte: [0.5, 0.55, 0.6] },
          { t: 'Y el dinero sin destino se gasta solo. Cualquier antojo lo encuentra.' },
          { t: 'Tiene tres destinos posibles.', fondo: 'tres-frascos' },
          { t: 'Tu meta, el frasco de imprevistos, o un gusto.', fondo: 'tres-frascos', recorte: [0.5, 0.55, 0.8] },
          { t: 'Y si sobró poquito, no lo repartas: manda todo a un solo lugar.', fondo: 'tres-frascos' },
          { t: 'Lo que de verdad funciona es tener la regla escrita antes.', fondo: 'regla-escrita' },
          { t: 'Todo lo que sobre va a mi meta. Ya está decidido, no hay que decidir cada domingo.', fondo: 'regla-escrita', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cuenta-no-cuadra',
        tomas: [
          'La segunda situación: faltó.',
          { t: 'Tienes ciento cincuenta y tus gastos suman ciento noventa.', cifra: ['40', 'faltan'] },
          { t: 'No hay forma de pagar todo, y pagar hasta que se acabe no es un plan.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Los gastos tienen tres niveles.', fondo: 'tres-niveles' },
          { t: 'Lo indispensable, lo importante ajustable, y lo que se puede posponer.', fondo: 'tres-niveles', recorte: [0.5, 0.55, 0.8] },
          { t: 'Y se recorta desde abajo. Primero lo posponible.', fondo: 'tres-niveles' },
          { t: 'Hay gastos que ni siquiera son sorpresa.', fondo: 'lista-utiles' },
          { t: 'El regreso a clases está anunciado desde hace meses.', fondo: 'lista-utiles', recorte: [0.5, 0.5, 0.6] },
          { t: 'Seiscientos pesos entre veinte semanas son treinta por semana.', fondo: 'comprar-con-tiempo', cifra: ['30', 'por semana'] },
          { t: 'Y comprar con tiempo casi siempre sale más barato que comprar el día antes.', fondo: 'comprar-con-tiempo' },
          { t: 'Guarda también un frasco aparte para los sustos.', fondo: 'frasco-imprevistos' },
          { t: 'No te hace rico. Protege tu meta, para que el susto no te baje ni una casilla.', fondo: 'frasco-imprevistos' },
          { t: 'Anota el mismo día. Escribe tu regla. Y recorta desde abajo.', fondo: 'frasco-imprevistos', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 4 · ¡Es Hora de Emprender!, segunda parte ──────────────────────
     P2-4-6 buscar una necesidad · P2-4-7 poner precio · P2-4-8 el cartel
     P2-4-9 clientes contentos · P2-4-10 repartir la ganancia */
  {
    id: 'p2-b4-u6',
    titulo: 'Primero el problema',
    imagenes: {
      'salon-molestia': 'A primary school classroom where a child stops working because their pencil tip has broken, a small everyday annoyance, other children working around them',
      'lista-problemas': 'A child sitting at a school desk writing a long list of short observations in a notebook, watching the classroom around them, natural daylight',
      'dos-preguntas': 'A child holding up two fingers thoughtfully in front of their list, deciding, classroom background softly blurred',
      'costo-por-pieza': 'A tray of finished handmade school products on a table beside the raw materials that made them, everything laid out clearly, top down view',
      'precio-corazonada': 'A child putting a blank price card next to a product with an uncertain shrug, guessing, school stall',
      'precio-calculado': 'The same child now writing on a small card after doing sums on a notebook beside it, confident, the notebook shows tally marks',
      'cartel-malo': 'A school stall with a cluttered handmade sign covered in tiny drawings and no clear message, children walking past without stopping',
      'cartel-bueno': 'A school stall with a clean simple handmade sign, one big blank headline area, one clear blank price area, children stopping to look',
      'cliente-vuelve': 'The same classmate coming back to the same school stall for the second day in a row, greeted by the young seller with a smile',
      'error-reparado': 'A young seller handing back a coin to a classmate with an apologetic honest gesture, correcting a mistake immediately, school stall',
      'tres-frascos-negocio': 'Three small jars behind a school stall, one beside fresh materials, one closed and set apart, one with a small treat next to it',
      'crecer-con-tiempo': 'Three school stalls of increasing size shown in one composition left to right, the same child selling at each, visual growth over time',
    },
    laminas: [
      'salon-molestia', 'lista-problemas', 'dos-preguntas', 'costo-por-pieza', 'precio-corazonada',
      'precio-calculado', 'cartel-malo', 'cartel-bueno', 'cliente-vuelve', 'error-reparado',
      'tres-frascos-negocio', 'crecer-con-tiempo',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'salon-molestia',
        tomas: [
          'Se te rompe la punta del lápiz.',
          { t: 'Pierdes cinco minutos buscando el sacapuntas.', recorte: [0.45, 0.5, 0.55] },
          'Le pasa a medio salón, todos los días.',
          { t: 'Eso no es una molestia. Es un negocio esperando.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'lista-problemas',
        tomas: [
          'Los negocios que funcionan no empiezan con una idea.',
          { t: 'Empiezan mirando qué le falta a la gente.', rotulo: 'Primero el problema' },
          { t: 'Y los problemas se esconden en las molestias pequeñas que se repiten.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Anótalo todo, sin descartar mientras escribes.' },
          { t: 'Si empiezas a tachar ideas al vuelo, te quedas con muy pocas.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'dos-preguntas',
        tomas: [
          'Después filtras con dos preguntas.',
          { t: 'A cuánta gente le pasa. Si solo te pasa a ti, no hay clientes.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y qué tan molesto es. Si es apenas nada, nadie va a pagar por resolverlo.' },
          { t: 'Con esas dos preguntas, una lista larga se vuelve una lista útil.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'precio-corazonada',
        tomas: [
          'Ahora el precio, que casi todos ponen adivinando.',
          { t: 'Creo que diez pesos está bien.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Si producir cada pieza costó doce, cada venta pierde dos.', cifra: ['-2', 'por venta'] },
          { t: 'Y mientras más vendas, peor te va.' },
          { t: 'El precio se calcula.', fondo: 'costo-por-pieza' },
          { t: 'Divides el costo total entre las piezas que salieron. Ese es el costo por pieza.', fondo: 'costo-por-pieza', rotulo: 'Costo por pieza' },
          { t: 'Y al costo por pieza le sumas lo que quieres ganar.', fondo: 'precio-calculado' },
          { t: 'Tres de costo más dos de ganancia son cinco de precio.', fondo: 'precio-calculado', cifra: ['5', 'de precio'] },
          { t: 'Esa ganancia no es un abuso. Es el pago por tu tiempo.', fondo: 'precio-calculado', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cartel-malo',
        tomas: [
          'Nadie se detiene a estudiar un cartel.',
          { t: 'La gente camina, mira de reojo y decide en un instante.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Un cartel útil tiene tres cosas, en este orden.', fondo: 'cartel-bueno' },
          { t: 'Qué vendes, con la letra más grande. Cuánto cuesta, bien visible. Y por qué conviene.', fondo: 'cartel-bueno', recorte: [0.5, 0.45, 0.65] },
          { t: 'La decoración va al final, no al principio.', fondo: 'cartel-bueno' },
          { t: 'Y hay algo que vale más que un buen cartel.', fondo: 'cliente-vuelve' },
          { t: 'Un cliente que vuelve cada día vale muchísimo más que uno que llega una vez.', fondo: 'cliente-vuelve' },
          { t: 'Prometer hace que compren la primera vez. Cumplir hace que compren otra.', fondo: 'cliente-vuelve' },
          { t: 'Y todos cometemos errores. Lo que decide no es el error, es lo que haces después.', fondo: 'error-reparado' },
          { t: 'Al final, la ganancia se reparte en tres.', fondo: 'tres-frascos-negocio' },
          { t: 'Crecer, guardar y disfrutar.', fondo: 'tres-frascos-negocio', recorte: [0.5, 0.55, 0.8] },
          { t: 'Si no reinviertes, produces siempre lo mismo por más que trabajes.', fondo: 'crecer-con-tiempo' },
          { t: 'Busca la molestia. Calcula tu precio. Y reparte tu ganancia en tres.', fondo: 'crecer-con-tiempo', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── RETO SUPREMO · Supermercado en Caos ───────────────────────────────────
     Ciento cincuenta pesos y noventa segundos, antes de que suban los precios. */
  {
    id: 'p2-supremo',
    titulo: 'Supermercado en Caos',
    imagenes: {
      'reloj-corriendo': 'A large wall clock inside a busy Mexican supermarket with its hands blurred in motion, shoppers rushing past below, dynamic and urgent',
      'lista-en-mano': 'A seven year old Mexican child gripping a short shopping list tightly in one hand at the entrance of a supermarket aisle, determined',
      'precios-subiendo': 'A supermarket shelf where the small blank price cards are being flipped and replaced rapidly, a slight motion blur, urgent atmosphere',
      'antojo-tentador': 'A colourful display of sweets in the middle of an aisle catching the childs eye, the child hesitating with the trolley',
      'canasta-correcta': 'A shopping basket containing only plain everyday essentials, neat and modest, held by a proud child',
      'caja-final': 'The child at the supermarket till placing the basket on the belt with coins ready in the other hand, calm and satisfied',
    },
    laminas: ['reloj-corriendo', 'lista-en-mano', 'precios-subiendo', 'antojo-tentador', 'canasta-correcta', 'caja-final'],
    bloques: [
      {
        paso: 0,
        fondo: 'reloj-corriendo',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Noventa segundos.', cifra: ['90', 'segundos'], recorte: [0.5, 0.45, 0.55] },
          { t: 'Y los precios están subiendo mientras compras.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'lista-en-mano',
        tomas: [
          'Tienes ciento cincuenta pesos.',
          { t: 'Y una lista.', cifra: ['150', 'pesos'], recorte: [0.5, 0.5, 0.55] },
          { t: 'La lista es una decisión que ya tomaste con calma.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'antojo-tentador',
        tomas: [
          'Vas a ver cosas que no están en la lista.',
          { t: 'Y con el reloj corriendo, tu cabeza va a decir que da igual.', recorte: [0.5, 0.5, 0.6] },
          { t: 'No da igual. Lo que no está en la lista se paga con algo que sí estaba.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'precios-subiendo',
        tomas: [
          'Los precios suben mientras dudas.',
          { t: 'Por eso lo indispensable va primero, no al final.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Se recorta desde abajo: lo posponible se queda en el estante.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'canasta-correcta',
        tomas: [
          'Gana quien llega a la caja con la lista completa.',
          { t: 'No quien llena más el carrito.', fondo: 'caja-final' },
          { t: 'Adentro del súper, tu lista es tu escudo. Úsala.', fondo: 'caja-final', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
