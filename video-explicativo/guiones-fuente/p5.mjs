/**
 * Primaria 5 — 10 a 11 años. Cinco videos.
 *
 * REGISTRO. Sistema y consecuencia, con cifras reales. Es el primer grado donde
 * se puede explicar por qué una regla no tiene excepciones (riesgo y rendimiento)
 * y donde una progresión geométrica —6, 36, 216— se entiende sin álgebra.
 * `estiloDeGrado()` ya devuelve ESTILO_PRETEEN: personajes de once o doce años.
 *
 * Contenido de `public/data/pedagogia/primaria/p5.json`, unidades 6 a 10.
 * Diccion para XTTS: siglas deletreadas (S P E I, C L A B E se dice clabe,
 * Q R, C E T E S se dice cetes), sin comillas, sin puntos suspensivos.
 */

export const ARGUMENTOS = [
  /* ── BLOQUE 1 · Sistema Financiero, segunda parte ──────────────────────────
     P5-1-6 CONDUSEF y Buro de Entidades · P5-1-7 SPEI y CoDi · P5-1-8 la tasa
     P5-1-9 evolucion de los pagos · P5-1-10 inclusion financiera */
  {
    id: 'p5-b1-u6',
    titulo: 'Cuando el banco dice que no',
    imagenes: {
      'banco-dice-no': 'A bank clerk shaking their head across a counter at a woman holding a folder of documents, polite but firm refusal, modern branch interior',
      'folio-reclamacion': 'A hand holding a printed complaint receipt with a reference number area left blank, bank counter behind, close up',
      'buro-entidades': 'A laptop on a kitchen table showing a public comparison table with blank rows and columns, a preteen and a parent looking at it together',
      'proporcion-datos': 'Two bar charts of very different heights shown side by side on a screen, one tall and one short, clean data visualisation, no labels',
      'spei-segundos': 'A stylized map of Mexico with a bright line of light travelling instantly from one city to another, clean infographic style, dark background',
      'clabe-dieciocho': 'A close up of a phone transfer screen with a long empty number field and a keypad below, hands typing carefully',
      'codi-qr': 'A market vendor in Mexico holding up a QR code card while a customer scans it with their phone, sunny outdoor market stall',
      'verificar-nombre': 'A phone confirmation screen held in two hands with a blank name field highlighted, the person pausing before pressing confirm',
      'banxico-tasa': 'The facade of a large central bank building in Mexico City with a formal institutional feel, clear daylight',
      'balanza-tasa': 'A balance scale with a savings jar on one side and a credit card on the other, tilting, clean illustrative composition',
      'evolucion-pagos': 'A left to right progression on one surface: barter goods, coins, banknotes, a bank card and a smartphone, top down view, clean spacing',
      'sin-sucursal': 'A remote Mexican rural village street with no bank in sight, a woman walking with a bag, mountains in the background, warm afternoon light',
    },
    laminas: [
      'banco-dice-no', 'folio-reclamacion', 'buro-entidades', 'proporcion-datos', 'spei-segundos',
      'clabe-dieciocho', 'codi-qr', 'verificar-nombre', 'banxico-tasa', 'balanza-tasa',
      'evolucion-pagos', 'sin-sucursal',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'banco-dice-no',
        tomas: [
          'El banco te dice que no.',
          { t: 'Y tú estás seguro de que tienes razón.', recorte: [0.5, 0.5, 0.6] },
          'Mucha gente se queda ahí, porque cree que ahí se acabó.',
          { t: 'No se acabó. Existe una institución que te defiende, y una base de datos pública para revisarlos a ellos.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'folio-reclamacion',
        tomas: [
          'La CONDUSEF atiende a quien tiene un problema con un banco, una aseguradora o una afore.',
          { t: 'Orienta, media entre las partes y en algunos casos puede resolver como árbitro.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pero el camino tiene un orden, y saltárselo te devuelve al principio.' },
          { t: 'Primero se reclama ante la institución y se guarda el folio.', rotulo: 'Primero el folio' },
          { t: 'Si no responden o la respuesta no satisface, entonces se acude a la CONDUSEF con ese folio en la mano.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'buro-entidades',
        tomas: [
          'Y hay una herramienta que casi nadie usa.',
          { t: 'El Buró de Entidades Financieras.', rotulo: 'Buró de Entidades' },
          { t: 'Una base pública que muestra cuántas reclamaciones recibe cada institución, cómo las resuelve y qué sanciones ha tenido.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Pero hay que leerla con proporción.', fondo: 'proporcion-datos' },
          { t: 'Una institución con diez mil reclamaciones no es peor que una con cien.', fondo: 'proporcion-datos' },
          { t: 'Puede tener cien veces más clientes. Lo que importa es la proporción, y cuántas se resuelven a favor del usuario.', fondo: 'proporcion-datos', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'spei-segundos',
        tomas: [
          'Mandas dinero desde tu celular y llega en segundos al otro lado del país.',
          { t: 'No viajan billetes. Viaja información.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Por un sistema del Banco de México que se llama S P E I.', rotulo: 'SPEI' },
          { t: 'Y para llegar a la cuenta correcta hace falta un número de dieciocho dígitos: la clabe.', fondo: 'clabe-dieciocho' },
          { t: 'Identifica de forma única una cuenta en todo el país.', fondo: 'clabe-dieciocho' },
          { t: 'CoDi resuelve el problema de teclear mal: quien cobra genera un código Q R que ya trae su cuenta y el monto exacto.', fondo: 'codi-qr' },
          { t: 'El que paga solo escanea y confirma.', fondo: 'codi-qr' },
          { t: 'Y hay un segundo que decide todo: antes de confirmar, la app muestra el nombre del titular.', fondo: 'verificar-nombre' },
          { t: 'Si el nombre no coincide, no confirmes. Una transferencia enviada no se cancela: hay que pedirle a esa persona que la devuelva.', fondo: 'verificar-nombre', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'banxico-tasa',
        tomas: [
          'Cada cierto tiempo sale la noticia: el Banco de México subió la tasa.',
          { t: 'Suena a cosa de economistas, y decide cuánto te cuesta un crédito y cuánto rinde tu ahorro.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Es la tasa de referencia: la base de casi todas las demás tasas del país.', rotulo: 'Tasa de referencia' },
          { t: 'Se sube para frenar la inflación.', fondo: 'balanza-tasa' },
          { t: 'Con tasas altas pedir prestado se encarece y ahorrar se vuelve atractivo, así que se gasta menos y los precios se calman.', fondo: 'balanza-tasa' },
          { t: 'Se baja para reactivar. El crédito se abarata, las empresas invierten y las familias consumen.', fondo: 'balanza-tasa' },
          { t: 'Nada de esto es magia moderna: cada medio de pago resolvió una limitación del anterior.', fondo: 'evolucion-pagos' },
          { t: 'El trueque exigía coincidir. Las monedas resolvieron eso. Los billetes resolvieron cargar metal.', fondo: 'evolucion-pagos', recorte: [0.4, 0.5, 0.6] },
          { t: 'Y la diferencia grande hoy no es la comodidad: es el rastro.', fondo: 'evolucion-pagos' },
          { t: 'El efectivo no deja registro. Eso da privacidad, pero si hay un desacuerdo no hay forma de probar nada.', fondo: 'evolucion-pagos' },
          { t: 'Y millones de personas en México siguen fuera de todo esto.', fondo: 'sin-sucursal' },
          { t: 'Hay municipios sin una sola sucursal, donde llegar al banco es un viaje de horas.', fondo: 'sin-sucursal', recorte: [0.5, 0.5, 0.62] },
          { t: 'Quedarse fuera cuesta caro: el ahorro se expone al robo, no hay historial y el crédito formal queda cerrado.', fondo: 'sin-sucursal' },
          { t: 'Guarda tu folio. Verifica el nombre antes de confirmar. Y revisa el Buró antes de contratar.', fondo: 'sin-sucursal', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 2 · Consumo Responsable, segunda parte ─────────────────────────
     P5-2-6 necesidad deseo capricho · P5-2-7 precio ancla · P5-2-8 influencers
     P5-2-9 garantias · P5-2-10 PROFECO */
  {
    id: 'p5-b2-u6',
    titulo: 'El precio tachado',
    imagenes: {
      'precio-tachado': 'A shop price tag with a large crossed out number area and a smaller number below it, both blank, close up on a retail shelf',
      'misma-tienda-otra': 'The same product displayed in two different shops shown side by side in one composition, blank price cards under each',
      'tres-niveles-deseo': 'Three items arranged on a staircase of three steps: worn out shoes on the bottom, a musical instrument in the middle, a flashy gadget on top',
      'prueba-tiempo': 'A wall calendar with two weeks crossed off and a preteen looking at a product photo with visibly less interest than before',
      'terminado-nueve': 'A row of price tags on a shelf all ending with the same digit shape, the digits blank, retail aisle, shallow depth of field',
      'opcion-senuelo': 'Three subscription plan cards displayed side by side on a screen, the middle one clearly worse designed than the others, blank text areas',
      'escasez-contador': 'A phone screen showing a countdown and a nearly empty stock bar, urgent red glow, dark room',
      'influencer-producto': 'A young content creator filming themselves holding up a product in a bright bedroom studio with a ring light, enthusiastic',
      'codigo-descuento': 'A phone screen showing a personalised discount code area left blank on a colourful promotional post, held in one hand',
      'ticket-guardado': 'A shoebox full of neatly kept receipts on a shelf, one receipt being pulled out by a hand, domestic setting',
      'producto-descompuesto': 'A broken small appliance on a kitchen counter beside its box and a receipt, a person examining it with mild frustration',
      'ventanilla-queja': 'A person calmly presenting documents at a consumer protection office counter, an official reviewing them, institutional interior',
    },
    laminas: [
      'precio-tachado', 'misma-tienda-otra', 'tres-niveles-deseo', 'prueba-tiempo', 'terminado-nueve',
      'opcion-senuelo', 'escasez-contador', 'influencer-producto', 'codigo-descuento', 'ticket-guardado',
      'producto-descompuesto', 'ventanilla-queja',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'precio-tachado',
        tomas: [
          'Ves un precio tachado de mil doscientos y al lado setecientos noventa y nueve.',
          { t: 'Parece un ahorro de cuatrocientos un pesos.', cifra: ['401', 'de ahorro'] },
          { t: 'Pero el producto nunca costó mil doscientos.', fondo: 'misma-tienda-otra' },
          { t: 'Y en otra tienda está en setecientos cincuenta.', fondo: 'misma-tienda-otra', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'tres-niveles-deseo',
        tomas: [
          'Antes de los precios, hay que separar tres cosas.',
          { t: 'Una necesidad es lo que hace falta para funcionar. Comida, salud, zapatos cuando los que hay están rotos.', recorte: [0.5, 0.62, 0.6] },
          { t: 'Un deseo mejora la vida de verdad y se puede planear. Una bicicleta mejor, un curso, un instrumento.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y un capricho es un impulso activado por algo externo: un anuncio, una oferta, ver a alguien con el producto.', recorte: [0.5, 0.38, 0.6] },
          { t: 'Distinguir deseo de capricho tiene una sola prueba, y es el tiempo.', fondo: 'prueba-tiempo' },
          { t: 'Si a las dos semanas lo sigues queriendo igual, es un deseo y merece un plan de ahorro.', fondo: 'prueba-tiempo' },
          { t: 'Si se te olvidó, acabas de ahorrarte el dinero y el arrepentimiento.', fondo: 'prueba-tiempo', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'precio-tachado',
        tomas: [
          'Ese número tachado tiene nombre técnico.',
          { t: 'Precio ancla. Y una sola función: manipular lo que te parece caro.', rotulo: 'Precio ancla' },
          { t: 'Puede ser un precio tachado, un precio de lista que nadie paga, o un producto carísimo puesto al lado.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y el precio terminado en nueve funciona por cómo leemos.', fondo: 'terminado-nueve' },
          { t: 'Ciento noventa y nueve se siente cerca de cien, aunque esté a un peso de doscientos.', fondo: 'terminado-nueve' },
          { t: 'La defensa es redondear hacia arriba antes de decidir.', fondo: 'terminado-nueve' },
          { t: 'Cuando hay tres opciones y una está claramente peor, esa mala opción no está ahí para venderse.', fondo: 'opcion-senuelo' },
          { t: 'Está para hacer que otra parezca excelente. Se llama señuelo.', fondo: 'opcion-senuelo', rotulo: 'Señuelo' },
          { t: 'Y últimas piezas, solo hoy, quedan tres: la urgencia impide comparar.', fondo: 'escasez-contador' },
          { t: 'Muchas veces ese contador se reinicia todos los días.', fondo: 'escasez-contador', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'influencer-producto',
        tomas: [
          'Alguien que sigues recomienda un producto y suena honesto.',
          { t: 'Si le pagaron y no lo dijo, eso es publicidad disfrazada de opinión.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Ojo con esto: que le paguen no significa que el producto sea malo.' },
          { t: 'Significa que hay un interés económico que hay que tomar en cuenta al ponderar lo que dice.' },
          { t: 'Las señales son bastante confiables.', fondo: 'codigo-descuento' },
          { t: 'Un código de descuento personalizado, porque implica una comisión por venta.', fondo: 'codigo-descuento', recorte: [0.5, 0.5, 0.6] },
          { t: 'Elogios sin una sola crítica, porque ningún producto es perfecto.', fondo: 'influencer-producto' },
          { t: 'Y tres preguntas resuelven casi todo. Quién le paga. Menciona alguna desventaja. Lo comparó con otras opciones.', fondo: 'influencer-producto', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'producto-descompuesto',
        tomas: [
          'Compras algo, se descompone a las dos semanas.',
          { t: 'Y crees que ya no hay nada que hacer.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Tienes derechos claros, pero solo sirven si guardaste el ticket.', fondo: 'ticket-guardado' },
          { t: 'La garantía responde ante defectos de fabricación durante un plazo.', fondo: 'producto-descompuesto', rotulo: 'Garantía' },
          { t: 'La devolución es otra cosa: una política comercial de cada tienda, para devolver algo en buen estado.', fondo: 'producto-descompuesto' },
          { t: 'Confundirlas hace que la gente exija lo que no corresponde y no exija lo que sí.', fondo: 'producto-descompuesto' },
          { t: 'Una reclamación efectiva lleva tres cosas.', fondo: 'ticket-guardado' },
          { t: 'El comprobante, la descripción precisa del defecto y una petición concreta: reparación, cambio o devolución.', fondo: 'ticket-guardado', recorte: [0.5, 0.5, 0.62] },
          { t: 'Y si en la tienda no te hacen caso, tampoco se acaba ahí.', fondo: 'ventanilla-queja' },
          { t: 'La autoridad del consumidor recibe quejas, cita a las partes a conciliar y puede sancionar.', fondo: 'ventanilla-queja' },
          { t: 'Pero primero se reclama con el proveedor y se documenta: fecha, con quién hablaste, qué respondieron.', fondo: 'ventanilla-queja' },
          { t: 'Redondea hacia arriba. Espera dos semanas. Y guarda el ticket.', fondo: 'ventanilla-queja', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 3 · Inversión y Patrimonio, segunda parte ──────────────────────
     P5-3-6 riesgo y rendimiento · P5-3-7 diversificacion · P5-3-8 fondos
     P5-3-9 el horizonte · P5-3-10 piramides */
  {
    id: 'p5-b3-u6',
    titulo: 'La regla que nunca falla',
    imagenes: {
      'promesa-imposible': 'A glossy promotional flyer promising extraordinary returns lying on a table, blank text areas, a hand about to pick it up',
      'balanza-riesgo': 'A seesaw with a small pile of coins on one end and a larger unstable stack on the other, clean illustrative composition',
      'escala-instrumentos': 'Five steps of increasing height on a clean surface, each step holding a container with progressively more coins, side view',
      'una-canasta': 'A single basket full of eggs held in two hands, and beside it four smaller baskets each with a few eggs, one composition',
      'sectores-distintos': 'Four small business scenes arranged in a grid: a workshop, a farm, a shop and a tech desk, all thriving, clean spacing',
      'fondo-colectivo': 'Many small coin contributions from different hands flowing into one large shared container, illustrative, warm light',
      'comision-erosiona': 'Two rising line graphs on a screen, one clearly ending lower than the other, clean data visualisation, no labels',
      'horizonte-fecha': 'A calendar with a date circled far ahead and a savings container beside it, a preteen planning at a desk',
      'vender-antes': 'A falling line on a screen with a hand hovering over a sell button, tension and hesitation, dim room',
      'piramide-crece': 'A stylized pyramid diagram built of small figures, each layer far wider than the one above, clean infographic on plain background',
      'testimonio-real': 'Two neighbours talking enthusiastically over a fence, one showing the other a phone, genuine excitement, sunny Mexican street',
      'cinco-banderas': 'Five small red flags planted in a row on a plain surface, clean symbolic composition, even light',
    },
    laminas: [
      'promesa-imposible', 'balanza-riesgo', 'escala-instrumentos', 'una-canasta', 'sectores-distintos',
      'fondo-colectivo', 'comision-erosiona', 'horizonte-fecha', 'vender-antes', 'piramide-crece',
      'testimonio-real', 'cinco-banderas',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'promesa-imposible',
        tomas: [
          'Existe una regla en las inversiones que nunca falla.',
          { t: 'A mayor rendimiento, mayor riesgo. Siempre. Sin excepciones.', recorte: [0.5, 0.5, 0.6] },
          'Quien te ofrezca mucho rendimiento sin riesgo no descubrió un secreto.',
          { t: 'Te está mintiendo.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'balanza-riesgo',
        tomas: [
          'Y la regla no tiene excepciones por una razón.',
          { t: 'Si existiera una inversión que pagara mucho sin ningún riesgo, todo el mundo pondría ahí su dinero.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Con tanta demanda, ya no necesitaría pagar tanto para atraer inversionistas. Y el rendimiento bajaría solo.' },
          { t: 'Riesgo tampoco significa perderlo todo.' },
          { t: 'Significa que el resultado puede variar y no se sabe de antemano cuál será.', fondo: 'escala-instrumentos' },
          { t: 'De menor a mayor: una cuenta de ahorro, que casi no varía y casi no rinde.', fondo: 'escala-instrumentos', recorte: [0.25, 0.6, 0.5] },
          { t: 'Instrumentos gubernamentales, muy seguros y con rendimiento moderado. Fondos diversificados. Y acciones, que pueden dar mucho o caer fuerte.', fondo: 'escala-instrumentos' },
          { t: 'Aceptar riesgo no es imprudente: es lo que permite que el dinero de largo plazo le gane a la inflación.', fondo: 'escala-instrumentos', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'una-canasta',
        tomas: [
          'Si pones todo en un solo lugar y ese lugar falla, lo pierdes todo.',
          { t: 'Si lo repartes en cuatro, pierdes una parte.', recorte: [0.7, 0.5, 0.55] },
          { t: 'Eso es diversificar, y no elimina el riesgo: lo reparte.', rotulo: 'Diversificar' },
          { t: 'Es la única herramienta que baja el riesgo sin renunciar del todo al rendimiento.' },
          { t: 'Y se reparte de tres formas.', fondo: 'sectores-distintos' },
          { t: 'Por instrumento, por sector y por plazo.', fondo: 'sectores-distintos', recorte: [0.5, 0.5, 0.8] },
          { t: 'Pero tiene un precio honesto: nunca vas a obtener el rendimiento máximo.', fondo: 'sectores-distintos' },
          { t: 'A cambio tampoco vas a sufrir la pérdida máxima. Ese intercambio es la esencia de invertir bien.', fondo: 'sectores-distintos' },
          { t: 'Y dos límites. Repartir entre opciones que se mueven igual no diversifica nada.', fondo: 'una-canasta' },
          { t: 'Y ninguna diversificación te protege de un fraude, porque ahí el dinero nunca se invirtió.', fondo: 'una-canasta', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'fondo-colectivo',
        tomas: [
          'Diversificar suena bien hasta que ves que necesitas mucho dinero para comprar diez cosas distintas.',
          { t: 'Los fondos de inversión resuelven exactamente eso.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Juntan el dinero de muchas personas y compran entre todos lo que ninguno podría solo.' },
          { t: 'Cada persona es dueña de una fracción proporcional a lo que aportó.' },
          { t: 'Y ahí aparece el número que casi nadie mira: la comisión anual.', fondo: 'comision-erosiona' },
          { t: 'Uno por ciento al año suena insignificante.', fondo: 'comision-erosiona' },
          { t: 'Pero se cobra cada año sobre todo el saldo, incluidos los rendimientos acumulados.', fondo: 'comision-erosiona' },
          { t: 'En horizontes largos, esa diferencia pequeña se vuelve enorme.', fondo: 'comision-erosiona', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'horizonte-fecha',
        tomas: [
          'Puedes elegir la mejor inversión del mundo y aun así perder dinero.',
          { t: 'Si la eliges para un plazo que no corresponde.', recorte: [0.5, 0.5, 0.6] },
          { t: 'El horizonte no es cuánto tiempo quieres invertir. Es cuándo, concretamente, vas a usar el dinero.', rotulo: 'Horizonte' },
          { t: 'Y la regla es de coincidencia: el plazo del instrumento nunca debe ser mayor que el horizonte de la meta.' },
          { t: 'Vender forzado tiene dos costos.', fondo: 'vender-antes' },
          { t: 'Puedes vender en una caída y convertir en definitiva una pérdida que era temporal.', fondo: 'vender-antes' },
          { t: 'Y algunos instrumentos castigan el retiro anticipado.', fondo: 'vender-antes' },
          { t: 'Y falta el fraude más común de todos.', fondo: 'piramide-crece' },
          { t: 'Una pirámide no es un fraude que falla: funciona perfectamente hasta que se acaba la gente.', fondo: 'piramide-crece' },
          { t: 'Si cada participante recluta seis, el primer nivel necesita seis, el segundo treinta y seis, el tercero doscientos dieciséis.', fondo: 'piramide-crece', cifra: ['216', 'en el nivel 3'] },
          { t: 'En doce niveles se necesita más gente que la que hay en el planeta. El colapso no es mala suerte: es aritmética.', fondo: 'piramide-crece' },
          { t: 'Y la trampa más eficaz es que los primeros sí cobran, y lo cuentan de buena fe.', fondo: 'testimonio-real' },
          { t: 'No mienten ni son cómplices. Por eso el testimonio de un conocido no prueba nada.', fondo: 'testimonio-real' },
          { t: 'Cinco banderas rojas: rendimiento fuera de mercado, promesa de cero riesgo, ganar por reclutar, presión para decidir hoy, y no estar en ningún registro oficial.', fondo: 'cinco-banderas' },
          { t: 'Reparte. Iguala el plazo. Y desconfía de lo que no tiene riesgo.', fondo: 'cinco-banderas', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── BLOQUE 4 · Emprendimiento y Liderazgo, segunda parte ───────────────────
     P5-4-6 modelo de negocio · P5-4-7 prototipar · P5-4-8 precios y descuentos
     P5-4-9 medir el negocio · P5-4-10 etica empresarial */
  {
    id: 'p5-b4-u6',
    titulo: 'Quién paga y por qué',
    imagenes: {
      'app-gratis': 'A person using a free app on a phone while an advertiser hands money to a company representative in the background, illustrative split scene',
      'cinco-piezas': 'Five blank cards arranged in a row on a desk with arrows drawn between them in pencil, planning layout, top down view',
      'mismo-producto': 'The same handheld product shown four times on one surface with a different price arrangement beside each, clean comparison layout',
      'ingreso-mayor-costo': 'A simple two pan balance with coins clearly heavier on one side, plain background, clean illustrative composition',
      'pregunta-clave': 'A single question written on a large blank sticky note on a wall, a preteen standing in front of it thinking, workshop room',
      'dibujo-maqueta': 'A rough pencil sketch and a small cardboard mockup side by side on a work table, clearly early stage, natural light',
      'preventa-anticipo': 'A customer handing over a small deposit to a young entrepreneur who is writing their name on a list, market setting',
      'precio-por-capas': 'Three stacked layers drawn on paper representing cost, margin and final price, a pencil resting on the diagram, top down view',
      'descuento-miedo': 'A shop owner hastily writing a large blank discount sign in an empty store with no customers, anxious body language',
      'tablero-cuatro': 'Four simple gauges or dials drawn on a whiteboard in a small business back room, blank faces, clean layout',
      'clientes-vuelven': 'A small shop where several familiar customers greet the owner by name, warm regular clientele atmosphere, Mexican neighbourhood store',
      'letra-pequena-etica': 'A contract on a desk with a magnifying glass over the bottom section, the text blank, formal office setting',
    },
    laminas: [
      'app-gratis', 'cinco-piezas', 'mismo-producto', 'ingreso-mayor-costo', 'pregunta-clave',
      'dibujo-maqueta', 'preventa-anticipo', 'precio-por-capas', 'descuento-miedo', 'tablero-cuatro',
      'clientes-vuelven', 'letra-pequena-etica',
    ],
    bloques: [
      {
        paso: 0,
        fondo: 'app-gratis',
        tomas: [
          'Muchas ideas mueren sin que el producto tuviera nada de malo.',
          { t: 'Mueren porque nadie definió quién iba a pagar, y por qué.', recorte: [0.5, 0.5, 0.6] },
          'Y hay algo que confunde a casi todos al empezar.',
          { t: 'Quien usa el producto no siempre es quien paga.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'cinco-piezas',
        tomas: [
          'Un modelo de negocio cabe en cinco preguntas.',
          { t: 'Quién es el cliente. Qué problema le resuelvo. Cómo le entrego ese valor.', recorte: [0.4, 0.5, 0.7] },
          { t: 'Cuánto y de qué forma me paga. Y qué me cuesta entregarlo.', recorte: [0.65, 0.5, 0.7] },
          { t: 'Con esas cinco respuestas, una idea deja de ser una intención.', fondo: 'mismo-producto' },
          { t: 'Y el mismo producto admite varios modelos: venderse una vez, cobrarse por suscripción, ser gratis con funciones de pago.', fondo: 'mismo-producto' },
          { t: 'Ninguno es correcto en abstracto. Depende del cliente y del costo.', fondo: 'mismo-producto' },
          { t: 'Pero todos pasan una prueba elemental.', fondo: 'ingreso-mayor-costo' },
          { t: 'Lo que recibes por cliente debe superar lo que te cuesta atenderlo.', fondo: 'ingreso-mayor-costo', rotulo: 'Ingreso > costo' },
          { t: 'Si cada venta deja pérdida, vender más solo agranda el problema.', fondo: 'ingreso-mayor-costo', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'pregunta-clave',
        tomas: [
          'Prototipar no es hacer una versión chiquita del producto.',
          { t: 'Es responder la pregunta más importante de tu idea con lo mínimo posible.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Y el error más común es empezar a construir sin saber qué se quiere averiguar.' },
          { t: 'Primero se escribe la pregunta clave: la que, si se responde que no, tumba la idea entera.' },
          { t: 'A veces se responde con un dibujo.', fondo: 'dibujo-maqueta' },
          { t: 'El dibujo responde si la gente entiende la idea. El servicio hecho a mano responde si sirve.', fondo: 'dibujo-maqueta' },
          { t: 'Pero hay una prueba más honesta que todas.', fondo: 'preventa-anticipo' },
          { t: 'Preguntar si alguien compraría produce respuestas amables. Pedir un anticipo produce respuestas verdaderas.', fondo: 'preventa-anticipo' },
          { t: 'Y el criterio de éxito se escribe antes. Si tres de diez apartan, seguimos.', fondo: 'preventa-anticipo' },
          { t: 'Sin ese criterio de antemano, cualquier resultado se interpreta como bueno.', fondo: 'preventa-anticipo', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'precio-por-capas',
        tomas: [
          'Poner precio es de las decisiones más difíciles.',
          { t: 'Muy alto y no vendes. Muy bajo y vendes perdiendo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Se construye por capas. El costo por unidad es el piso absoluto.', rotulo: 'El costo es el piso' },
          { t: 'Material más la parte proporcional de permisos, transporte y empaque.' },
          { t: 'Encima va el margen, y el resultado se compara con lo que cobra el mercado.' },
          { t: 'Hay tres descuentos que sirven.', fondo: 'descuento-miedo' },
          { t: 'Por volumen, de temporada, y para clientes frecuentes. Los tres tienen un propósito.', fondo: 'descuento-miedo' },
          { t: 'Y hay un cuarto que aparece solo: el descuento por miedo.', fondo: 'descuento-miedo', recorte: [0.5, 0.5, 0.6] },
          { t: 'El que se da cuando no se vende y se busca cualquier salida. Casi nunca funciona.', fondo: 'descuento-miedo' },
          { t: 'Porque si nadie compra, el problema rara vez era el precio.', fondo: 'descuento-miedo', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'tablero-cuatro',
        tomas: [
          'Si te preguntan cómo va tu negocio y respondes bien, no dijiste nada.',
          { t: 'Un negocio se responde con cuatro números.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Ventas: cuánto entró. Margen: cuánto quedó.' },
          { t: 'Clientes: a cuántos llegué. Y recurrencia: cuántos volvieron.' },
          { t: 'El último es el más ignorado y el más revelador.', fondo: 'clientes-vuelven' },
          { t: 'Si muchos prueban y ninguno regresa, el problema no es de publicidad. Es del producto.', fondo: 'clientes-vuelven' },
          { t: 'Y falta lo que ningún indicador mide.', fondo: 'letra-pequena-etica' },
          { t: 'Hay cosas perfectamente legales que están mal. La letra pequeña que esconde condiciones.', fondo: 'letra-pequena-etica', recorte: [0.5, 0.5, 0.6] },
          { t: 'La ley es el piso, no la meta.', fondo: 'letra-pequena-etica' },
          { t: 'Tres pruebas. Estarías cómodo si todos tus clientes supieran exactamente lo que hiciste.', fondo: 'letra-pequena-etica' },
          { t: 'Aceptarías que te lo hicieran a ti en la misma situación.', fondo: 'letra-pequena-etica' },
          { t: 'Y qué pasaría si todos los negocios hicieran lo mismo.', fondo: 'letra-pequena-etica' },
          { t: 'Define quién paga. Pide un anticipo. Y mide la recurrencia.', fondo: 'clientes-vuelven', respiro: 1.2 },
        ],
      },
    ],
  },

  /* ── RETO SUPREMO · Inversor A-10 ──────────────────────────────────────────
     Cincuenta mil pesos, diez meses, entre CETES, acciones y FIBRAS. */
  {
    id: 'p5-supremo',
    titulo: 'Inversor A-10',
    imagenes: {
      'portafolio-inicio': 'A clean desk with a laptop showing a blank portfolio dashboard, a notebook and a pen, morning light, focused workspace',
      'tres-instrumentos': 'Three distinct containers on a table, each holding a different amount, arranged left to right by size, clean illustrative composition',
      'mes-malo': 'A screen showing a sharply falling line, a preteen watching it with a tense expression, dim room',
      'mes-bueno': 'The same screen showing a recovering rising line, the same preteen visibly relieved, warm light returning',
      'diez-meses': 'Ten small markers arranged in a row along a drawn timeline on paper, a pencil marking one of them, top down view',
      'cierre-portafolio': 'A preteen closing a notebook beside a laptop with a completed dashboard, calm satisfaction, end of day light',
    },
    laminas: ['portafolio-inicio', 'tres-instrumentos', 'mes-malo', 'mes-bueno', 'diez-meses', 'cierre-portafolio'],
    bloques: [
      {
        paso: 0,
        fondo: 'portafolio-inicio',
        tomas: [
          'Este es tu Reto Supremo.',
          { t: 'Cincuenta mil pesos. Diez meses.', cifra: ['50000', 'de portafolio'], recorte: [0.5, 0.5, 0.6] },
          { t: 'Y ninguna forma de saber qué va a pasar el mes que viene.', respiro: 0.9 },
        ],
      },
      {
        paso: 1,
        fondo: 'tres-instrumentos',
        tomas: [
          'Tres instrumentos, tres perfiles distintos.',
          { t: 'Cetes, que casi no varían. Acciones, que pueden dar mucho o caer fuerte. Y fibras, en medio.', recorte: [0.5, 0.5, 0.8] },
          { t: 'A mayor rendimiento, mayor riesgo. También aquí.', respiro: 0.9 },
        ],
      },
      {
        paso: 2,
        fondo: 'mes-malo',
        tomas: [
          'Va a haber un mes malo. Siempre lo hay.',
          { t: 'Y ahí es donde se pierde el juego: vendiendo con miedo.', recorte: [0.5, 0.5, 0.6] },
          { t: 'Vender en la caída convierte una pérdida temporal en una definitiva.', respiro: 0.9 },
        ],
      },
      {
        paso: 3,
        fondo: 'diez-meses',
        tomas: [
          'Diez meses es un horizonte corto.',
          { t: 'Por eso no puedes poner los cincuenta mil en lo más volátil.', recorte: [0.5, 0.5, 0.62] },
          { t: 'El plazo del instrumento nunca debe pasar del horizonte de la meta.', respiro: 0.9 },
        ],
      },
      {
        paso: 4,
        fondo: 'cierre-portafolio',
        tomas: [
          'Gana quien llega al mes diez con el portafolio de pie.',
          { t: 'No quien acertó un mes espectacular.', fondo: 'mes-bueno' },
          { t: 'Reparte. Aguanta. Y decide antes, no en el peor día.', fondo: 'cierre-portafolio', respiro: 1.2 },
        ],
      },
    ],
  },
];

export default ARGUMENTOS;
