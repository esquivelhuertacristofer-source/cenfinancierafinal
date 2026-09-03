/**
 * Primaria 1 — 6 a 7 años. Cinco videos.
 *
 * REGISTRO. Frases cortas, una idea por toma, objetos que se tocan. Nada de
 * porcentajes ni de palabras abstractas: a esta edad "equivalencia" se enseña
 * poniendo diez monedas de uno al lado de una de diez, no nombrándola.
 *
 * DICCIÓN PARA XTTS (ver `scripts/narracion.py`). Sin puntos suspensivos —los lee
 * como una pausa larguísima—, sin comillas —le meten un corte antinatural— y las
 * siglas con espacios. Las cifras se escriben con palabras cuando se dicen, y con
 * dígitos sólo dentro del prompt de la ilustración.
 *
 * El contenido sale del temario real (`public/data/pedagogia/primaria/p1.json`),
 * unidades 6 a 10 de cada bloque. No hay nada inventado aquí que no esté allá.
 */

export const ARGUMENTOS = [
  /* ───────────────────────────────────────────────────────────────────────────
     BLOQUE 1 · Primeros Pasos Hacia el Ahorro, segunda parte
     P1-1-6 contar monedas · P1-1-7 cuidar el dinero · P1-1-8 dinero de sorpresa
     P1-1-9 una moneda cada día · P1-1-10 ahorrar para dar
     ─────────────────────────────────────────────────────────────────────────── */
  {
    id: 'p1-b1-u6',
    titulo: 'Ahora sí, cuenta lo que tienes',
    imagenes: {
      'monton-revuelto': 'A six year old Mexican girl sitting on a wooden floor in front of a big messy pile of mexican coins of many sizes, looking overwhelmed and confused, hands in the air, warm afternoon light from a window',
      'monton-ordenado': 'The same six year old Mexican girl smiling, the coins now sorted into four neat little towers by size on the wooden floor, her hands resting on the tallest tower, proud and calm',
      'diez-formas': 'A flat top down view of a wooden table showing four separate groups of mexican coins side by side, each group clearly a different arrangement of coins but visually equal in importance, soft even light',
      'moneda-vieja': 'Close up of two mexican coins held side by side in a childs open palm, one shiny and new and one scratched and old, both clearly the same coin',
      'bolsillo-agujero': 'A childs trouser pocket with a small hole, a coin slipping through it and falling toward the ground, seen from a low dramatic angle, warm domestic light',
      'lugar-seguro': 'A cheerful ceramic piggy bank with a lid that closes sitting on a childs bedroom shelf, tidy and well lit, a small Mexican bedroom in the background',
      'regalo-sorpresa': 'A delighted six year old Mexican boy opening a birthday envelope from his grandmother and finding money inside, family living room, warm celebration light',
      'tres-cajas': 'Three small labelled wooden boxes of the same size lined up on a table, one with a coin going in, one with a toy beside it, one open and empty, clean uncluttered composition',
      'calendario-monedas': 'A homemade paper wall calendar for one month where a small coin has been glued onto each finished day square, a childs hand adding todays coin, warm classroom light',
      'alcancia-llena': 'A transparent plastic jar half full of mexican coins on a windowsill with afternoon sun passing through it, the level of coins clearly visible',
      'regalo-comprado': 'A six year old Mexican girl handing a small wrapped gift to her mother, both smiling, the girls empty piggy bank visible on the table behind them',
      'cierre-alcancia': 'A six year old Mexican child kneeling beside a piggy bank on a rug, dropping one single coin in, calm and satisfied, end of day golden light',
    },
    laminas: [
      'monton-revuelto', 'monton-ordenado', 'diez-formas', 'moneda-vieja', 'bolsillo-agujero',
      'lugar-seguro', 'regalo-sorpresa', 'tres-cajas', 'calendario-monedas', 'alcancia-llena',
      'regalo-comprado', 'cierre-alcancia',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'monton-revuelto',
        tomas: [
          'Te dan un puño de monedas revueltas.',
          { t: 'Las cuentas una por una y te pierdes.', recorte: [0.42, 0.55, 0.55] },
          'Empiezas otra vez. Y otra vez.',
          { t: 'No es que cuentes mal. Es que estás contando en desorden.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'monton-ordenado',
        tomas: [
          'Los cajeros hacen algo distinto.',
          { t: 'Primero separan las monedas por tamaño.', recorte: [0.5, 0.6, 0.6] },
          'Hacen montoncitos.',
          { t: 'Y hasta el final suman los montoncitos.', rotulo: 'Agrupar' },
          { t: 'Ordenar primero, contar después. Ese es todo el truco.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'diez-formas',
        tomas: [
          'Ahora algo que confunde a mucha gente.',
          { t: 'Diez pesos se pueden ver de muchas maneras.', cifra: ['10', 'pesos'] },
          { t: 'Una moneda de diez. Dos de cinco. Cinco de dos.', recorte: [0.3, 0.5, 0.5] },
          { t: 'O diez monedas de un peso.', recorte: [0.72, 0.5, 0.45] },
          'Todas valen exactamente lo mismo.',
          { t: 'Si alguien te dice que tiene más monedas que tú, no quiere decir que tenga más dinero.' },
          { t: 'Lo que importa es el total, no cuántas piezas son.', respiro: 1 },
        ],
      },
      {
        paso: 3,
        fondo: 'moneda-vieja',
        tomas: [
          { t: 'Una moneda rayada y vieja vale igual que una nueva.', recorte: [0.5, 0.5, 0.7] },
          { t: 'El número de la cara es su valor, y ese no cambia nunca.' },
          { t: 'Pero el dinero sí se puede perder.', fondo: 'bolsillo-agujero' },
          { t: 'Y perder veinte pesos deja lo mismo que gastarlos en algo que ni querías.', fondo: 'bolsillo-agujero', recorte: [0.5, 0.62, 0.55] },
          { t: 'Por eso un buen lugar cumple tres cosas.', fondo: 'lugar-seguro' },
          { t: 'Se cierra. Es siempre el mismo. Y tú sabes dónde está.', fondo: 'lugar-seguro', recorte: [0.48, 0.5, 0.6] },
          { t: 'El bolsillo del pantalón falla en las tres.', fondo: 'lugar-seguro', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'regalo-sorpresa',
        tomas: [
          'A veces llega dinero de sorpresa.',
          { t: 'Un regalo, un billete de un tío que casi no ves.', recorte: [0.5, 0.45, 0.6] },
          { t: 'Y se va rapidísimo, porque tu cabeza lo trata como si fuera gratis.' },
          { t: 'Lo que hacen los buenos ahorradores es decidir antes de tenerlo.', fondo: 'tres-cajas' },
          { t: 'Una parte se guarda. Una parte empuja tu meta. Una parte es para hoy.', fondo: 'tres-cajas', recorte: [0.5, 0.55, 0.85] },
          { t: 'Y el resto es una moneda al día.', fondo: 'calendario-monedas' },
          { t: 'Dos pesos no compran nada. Dos pesos cada día son setecientos veinte al año.', fondo: 'calendario-monedas', cifra: ['720', 'al año'] },
          { t: 'No cambió el tamaño de la moneda. Cambió cuántas veces la pusiste.', fondo: 'alcancia-llena' },
          { t: 'Y cuando el dinero es tuyo, hasta regalar se siente distinto.', fondo: 'regalo-comprado' },
          { t: 'Tú guardaste, tú esperaste, tú lo compraste.', fondo: 'regalo-comprado', recorte: [0.44, 0.48, 0.6] },
          { t: 'Empieza hoy. Separa por tamaño y cuenta tus montoncitos.', fondo: 'cierre-alcancia' },
          { t: 'Vas a saber exactamente cuánto tienes.', fondo: 'cierre-alcancia', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────────────
     BLOQUE 2 · Construyendo Independencia, segunda parte
     P1-2-6 preguntar el precio · P1-2-7 la lista · P1-2-8 los anuncios
     P1-2-9 esperar tantito · P1-2-10 cuidar mis cosas
     ─────────────────────────────────────────────────────────────────────────── */
  {
    id: 'p1-b2-u6',
    titulo: 'La pregunta que te ahorra dinero',
    imagenes: {
      'antojo-vitrina': 'A six year old Mexican boy with his hands and nose pressed against a toy shop window, eyes wide with desire, colourful toys behind the glass, busy street reflection',
      'preguntar-precio': 'The same boy standing at a small Mexican shop counter looking up and asking the friendly shopkeeper a question, calm and confident, the shopkeeper leaning down to answer',
      'dos-tiendas': 'A split scene of two small neighbourhood shops on the same street seen from across the road, a child walking from one to the other comparing, sunny Mexican street',
      'lista-casa': 'A Mexican mother and her six year old daughter at the kitchen table writing a shopping list together on a small notepad, calm home evening light',
      'super-tentacion': 'The inside of a Mexican supermarket aisle from a childs low point of view, bright colourful packages stacked at exactly child height, slightly overwhelming',
      'carrito-extra': 'A shopping trolley seen from above containing the planned groceries plus two obviously extra colourful snack items sitting on top, clearly out of place',
      'ticket-revision': 'A childs hands holding a long shop receipt just outside the supermarket door, checking it line by line, mother beside her',
      'anuncio-tele': 'A six year old Mexican child sitting very close to a television showing a bright toy advert with laughing children, the room dark, the screen glow on the childs face',
      'foto-vs-real': 'Two identical toys side by side on a plain surface, one lit like a glamorous studio product photo and one lit like an ordinary object at home, same toy',
      'esperar-tres-dias': 'A childs bedroom wall calendar with three days marked in a row and a small drawing of a wished toy on the first day, morning light',
      'mochila-cuidada': 'A well kept school backpack hanging on a hook, zipped closed and tidy, next to a torn and dirty one on the floor, same model of backpack',
      'reparar-boton': 'Close up of a childs hands and a grandmothers hands sewing a button back onto a school jumper at a kitchen table, warm light',
    },
    laminas: [
      'antojo-vitrina', 'preguntar-precio', 'dos-tiendas', 'lista-casa', 'super-tentacion',
      'carrito-extra', 'ticket-revision', 'anuncio-tele', 'foto-vs-real', 'esperar-tres-dias',
      'mochila-cuidada', 'reparar-boton',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'antojo-vitrina',
        tomas: [
          'Ves algo que te gusta.',
          { t: 'Y lo primero que quieres hacer es pedirlo.', recorte: [0.45, 0.42, 0.5] },
          'Pero hay una pregunta chiquita que lo cambia todo.',
          { t: 'Cuánto cuesta.', respiro: 1 },
        ],
      },
      {
        paso: 1,
        fondo: 'preguntar-precio',
        tomas: [
          'Esa pregunta te da un segundo para pensar.',
          { t: 'Y ese segundo es lo que separa una buena decisión de un arrepentimiento.', recorte: [0.5, 0.45, 0.62] },
          'Mucha gente no pregunta por pena.',
          { t: 'Cree que si pregunta y luego no compra, va a quedar mal.' },
          { t: 'No es cierto. Preguntar es gratis y nadie tiene derecho a molestarse.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'dos-tiendas',
        tomas: [
          'Y hay un paso más.',
          { t: 'Lo mismo puede costar veinticinco pesos en una tienda y dieciocho a dos cuadras.', cifra: ['7', 'de diferencia'] },
          { t: 'Siete pesos no son poco. Son casi un tercio del precio.' },
          { t: 'Ahora vamos a la tienda grande, donde el dinero se escapa.', fondo: 'super-tentacion' },
          { t: 'Adentro todo está puesto para que compres más de lo que ibas a comprar.', fondo: 'super-tentacion', recorte: [0.5, 0.6, 0.6] },
          { t: 'Los dulces están justo a la altura de tu mano. Eso no es casualidad.', fondo: 'super-tentacion', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'lista-casa',
        tomas: [
          'Tu escudo se escribe en casa.',
          { t: 'En la mesa, tranquilo, sin olor a pan recién hecho.', recorte: [0.5, 0.5, 0.62] },
          { t: 'La lista es una decisión que ya tomaste.', rotulo: 'La lista' },
          { t: 'Lo que no está en la lista se paga con algo.', fondo: 'carrito-extra' },
          { t: 'Si tomas algo de más, quizá ya no alcance para la fruta.', fondo: 'carrito-extra', recorte: [0.55, 0.5, 0.5] },
          { t: 'Y al salir, el ticket. Treinta segundos.', fondo: 'ticket-revision' },
          { t: 'Sirve para ver si cobraron de más y para saber en qué se fue el dinero.', fondo: 'ticket-revision', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'anuncio-tele',
        tomas: [
          'Falta el enemigo más fuerte.',
          { t: 'Un anuncio no te informa. Te convence.', rotulo: 'Anuncio' },
          { t: 'Nunca te dice que el juguete se rompe a la semana.' },
          { t: 'Ni que las pilas no vienen incluidas.', recorte: [0.5, 0.55, 0.55] },
          { t: 'Y la foto pasa por luces y por computadora.', fondo: 'foto-vs-real' },
          { t: 'El que llega a tu casa es el mismo objeto, pero sin luces.', fondo: 'foto-vs-real', recorte: [0.68, 0.5, 0.5] },
          { t: 'Tu defensa no cuesta nada y se llama esperar.', fondo: 'esperar-tres-dias' },
          { t: 'Lo anotas y esperas tres días.', fondo: 'esperar-tres-dias', cifra: ['3', 'días'] },
          { t: 'Si a los tres días lo sigues queriendo igual, era tuyo de verdad.', fondo: 'esperar-tres-dias' },
          { t: 'Casi siempre las ganas se van solas, y ese dinero se queda contigo.', fondo: 'esperar-tres-dias' },
          { t: 'Y hay una última forma de ahorrar que no necesita ni una moneda.', fondo: 'mochila-cuidada' },
          { t: 'Cuidar lo que ya tienes. Si tu mochila dura tres años en vez de uno, es una compra que nadie repite.', fondo: 'mochila-cuidada', recorte: [0.4, 0.5, 0.6] },
          { t: 'Un botón cosido cuesta unos minutos. Un suéter nuevo cuesta mucho más.', fondo: 'reparar-boton' },
          { t: 'Pregunta el precio. Haz tu lista. Espera tres días. Cuida lo tuyo.', fondo: 'reparar-boton', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────────────
     BLOQUE 3 · Planificación y Crecimiento, segunda parte
     P1-3-6 termómetro · P1-3-7 cuánto falta · P1-3-8 subió de precio
     P1-3-9 sacar del ahorro · P1-3-10 dos metas
     ─────────────────────────────────────────────────────────────────────────── */
  {
    id: 'p1-b3-u6',
    titulo: 'Ver lo que llevas',
    imagenes: {
      'alcancia-cerrada': 'An opaque ceramic piggy bank sitting alone on a shelf, a six year old Mexican child shaking it gently next to their ear, uncertain expression, plain bedroom',
      'termometro-vacio': 'A large hand drawn paper thermometer taped to a bedroom wall, ten empty squares stacked vertically, a child holding a red crayon looking at it',
      'termometro-medio': 'The same hand drawn paper thermometer with five of the ten squares coloured in red from the bottom, the child stepping back to look at it with a big smile',
      'balon-meta': 'A football sitting on a shop shelf under a small blank price card, seen from a childs eye level, warm shop light',
      'contar-adelante': 'A childs hands moving small coin stacks along a number line drawn on paper, counting forward, top down view on a wooden table',
      'calendario-semanas': 'A month wall calendar where three consecutive weeks have been circled with a red crayon, a childs finger pointing at the last circled week',
      'precio-subio': 'A shop shelf where a small blank price card has been replaced with a new one, the old card lying on the shelf beside it, a child looking up puzzled',
      'ahorro-intacto': 'A transparent jar of coins on a table, completely unchanged and full, warm side light, calm composition',
      'sacar-monedas': 'A childs hand pulling a few coins out of a transparent savings jar, the level inside visibly lower than before, slightly guilty body language',
      'dos-metas': 'Two wished for objects side by side on a childs bed, a football and a board game, the child sitting between them unable to decide',
      'una-meta-primero': 'The same child holding only the football and smiling, the board game placed neatly aside on a shelf for later',
      'cierre-termometro': 'A child colouring the final square of the paper thermometer on the wall while the football sits on the floor beside them, celebration light',
    },
    laminas: [
      'alcancia-cerrada', 'termometro-vacio', 'termometro-medio', 'balon-meta', 'contar-adelante',
      'calendario-semanas', 'precio-subio', 'ahorro-intacto', 'sacar-monedas', 'dos-metas',
      'una-meta-primero', 'cierre-termometro',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'alcancia-cerrada',
        tomas: [
          'Llevas un mes guardando monedas.',
          { t: 'Sabes que hay dinero adentro, pero no cuánto.', recorte: [0.5, 0.45, 0.55] },
          'Y eso desanima.',
          { t: 'Lo que no se ve se siente como nada.', respiro: 1 },
        ],
      },
      {
        paso: 1,
        fondo: 'termometro-vacio',
        tomas: [
          'Un termómetro de ahorro arregla eso.',
          { t: 'Dibujas un tubo con diez casillas.', recorte: [0.5, 0.5, 0.6], rotulo: 'Termometro' },
          { t: 'Abajo pones cero y arriba el precio de tu meta.' },
          { t: 'Si tu meta cuesta cien pesos, cada casilla vale diez.', cifra: ['10', 'por casilla'] },
          { t: 'Y cada vez que ahorras, pintas.', fondo: 'termometro-medio', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'termometro-medio',
        tomas: [
          'Aquí pasa algo curioso.',
          { t: 'Mientras más cerca ves la meta, más ganas dan de terminarla.', recorte: [0.5, 0.45, 0.6] },
          { t: 'Cuando el termómetro va por la mitad, mucha gente acelera sola.' },
          { t: 'La única regla es no hacer trampa.' },
          { t: 'Si pintas casillas que no ahorraste, el dibujo se ve bonito y deja de servirte.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'balon-meta',
        tomas: [
          'Ahora la pregunta que lo conecta todo.',
          { t: 'Cuánto me falta.', rotulo: 'Cuanto falta' },
          { t: 'El balón cuesta ciento ochenta y tú tienes ciento veinte.', cifra: ['60', 'faltan'] },
          { t: 'Ciento ochenta menos ciento veinte son sesenta.', recorte: [0.5, 0.55, 0.55] },
          { t: 'Y si la resta te cuesta, cuenta hacia adelante.', fondo: 'contar-adelante' },
          { t: 'Desde ciento veinte, de diez en diez, hasta ciento ochenta. Son seis brincos.', fondo: 'contar-adelante', recorte: [0.5, 0.55, 0.7] },
          { t: 'Pero saber que faltan sesenta pesos está bien. Saber que faltan tres semanas está mejor.', fondo: 'calendario-semanas' },
          { t: 'Porque las semanas se ven en el calendario.', fondo: 'calendario-semanas', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'precio-subio',
        tomas: [
          'A veces el precio sube y tú no hiciste nada mal.',
          { t: 'Los precios suben. Así funciona.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pero revisa los números. Si tenías ciento cincuenta, sigues teniendo ciento cincuenta.', fondo: 'ahorro-intacto' },
          { t: 'No perdiste ni un peso. Lo que cambió es la distancia.', fondo: 'ahorro-intacto' },
          { t: 'Lo que sí te aleja de verdad es sacar.', fondo: 'sacar-monedas' },
          { t: 'Y sacar no cuesta pesos. Cuesta semanas.', fondo: 'sacar-monedas', recorte: [0.5, 0.55, 0.55] },
          { t: 'Todo el mundo dice que lo repone después. Casi nadie lo hace.', fondo: 'sacar-monedas' },
          { t: 'Prueba a llamarlo distinto. En vez de tengo ciento veinte, di tengo la mitad de mi balón.', fondo: 'ahorro-intacto' },
          { t: 'Y si quieres dos cosas a la vez, no repartas.', fondo: 'dos-metas' },
          { t: 'Repartir hace que las dos tarden el doble.', fondo: 'dos-metas', recorte: [0.5, 0.55, 0.62] },
          { t: 'Si una tiene fecha, esa va primero. Si ninguna tiene, empieza por la más barata.', fondo: 'una-meta-primero' },
          { t: 'La terminas pronto, y esa victoria te da ganas de seguir.', fondo: 'una-meta-primero' },
          { t: 'Dibuja tu termómetro hoy y píntalo sólo con lo que de verdad ahorraste.', fondo: 'cierre-termometro' },
          { t: 'Vas a ver que sí avanzabas.', fondo: 'cierre-termometro', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────────────
     BLOQUE 4 · ¡Es Hora de Emprender!, segunda parte
     P1-4-6 preguntar antes · P1-4-7 los materiales cuestan · P1-4-8 mi puesto
     P1-4-9 repartir el trabajo · P1-4-10 volver a invertir
     ─────────────────────────────────────────────────────────────────────────── */
  {
    id: 'p1-b4-u6',
    titulo: 'Antes de vender, pregunta',
    imagenes: {
      'galletas-sin-vender': 'A small school stall table with a large tray of untouched coconut cookies and a disappointed six year old Mexican boy sitting behind it, empty schoolyard',
      'preguntar-companeros': 'The same boy walking around his primary school classroom asking classmates a question and marking answers on a paper, children pointing at choices, bright classroom',
      'contar-votos': 'A simple paper tally chart on a school desk with marks counted into groups, a childs hand adding the last mark, top down view',
      'materiales-mesa': 'A kitchen table laid out with lemons, a bag of sugar, a stack of plastic cups, a roll of ribbon and small paper labels, everything visible and separate',
      'olvidar-pequeno': 'Close up of small forgotten items at the edge of a kitchen table, ribbon, labels and little bags, slightly in shadow while big items are lit',
      'cuenta-ganancia': 'A childs hands separating a pile of coins on a table into two clearly different groups, one small and one larger, plain top down view',
      'puesto-desordenado': 'A messy school stall with jars and cups scattered, no sign, children walking past it without stopping, schoolyard',
      'puesto-ordenado': 'The same school stall now tidy, jars in a row, a clean handwritten blank sign board standing upright, a small queue of children waiting',
      'invitar-bien': 'A six year old Mexican girl behind the stall smiling and greeting a classmate with an open friendly gesture, not grabbing, other children nearby',
      'cuatro-trabajos': 'Four children of about six working together at different tasks around one stall, one carrying supplies, one preparing, one serving, one holding a notebook',
      'acuerdo-antes': 'Four childrens hands together over a sheet of paper on a table before starting, agreeing, morning light',
      'reinvertir': 'A childs hands dividing a small pile of coins into two piles on a table, the larger pile next to a bag of fresh lemons ready to buy more',
    },
    laminas: [
      'galletas-sin-vender', 'preguntar-companeros', 'contar-votos', 'materiales-mesa', 'olvidar-pequeno',
      'cuenta-ganancia', 'puesto-desordenado', 'puesto-ordenado', 'invitar-bien', 'cuatro-trabajos',
      'acuerdo-antes', 'reinvertir',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'galletas-sin-vender',
        tomas: [
          'Hiciste treinta galletas de coco.',
          { t: 'Porque a ti te encanta el coco.', recorte: [0.45, 0.5, 0.55] },
          'Y no vendiste casi ninguna.',
          { t: 'El problema no fueron las galletas. Tú no eres tu cliente.', respiro: 1 },
        ],
      },
      {
        paso: 1,
        fondo: 'preguntar-companeros',
        tomas: [
          'Todos los negocios serios hacen algo antes de producir.',
          { t: 'Preguntan.', rotulo: 'Preguntar' },
          { t: 'Pero preguntar bien tiene una regla.', recorte: [0.5, 0.45, 0.6] },
          { t: 'No sugieras la respuesta.' },
          { t: 'Si dices verdad que te gustan más las de chocolate, te van a decir que sí por educación.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'contar-votos',
        tomas: [
          'Y a una sola persona no le preguntes.',
          { t: 'Puede ser la única a la que le gusta eso.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pregunta a diez y cuenta.', cifra: ['7', 'de 10'] },
          { t: 'Si siete eligen lo mismo, eso ya es un dato.' },
          { t: 'Preguntar antes no cuesta ni un peso. Treinta galletas que nadie quiere, sí.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'materiales-mesa',
        tomas: [
          'Ahora las cuentas.',
          { t: 'Vendiste cien pesos de limonada. Eso no es lo que ganaste.', cifra: ['100', 'vendido'] },
          { t: 'Los limones costaron. El azúcar costó. Los vasos costaron.', recorte: [0.5, 0.55, 0.7] },
          { t: 'Y es facilísimo acordarse de lo grande y olvidar lo chiquito.', fondo: 'olvidar-pequeno' },
          { t: 'Las bolsitas, el listón, las etiquetas. Esos pesos también salieron.', fondo: 'olvidar-pequeno', recorte: [0.5, 0.55, 0.6] },
          { t: 'La cuenta tiene dos pasos.', fondo: 'cuenta-ganancia' },
          { t: 'Sumas todo lo que gastaste. Y a lo que vendiste le restas eso.', fondo: 'cuenta-ganancia', recorte: [0.5, 0.5, 0.65] },
          { t: 'Lo que queda es tu ganancia.', fondo: 'cuenta-ganancia', rotulo: 'Ganancia', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'puesto-desordenado',
        tomas: [
          'Puedes tener el mejor producto y no vender nada.',
          { t: 'Porque lo primero que ve la gente no es tu limonada. Es tu mesa.', recorte: [0.5, 0.55, 0.6] },
          { t: 'Y el error más común de todos los puestos escolares.', fondo: 'puesto-ordenado' },
          { t: 'No poner el precio.', fondo: 'puesto-ordenado', rotulo: 'Precio visible' },
          { t: 'Cuando el precio no se ve, hay que preguntar. Y preguntar da pena.', fondo: 'puesto-ordenado' },
          { t: 'Invitar son tres pasos. Saludas, dices qué vendes y a cuánto, y dejas decidir.', fondo: 'invitar-bien' },
          { t: 'El cuarto paso, insistir, es el que nadie debería dar.', fondo: 'invitar-bien', recorte: [0.5, 0.5, 0.6] },
          { t: 'Si trabajas con amigos, el acuerdo se hace antes.', fondo: 'cuatro-trabajos' },
          { t: 'Cuando hay dinero en la mesa, la memoria de todos cambia un poquito.', fondo: 'acuerdo-antes' },
          { t: 'Y al final, la decisión más importante.', fondo: 'reinvertir' },
          { t: 'Usar una parte de tu ganancia para producir más la próxima vez.', fondo: 'reinvertir', rotulo: 'Reinvertir' },
          { t: 'Es como el que guarda semillas en vez de comérselas todas.', fondo: 'reinvertir' },
          { t: 'Pregunta antes. Anota todo. Pon el precio. Y guarda una parte.', fondo: 'reinvertir', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────────────
     RETO SUPREMO · El Cochinito Vivo
     Diez pesos diarios durante treinta días hasta trescientos.
     ─────────────────────────────────────────────────────────────────────────── */
  {
    id: 'p1-supremo',
    titulo: 'El Cochinito Vivo',
    imagenes: {
      'cochinito-hambriento': 'A friendly cartoon style ceramic piggy bank with big expressive eyes sitting on a bedroom floor looking hungry and hopeful at a six year old Mexican child',
      'moneda-diaria': 'A childs hand dropping a single ten peso coin into the slot of the piggy bank, close up, warm morning light',
      'treinta-dias': 'A homemade paper calendar of thirty day squares on a bedroom wall, most squares already ticked with a crayon, a child reaching to tick another',
      'dia-fallado': 'The same calendar with one empty square among the ticked ones, a child looking at it thoughtfully, not sad, morning light',
      'cochinito-feliz': 'The same cartoon piggy bank now visibly full and beaming with joy, sitting on the bedroom floor surrounded by a happy six year old child',
      'meta-trescientos': 'A transparent jar completely full of ten peso coins on a table with afternoon sunlight behind it, celebratory and warm',
    },
    laminas: ['cochinito-hambriento', 'moneda-diaria', 'treinta-dias', 'dia-fallado', 'cochinito-feliz', 'meta-trescientos'],
    bloques: [
      {
        paso: 0,
        fondo: 'cochinito-hambriento',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Tu cochinito está vivo, y tiene hambre.', recorte: [0.48, 0.5, 0.6] },
          { t: 'Come una moneda al día.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'moneda-diaria',
        tomas: [
          'Diez pesos, todos los días.',
          { t: 'Sin fallar.', cifra: ['10', 'al día'], recorte: [0.5, 0.5, 0.6] },
          { t: 'Durante treinta días.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'dia-fallado',
        tomas: [
          'Va a haber un día en que se te olvide.',
          { t: 'Ese día tu cochinito no come, y eso se nota al final.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pero fallar un día no arruina el mes. Lo que lo arruina es dejar de intentar.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'treinta-dias',
        tomas: [
          'Marca cada día en tu calendario.',
          { t: 'Diez pesos por treinta días son trescientos.', cifra: ['300', 'la meta'] },
          { t: 'No cambió el tamaño de la moneda. Cambió cuántas veces la pusiste.', recorte: [0.5, 0.5, 0.65], respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cochinito-feliz',
        tomas: [
          'Al día treinta tu cochinito está lleno.',
          { t: 'Y tú acabas de comprobar algo que mucha gente grande todavía no cree.', fondo: 'meta-trescientos' },
          { t: 'Que lo pequeño, repetido, se vuelve grande.', fondo: 'meta-trescientos', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
