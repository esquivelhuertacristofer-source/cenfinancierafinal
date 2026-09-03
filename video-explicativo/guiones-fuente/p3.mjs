/**
 * Primaria 3 — 8 a 9 años. Cinco videos.
 *
 * REGISTRO. Es el primer grado que aguanta un número de cuatro cifras y una tabla
 * de tres renglones. También es el primero con subtítulos encendidos: a los ocho
 * años ya lee de corrido y el video se ve en un salón de treinta.
 *
 * Contenido de `public/data/pedagogia/primaria/p3.json`, unidades 6 a 10.
 * Diccion para XTTS: sin puntos suspensivos, sin comillas, siglas separadas
 * (I P A B se narra deletreado en el texto).
 */

export const ARGUMENTOS = [
  /* ── BLOQUE 1 · Mi Primer Presupuesto, segunda parte ───────────────────────
     P3-1-6 metas SMART · P3-1-7 el semaforo del gasto · P3-1-8 gastos hormiga
     P3-1-9 ingreso extraordinario · P3-1-10 el presupuesto mensual completo */
  {
    id: 'p3-b1-u6',
    titulo: 'Quiero ahorrar no es una meta',
    imagenes: {
      'deseo-vago': 'A nine year old Mexican boy daydreaming at his desk with a vague dreamy expression, a blurry imagined bicycle floating above him, bedroom afternoon light',
      'meta-escrita': 'A handwritten note pinned above a study desk with a childs pencil writing on it, a small drawing of a bicycle beside it, neat and deliberate',
      'calendario-fecha': 'A wall calendar with one day circled in red marker and a childs finger touching it, other days crossed off, bedroom wall',
      'cuota-semanal': 'Twenty five small coin stacks arranged in a neat grid on a table, one stack per week, top down view, even light',
      'semaforo-gasto': 'A large friendly traffic light standing in a Mexican street with three glowing lights, a nine year old child looking up at it thoughtfully',
      'verde-obligatorio': 'A school bus fare, a lunch torta and a school notebook arranged together on a green surface, plain flat lay, unavoidable everyday items',
      'amarillo-ajustable': 'School supplies and a small wrapped gift arranged together on a yellow surface, plain flat lay, adjustable purchases',
      'rojo-impulso': 'Sweets, a small plastic toy and a fizzy drink arranged together on a red surface, plain flat lay, impulse purchases',
      'hormigas-fila': 'A long line of ants carrying tiny coins across a kitchen counter toward a hole, stylized and slightly humorous, warm light',
      'jugo-diario': 'A single small juice carton on a school desk, and behind it a long receding row of identical cartons stretching into the distance, perspective composition',
      'sobre-sorpresa': 'A nine year old Mexican girl opening an envelope with money inside, surprised and delighted, family living room',
      'tres-partes': 'A stack of banknotes divided into three uneven piles on a table, the largest on the left, top down view, clear separation between piles',
    },
    laminas: [
      'deseo-vago', 'meta-escrita', 'calendario-fecha', 'cuota-semanal', 'semaforo-gasto',
      'verde-obligatorio', 'amarillo-ajustable', 'rojo-impulso', 'hormigas-fila', 'jugo-diario',
      'sobre-sorpresa', 'tres-partes',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'deseo-vago',
        tomas: [
          'Quiero ahorrar.',
          { t: 'Suena bien, pero no es una meta.', recorte: [0.5, 0.5, 0.6] },
          'No dice qué, ni cuánto, ni cuándo.',
          { t: 'Y algo que no se puede verificar tampoco se puede cumplir.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'meta-escrita',
        tomas: [
          'Una meta de verdad responde cuatro preguntas.',
          { t: 'Qué quiero exactamente, con nombre. No algo para la escuela, sino una mochila azul.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Cuánto cuesta. Investigado, no supuesto.' },
          { t: 'Para cuándo lo quiero. Una fecha en el calendario.', fondo: 'calendario-fecha' },
          { t: 'Y cuánto tengo que guardar cada semana para llegar.', fondo: 'cuota-semanal' },
          { t: 'Mil quinientos pesos entre veinticinco semanas son sesenta a la semana.', fondo: 'cuota-semanal', cifra: ['60', 'por semana'] },
          { t: 'Y esa cuota te dice la verdad: si recibes sesenta, tendrías que guardar todo. Es posible, pero apretado.', fondo: 'cuota-semanal', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'semaforo-gasto',
        tomas: [
          'Ahora, tus gastos no son todos iguales.',
          { t: 'Sepáralos en tres colores.', recorte: [0.5, 0.45, 0.55] },
          { t: 'Verde: los que sí o sí. El pasaje, la comida, una cooperación obligatoria.', fondo: 'verde-obligatorio', rotulo: 'Verde' },
          { t: 'No se discuten, se pagan.', fondo: 'verde-obligatorio' },
          { t: 'Amarillo: valen la pena, pero se pueden ajustar. Material escolar, un regalo.', fondo: 'amarillo-ajustable', rotulo: 'Amarillo' },
          { t: 'Rojo: los de impulso. Y hay una señal que nunca falla.', fondo: 'rojo-impulso', rotulo: 'Rojo' },
          { t: 'Un gasto rojo es el que a los tres días ya ni recuerdas.', fondo: 'rojo-impulso', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'hormigas-fila',
        tomas: [
          'Y hay gastos que no duelen porque son diminutos.',
          { t: 'Una hormiga sola no carga nada. Un ejército se lleva la despensa entera.', recorte: [0.5, 0.5, 0.65] },
          { t: 'Un jugo de quince pesos al día parece nada.', fondo: 'jugo-diario' },
          { t: 'Multiplica. Setenta y cinco a la semana. Trescientos al mes.', fondo: 'jugo-diario', cifra: ['3600', 'al año'] },
          { t: 'Tres mil seiscientos al año. Es el mismo gasto: lo único que cambió fue la escala.', fondo: 'jugo-diario' },
          { t: 'Pero ojo, no hay que eliminarlos todos.', fondo: 'jugo-diario' },
          { t: 'Si te da alegría de verdad todos los días y cabe en tu presupuesto, ese dinero está bien gastado.', fondo: 'jugo-diario' },
          { t: 'Y lo que funciona no es prohibir, es sustituir. Llevar el jugo de casa en vez de comprarlo.', fondo: 'jugo-diario', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'sobre-sorpresa',
        tomas: [
          'Un día llega dinero que no esperabas.',
          { t: 'Y se gasta rapidísimo, porque se siente como si fuera gratis.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pero mil pesos de regalo compran exactamente lo mismo que mil pesos ganados.' },
          { t: 'Se reparte con porcentajes.', fondo: 'tres-partes' },
          { t: 'Cincuenta, treinta, veinte. La mitad a tu meta, treinta por ciento al ahorro, veinte para un gusto.', fondo: 'tres-partes', recorte: [0.5, 0.5, 0.75] },
          { t: 'Y se calcula sin calculadora. El cincuenta por ciento es partir a la mitad.', fondo: 'tres-partes' },
          { t: 'El diez por ciento es quitarle un cero. Con esos dos armas todo lo demás.', fondo: 'tres-partes' },
          { t: 'Todo esto cabe en un solo documento: tu presupuesto mensual.', fondo: 'meta-escrita' },
          { t: 'Lo que esperas recibir, lo que planeas gastar por color, y lo que apartas.', fondo: 'meta-escrita', recorte: [0.5, 0.5, 0.6] },
          { t: 'Registrar es anotar lo que ya pasó. Presupuestar es decidir lo que va a pasar.', fondo: 'meta-escrita' },
          { t: 'Y si no cuadra, se recorta desde el rojo.', fondo: 'rojo-impulso' },
          { t: 'Escribe tu meta con fecha. Pinta tus gastos de tres colores. Y ten la regla lista antes de que llegue el dinero.', fondo: 'meta-escrita', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 2 · Bancos y Cuentas, segunda parte ────────────────────────────
     P3-2-6 sucursal cajero y app · P3-2-7 el estado de cuenta · P3-2-8 comisiones
     P3-2-9 el IPAB · P3-2-10 abrir mi primera cuenta */
  {
    id: 'p3-b2-u6',
    titulo: 'Las tres puertas del banco',
    imagenes: {
      'tres-puertas': 'A bank branch entrance, an outdoor ATM and a smartphone shown together in one composition as three doorways to the same place, stylized illustrative scene',
      'sucursal-persona': 'A friendly Mexican bank clerk attending a mother and her nine year old child across a desk inside a modern bank branch, paperwork on the desk',
      'cajero-noche': 'A lit ATM on a Mexican street at night with a person withdrawing cash, quiet empty street, cool light',
      'app-celular': 'A childs hands holding a smartphone showing a simple banking screen with blank rows, kitchen table, warm light',
      'mismo-dinero': 'One large stylized safe with three different paths drawn leading to it from three directions, clean illustrative diagram style',
      'estado-cuenta': 'A printed bank statement on a kitchen table covered in rows of numbers, a pencil and a childs notebook beside it, top down view',
      'cinco-campos': 'A close up of a bank statement with five areas circled in pencil, a childs finger pointing at one of them',
      'cargo-raro': 'A mother and child at the table both frowning slightly at one line of a bank statement, the child pointing at it, evening lamp light',
      'comision-descuento': 'A small pile of coins with a few being lifted away by an invisible force, illustrative representation of a fee being deducted, plain background',
      'cajero-ajeno': 'A person at an ATM that clearly belongs to a different bank than the card they are holding, street setting, neutral daylight',
      'ipab-escudo': 'A large protective shield standing over a modern bank building, stylized institutional illustration, calm confident mood',
      'firmar-contrato': 'A parent and a nine year old child reading a contract carefully together at a bank desk before signing, unhurried, the clerk waiting',
    },
    laminas: [
      'tres-puertas', 'sucursal-persona', 'cajero-noche', 'app-celular', 'mismo-dinero',
      'estado-cuenta', 'cinco-campos', 'cargo-raro', 'comision-descuento', 'cajero-ajeno',
      'ipab-escudo', 'firmar-contrato',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'tres-puertas',
        tomas: [
          'Un banco no es solo un edificio.',
          { t: 'Hoy tiene tres puertas.', recorte: [0.5, 0.5, 0.6] },
          'La sucursal, el cajero y la aplicación del celular.',
          { t: 'Las tres llegan a tu mismo dinero, pero no sirven para lo mismo.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'sucursal-persona',
        tomas: [
          'La sucursal es para lo que necesita una persona.',
          { t: 'Abrir una cuenta, aclarar un cobro raro, reportar un problema.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El cajero es para efectivo y consultas rápidas.', fondo: 'cajero-noche' },
          { t: 'Funciona casi siempre, casi a cualquier hora. Pero no aclara problemas.', fondo: 'cajero-noche' },
          { t: 'Y la aplicación es la más cómoda: ver el saldo, transferir, pagar servicios.', fondo: 'app-celular' },
          { t: 'Lo importante es esto: no son tres cuentas. Es la misma cuenta vista desde tres lugares.', fondo: 'mismo-dinero' },
          { t: 'Si sacas dinero en el cajero, el saldo baja en la app inmediatamente.', fondo: 'mismo-dinero', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'estado-cuenta',
        tomas: [
          'Cada mes el banco manda un papel lleno de números.',
          { t: 'El estado de cuenta. Y muchísima gente ni lo abre.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Ese es el error, porque es el único lugar donde te enteras de que te cobraron algo que no era.' },
          { t: 'Aunque se vea lleno, solo importan cinco cosas.', fondo: 'cinco-campos' },
          { t: 'El periodo, el saldo inicial, los abonos, los cargos y el saldo final.', fondo: 'cinco-campos', recorte: [0.5, 0.5, 0.65] },
          { t: 'Y aquí sirve tu registro: comparas uno por uno.', fondo: 'cargo-raro' },
          { t: 'El que aparece en el banco y no en tu libreta es el que hay que investigar.', fondo: 'cargo-raro', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'comision-descuento',
        tomas: [
          'A veces hay menos dinero y no compraste nada.',
          { t: 'Casi siempre es una comisión: lo que el banco cobra por un servicio.', rotulo: 'Comisión' },
          { t: 'No es un robo. Es el precio de algo, y casi siempre viene escrito en el contrato.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Treinta pesos al mes parece poco. Por doce son trescientos sesenta al año.', cifra: ['360', 'al año'] },
          { t: 'Y si además sacas dinero en cajeros de otro banco cuatro veces al mes.', fondo: 'cajero-ajeno' },
          { t: 'A treinta pesos cada retiro, son mil cuatrocientos cuarenta más.', fondo: 'cajero-ajeno', cifra: ['1440', 'al año'] },
          { t: 'La buena noticia: casi todas se evitan con hábitos simples.', fondo: 'cajero-ajeno' },
          { t: 'Retirar en cajeros de tu propio banco y mantener el saldo mínimo.', fondo: 'cajero-ajeno', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'ipab-escudo',
        tomas: [
          'Mucha gente guarda el dinero en casa por miedo a que el banco quiebre.',
          { t: 'En México eso está resuelto desde hace décadas, y tiene nombre.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El I P A B. El Instituto para la Protección al Ahorro Bancario.', rotulo: 'IPAB' },
          { t: 'Si un banco quiebra, el I P A B devuelve el dinero de los ahorradores hasta cierto límite.' },
          { t: 'Un límite de varios millones de pesos por persona en cada banco.' },
          { t: 'Cubre cuentas de ahorro, de nómina y depósitos a plazo. No cubre tandas ni inversiones en la bolsa.' },
          { t: 'Y el dinero en casa no está protegido de nada. Ni de un robo, ni de un incendio, ni de la inflación.', fondo: 'firmar-contrato' },
          { t: 'Para abrir tu primera cuenta necesitas acta o C U R P, identificación de tu tutor y comprobante de domicilio.', fondo: 'firmar-contrato', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y cinco preguntas antes de firmar: comisión de manejo, saldo mínimo, qué otras comisiones, cuánto interés paga y qué pasa si cierras la cuenta.', fondo: 'firmar-contrato' },
          { t: 'Nunca se firma nada que no se haya leído. Nunca. Por más prisa que haya.', fondo: 'firmar-contrato' },
          { t: 'Abre tu estado de cuenta. Retira en tu propio banco. Y lee antes de firmar.', fondo: 'firmar-contrato', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 3 · Crédito y Deuda, segunda parte ─────────────────────────────
     P3-3-6 historial crediticio · P3-3-7 pagar a tiempo · P3-3-8 comprar a meses
     P3-3-9 prestamos informales · P3-3-10 bola de nieve */
  {
    id: 'p3-b3-u6',
    titulo: 'La reputación de tu dinero',
    imagenes: {
      'lapiz-prestado': 'One nine year old handing a pencil to a classmate in a Mexican classroom, the lender looking slightly hesitant, natural daylight',
      'libreta-cumplidos': 'An open notebook with a long column of neat tick marks and one cross near the bottom, pencil beside it, top down view',
      'buro-archivo': 'A large stylized filing cabinet with many drawers inside a bright office, one drawer open showing organised folders, clean institutional look',
      'calendario-quince': 'A calendar page with the fifteenth clearly marked and a phone reminder alarm going off beside it on a desk',
      'un-dia-tarde': 'Two identical envelopes on a counter, one being handed over on time and one arriving late, the late one clearly delayed, illustrative split composition',
      'anuncio-mensualidad': 'A shop window advertisement for a television with a large blank price banner and a small blank corner note, Mexican street shop front',
      'multiplicar-meses': 'Twenty four identical small banknote stacks arranged in a long grid on a table beside one much smaller pile, top down view, clear size contrast',
      'volante-poste': 'A handwritten loan flyer stapled to a wooden utility pole on a Mexican street, slightly weathered, a person reading it',
      'cobro-diario': 'A man on a motorcycle collecting a small daily payment at the door of a modest home, the resident handing over coins reluctantly, overcast light',
      'tres-deudas': 'Three stacks of paper of clearly different heights arranged smallest to largest on a table, top down view, plain background',
      'bola-nieve': 'A snowball rolling downhill and growing larger, stylized illustration on a clean white slope, dynamic motion',
      'no-agregar': 'A person putting a credit card away in a drawer and closing it firmly, decisive gesture, home desk',
    },
    laminas: [
      'lapiz-prestado', 'libreta-cumplidos', 'buro-archivo', 'calendario-quince', 'un-dia-tarde',
      'anuncio-mensualidad', 'multiplicar-meses', 'volante-poste', 'cobro-diario', 'tres-deudas',
      'bola-nieve', 'no-agregar',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'lapiz-prestado',
        tomas: [
          'Le prestas un lápiz a alguien y no te lo devuelve.',
          { t: 'La próxima vez lo piensas dos veces.', recorte: [0.5, 0.5, 0.6] },
          'Los bancos hacen exactamente lo mismo.',
          { t: 'Pero con dinero, y con memoria escrita.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'libreta-cumplidos',
        tomas: [
          'Ese recuerdo se llama historial crediticio.',
          { t: 'Es el registro de si una persona cumplió con lo que se comprometió a pagar.', rotulo: 'Historial' },
          { t: 'En México se llama Buró de Crédito, y hay una idea muy extendida y equivocada.', fondo: 'buro-archivo' },
          { t: 'Que estar en el Buró es malo. No lo es. Todo el que ha tenido un crédito aparece ahí.', fondo: 'buro-archivo', recorte: [0.5, 0.5, 0.62] },
          { t: 'Lo que importa es qué dice de ti.', fondo: 'buro-archivo' },
          { t: 'Y se construye con muchos pagos puntuales, uno tras otro, durante años.', fondo: 'libreta-cumplidos' },
          { t: 'Pero se daña muchísimo más rápido de lo que se construyó.', fondo: 'libreta-cumplidos', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'un-dia-tarde',
        tomas: [
          'Dos personas deben exactamente lo mismo.',
          { t: 'Una paga el quince y la otra el dieciséis.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Un solo día, y la segunda va a pagar más y va a cargar una marca durante años.' },
          { t: 'Atrasarse cuesta de tres formas. El recargo, el interés que se acumula cada día, y la marca.' },
          { t: 'Y aquí está la buena noticia.', fondo: 'calendario-quince' },
          { t: 'Una parte enorme de los atrasos pasa teniendo el dinero. Simplemente se olvidó la fecha.', fondo: 'calendario-quince', recorte: [0.5, 0.5, 0.6] },
          { t: 'Eso se arregla con un recordatorio unos días antes. No el mismo día.', fondo: 'calendario-quince', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'anuncio-mensualidad',
        tomas: [
          'Llévalo por solo ciento noventa y nueve al mes.',
          { t: 'Nunca te dicen la otra frase.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Vas a pagar cuatro mil setecientos setenta y seis por algo que cuesta tres mil doscientos.', cifra: ['1576', 'de más'] },
          { t: 'La operación que la publicidad esconde es una multiplicación.', fondo: 'multiplicar-meses' },
          { t: 'La mensualidad por el número de meses. Eso es lo que vas a pagar en total.', fondo: 'multiplicar-meses', rotulo: 'Total real' },
          { t: 'Y ojo: más meses bajan la mensualidad, pero suben el total.', fondo: 'multiplicar-meses' },
          { t: 'Sí existen los meses sin intereses de verdad, donde el total es idéntico al precio de contado.', fondo: 'anuncio-mensualidad' },
          { t: 'Ahí conviene. Pero se verifica, no se supone.', fondo: 'anuncio-mensualidad', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'volante-poste',
        tomas: [
          'Hay volantes que prometen dinero en diez minutos, sin papeles.',
          { t: 'Suena a solución. Hagamos la cuenta que casi nadie hace.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Prestan mil pesos y se devuelven en veinticuatro pagos diarios de cincuenta.', fondo: 'cobro-diario', cifra: ['1200', 'a pagar'] },
          { t: 'Parecen solo doscientos pesos. Pero son doscientos en menos de un mes.', fondo: 'cobro-diario' },
          { t: 'Llevado a un año, eso supera con mucho a cualquier crédito de banco.', fondo: 'cobro-diario' },
          { t: 'Las señales de alarma son claras: presionan para firmar rápido y no explican la tasa anual.', fondo: 'volante-poste' },
          { t: 'Y si ya hay varias deudas, hay un método que funciona: la bola de nieve.', fondo: 'tres-deudas' },
          { t: 'Ordenas las deudas de la más chica a la más grande, sin importar el interés.', fondo: 'tres-deudas', recorte: [0.5, 0.5, 0.7] },
          { t: 'Pagas el mínimo de todas y todo lo extra a la más pequeña, hasta liquidarla.', fondo: 'bola-nieve' },
          { t: 'Y cuando cae, ese pago no se gasta: se suma a la siguiente. Por eso la bola crece.', fondo: 'bola-nieve' },
          { t: 'Pero nada funciona si mientras tanto sigues agregando deudas nuevas.', fondo: 'no-agregar' },
          { t: 'Pon el recordatorio antes. Multiplica antes de aceptar meses. Y deja de agregar.', fondo: 'no-agregar', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 4 · ¡Es Hora de Emprender!, segunda parte ──────────────────────
     P3-4-6 prototipo · P3-4-7 probar con clientes · P3-4-8 inventario
     P3-4-9 roles del puesto · P3-4-10 cierre de la feria */
  {
    id: 'p3-b4-u6',
    titulo: 'La primera versión no es para vender',
    imagenes: {
      'idea-perfecta': 'A nine year old imagining a perfect polished product floating above their head as a glowing shape, classroom desk, dreamy composition',
      'prototipo-carton': 'A rough cardboard and tape prototype of a small object sitting on a school desk, clearly handmade and imperfect, natural daylight',
      'prototipo-falla': 'A childs hands holding the cardboard prototype as one part sags and comes loose, the child noticing the problem, honest and unglamorous',
      'version-dos': 'Three versions of the same handmade object lined up left to right, each visibly better built than the previous, top down view',
      'pregunta-mala': 'A child eagerly showing their product to a classmate who is smiling politely but without real interest, schoolyard',
      'pregunta-hechos': 'Two children sitting face to face, one taking notes in a notebook while the other talks and gestures, focused interview atmosphere',
      'anotar-crudo': 'A notebook page with a childs handwriting recording quotes verbatim, some lines underlined, pencil resting on it, top down view',
      'feria-puesto': 'A busy school fair stall run by four children with a queue of classmates in front, colourful and lively, sunny schoolyard',
      'dos-lotes': 'A small tray of finished products on a table and beside it a stack of unused raw materials ready for a second batch, top down view',
      'cuatro-roles': 'Four children at a school stall each doing a distinct task, one greeting, one handling coins, one writing in a notebook, one restocking, clear separation',
      'una-caja': 'A single small cash box on a stall table with only one childs hands on it, other children working around but not touching it',
      'cierre-numeros': 'Four children after the fair sitting around a table with the cash box open, a notebook of numbers between them, end of day light',
    },
    laminas: [
      'idea-perfecta', 'prototipo-carton', 'prototipo-falla', 'version-dos', 'pregunta-mala',
      'pregunta-hechos', 'anotar-crudo', 'feria-puesto', 'dos-lotes', 'cuatro-roles',
      'una-caja', 'cierre-numeros',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'idea-perfecta',
        tomas: [
          'Tener una idea es fácil.',
          { t: 'Lo difícil es descubrir si funciona.', recorte: [0.5, 0.45, 0.55] },
          'Y en tu cabeza todas las ideas funcionan.',
          { t: 'Porque las partes difíciles se saltan sin que te des cuenta.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'prototipo-carton',
        tomas: [
          'Por eso existe el prototipo.',
          { t: 'Una primera versión hecha con lo que hay a la mano.', rotulo: 'Prototipo' },
          { t: 'No sirve para vender. Sirve para aprender.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y tiene tres reglas: rápido, barato y desechable.' },
          { t: 'Desechable es la más importante. Si te encariñas, vas a defenderlo en lugar de mejorarlo.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'prototipo-falla',
        tomas: [
          'Al construirlo aparecen las preguntas reales.',
          { t: 'Dónde se sujeta. Cuánto pesa. Cómo se guarda.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Eso no es fracasar. Eso es exactamente para lo que sirve.' },
          { t: 'Nadie acierta a la primera, y nadie debería intentarlo.', fondo: 'version-dos' },
          { t: 'Construir, mostrar, escuchar lo que falla, y volver a construir.', fondo: 'version-dos', recorte: [0.5, 0.5, 0.75] },
          { t: 'Cada vuelta mejora el producto.', fondo: 'version-dos', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'pregunta-mala',
        tomas: [
          'Ahora, la pregunta que casi todos hacen mal.',
          { t: 'Te gusta mi idea. Casi siempre te van a decir que sí.', recorte: [0.5, 0.5, 0.6] },
          { t: 'No porque les guste, sino porque no quieren lastimarte. Eso es amabilidad, no información.' },
          { t: 'Las preguntas útiles hablan del pasado y de hechos.', fondo: 'pregunta-hechos' },
          { t: 'Cuándo fue la última vez que compraste algo así. Cuánto pagaste. Qué te molestó.', fondo: 'pregunta-hechos', recorte: [0.5, 0.5, 0.62] },
          { t: 'Nadie inventa un recuerdo para quedar bien.', fondo: 'pregunta-hechos' },
          { t: 'Y al anotar hay una tentación fuerte: suavizar lo negativo.', fondo: 'anotar-crudo' },
          { t: 'Anota las palabras que dijeron, tal cual. Si escuchas cinco críticas y no cambias nada, la prueba fue teatro.', fondo: 'anotar-crudo', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'feria-puesto',
        tomas: [
          'Llega la feria, y hay dos formas de equivocarse.',
          { t: 'Que se te acabe todo en media hora, o que te sobre la mitad.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Las dos cuestan dinero.' },
          { t: 'La estimación es una cadena de tres números.', fondo: 'dos-lotes' },
          { t: 'Cuánta gente asiste, cuántos se acercan, y cuántos de esos compran.', fondo: 'dos-lotes' },
          { t: 'Y la estrategia que baja el riesgo: produce un primer lote más chico y ten material listo para otro.', fondo: 'dos-lotes', recorte: [0.5, 0.5, 0.65] },
          { t: 'En el puesto, cuatro roles.', fondo: 'cuatro-roles' },
          { t: 'Quien atiende, quien cobra, quien registra y quien repone.', fondo: 'cuatro-roles', recorte: [0.5, 0.5, 0.8] },
          { t: 'Y una regla sobre todas: una sola persona toca la caja.', fondo: 'una-caja' },
          { t: 'Con varias manos en el dinero, al final nadie sabe si hubo error o falta.', fondo: 'una-caja' },
          { t: 'Al terminar, tres números. Ingresos, costos y utilidad.', fondo: 'cierre-numeros' },
          { t: 'Porque una feria con muchas ventas y muchos costos puede dejar muy poco.', fondo: 'cierre-numeros' },
          { t: 'Haz el prototipo feo. Pregunta por hechos. Y cierra con números, no con sensaciones.', fondo: 'cierre-numeros', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── RETO SUPREMO · La Familia Ramírez ─────────────────────────────────────
     Ocho mil quinientos pesos, un mes, cuatro semanas y una emergencia. */
  {
    id: 'p3-supremo',
    titulo: 'La Familia Ramírez',
    imagenes: {
      'familia-mesa': 'A Mexican family of four sitting around the kitchen table with bills and a notebook spread out in front of them, serious but calm, evening light',
      'sobre-mensual': 'A single envelope of banknotes on a kitchen table, a hand resting beside it, the only money for the month, warm lamp light',
      'cuatro-semanas': 'Four small piles of banknotes arranged in a row on a table, one per week, top down view, plain background',
      'gastos-fijos': 'Rent, electricity, water and food bills laid out neatly side by side on a table, top down view, even light',
      'emergencia': 'A Mexican family looking at a broken refrigerator in their kitchen with worried faces, an unexpected problem, midday light',
      'decision-final': 'A parent and child crossing one item off a shopping list together at the kitchen table, calm and decided, warm light',
    },
    laminas: ['familia-mesa', 'sobre-mensual', 'cuatro-semanas', 'gastos-fijos', 'emergencia', 'decision-final'],
    bloques: [
      {
        paso: 0,
        fondo: 'familia-mesa',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Vas a administrar el dinero de una familia entera durante un mes.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Ocho mil quinientos pesos.', cifra: ['8500', 'para el mes'], respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'sobre-mensual',
        tomas: [
          'No entra más dinero a mitad del mes.',
          { t: 'Ese sobre es todo lo que hay.', recorte: [0.5, 0.5, 0.55] },
          { t: 'Por eso lo primero no es gastar. Es repartir.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'gastos-fijos',
        tomas: [
          'Hay gastos que no se discuten.',
          { t: 'La renta, la luz, el agua y la comida van primero.', recorte: [0.5, 0.5, 0.62] },
          { t: 'Ese es tu verde. Lo demás se acomoda con lo que sobra.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'emergencia',
        tomas: [
          'Y en alguna semana va a llegar una emergencia.',
          { t: 'No es mala suerte del juego. Así pasa en la vida real.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Por eso las familias que apartan un poco desde la semana uno sobreviven el mes.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cuatro-semanas',
        tomas: [
          'Cuatro semanas, cuatro decisiones.',
          { t: 'Reparte primero. Aparta para el susto. Y recorta desde el rojo.', fondo: 'decision-final' },
          { t: 'Gana quien llega al día treinta con la familia entera de pie.', fondo: 'decision-final', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
