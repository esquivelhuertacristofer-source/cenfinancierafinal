# CEN Academy — Auditoría + Upgrade V2
> Documento para Gemini: correcciones, mejoras y estándares elevados para las 360 actividades

---

## DIAGNÓSTICO: Problemas críticos encontrados

### 1. Unidades mal asignadas (corregir primero)
Gemini inventó nuevas unidades en lugar de seguir el currículo real. Estos archivos tienen el `unit_title` INCORRECTO:

| Archivo | Título actual (MALO) | Título correcto |
|---------|---------------------|-----------------|
| `act-p5-1-1-a.json` | "El sistema financiero global" | "El Banco de México: el cerebro del dinero" |
| `act-s2-4-1-a.json` | "El patrimonio neto: mi valor real" | "Business Model Canvas avanzado: los 9 bloques en práctica" |
| `act-s3-2-4-a.json` | "gobierno corporativo y ética" | "Independencia financiera acelerada: el concepto FIRE" |
| `act-s2-1-5-a.json` | "Construyendo una estrategia de trading" | "Crisis económicas: lecciones del 94, 2008 y 2020 en México" |
| `act-p5-4-5-a.json` | "Mi Portafolio de Graduación" | "Shark Tank CEN: la hora de la verdad" |

**Acción:** Revisar TODOS los 343 archivos y corregir `unit_code`, `unit_title` y `level` para que coincidan exactamente con el currículo oficial del archivo `src/data/pedagogia/`.

### 2. Simuladores sin profundidad
- Máximo 3 inputs, sin aportaciones mensuales
- Fórmulas que ignoran variables clave (inflación, aportaciones periódicas)
- Sin modo comparativo (escenario A vs B)
- El interés compuesto (`act-p4-3-3`) no incluye aportación mensual — el concepto más importante

### 3. CONSTRUCTOR = formularios vacíos
- Los pasos son campos de texto sin output visual
- No hay preview del documento construyéndose en vivo
- Sin validación cruzada entre campos
- P5-4-5 ("Shark Tank") terminó siendo 3 textareas de reflexión — completamente inútil

### 4. Stories demasiado cortas
- Solo 2-3 nodos = 1-2 clics y terminó
- Sin consecuencias numéricas (no se dice "perdiste $30,000 por esa decisión")
- Sin "fast forward" a 5 años mostrando el impacto real

### 5. Quiz/Trivia sin preguntas reales
- Muchos archivos de QUIZ no tienen el array `preguntas` con contenido real
- Las trivia no tienen las 10 preguntas definidas

---

## ESTÁNDAR DE CALIDAD — Lo que debe cumplir cada actividad

Una actividad de calidad **toma entre 5-15 minutos** en completarse y cumple al menos 4 de estos criterios:

- [ ] **Multi-fase**: tiene 3+ fases o etapas distintas con objetivos separados
- [ ] **Consecuencial**: una decisión/input cambia visiblemente el resultado
- [ ] **Numérico**: requiere calcular, comparar o interpretar números
- [ ] **Personal**: el alumno ingresa datos propios o toma decisiones propias
- [ ] **Narrativa**: tiene un personaje, contexto o historia de fondo
- [ ] **Revelador**: genera un "aha moment" — el resultado sorprende al alumno
- [ ] **Exportable**: produce algo que el alumno puede mostrar (certificado, plan, gráfica)

---

## PRINCIPIOS DE DISEÑO POR TIPO DE ACTIVIDAD

### 💰 SIMULADOR — Nivel Excelente
**Mínimo requerido:** 4 inputs, 2 salidas, modo comparativo, gráfica temporal, 4 escenarios

El simulador debe seguir este patrón:
```
Fase 1: "Tu situación actual" (inputs con valores por defecto realistas)
Fase 2: "Resultado proyectado" (gráfica + número grande + insight)
Fase 3: "¿Qué pasa si...?" (slider de optimización que muestra mejora)
Fase 4: Completar con reflexión de 1 pregunta
```

**Fórmulas que DEBEN tener todos los simuladores de ahorro/inversión:**
```js
// Con aportaciones mensuales (obligatorio en P4+):
VF = capital * pow(1+r,n) + aportacion * 12 * ((pow(1+r,n)-1)/r)
// Ajustado por inflación:
VF_real = VF / pow(1+inflacion, n)
// Patrimonio neto:
PN = activos_liquidos + activos_fijos - deudas_CP - deudas_LP
```

**Lo que hace que un simulador tome TIEMPO:**
1. Al mover el slider de "años" de 10→40, la gráfica explota visualmente
2. Hay un botón "Optimizar por mí" que muestra el escenario ideal
3. Existe una comparativa: "Con tu plan actual vs. si empezaras hoy"
4. Una notificación aparece al cruzar hitos: "$1,000,000 MXN alcanzado"
5. Hay un modo "¿Qué te costó esperar 5 años?" que revela el costo de oportunidad

### 📝 QUIZ — Nivel Excelente
**Mínimo requerido:** 8 preguntas reales escritas, incluir 2 de cálculo y 2 de análisis de caso

Tipos de preguntas que generan profundidad:
- **Tipo caso**: "Lee este estado de cuenta → ¿cuál es el CAT real?"
- **Tipo cálculo**: "Si inviertes $2,000/mes al 8% anual durante 15 años, ¿cuánto tendrás?"
- **Tipo trampa**: "¿Cuál de estas afirmaciones es FALSA?" (requiere leer bien)
- **Tipo comparativo**: "¿Qué opción conviene más financieramente y por qué?"

Nunca: preguntas de definición pura ("¿Qué es el PIB?") sin contexto de aplicación.

### 🧩 ARRASTRA — Nivel Excelente
**Mínimo requerido:** 12 items, 3+ categorías, feedback educativo por item, hint en errores

Variantes que agregan profundidad:
- **Secuenciar**: ordenar pasos cronológicamente (más difícil que clasificar)
- **Multi-tag**: un item puede pertenecer a 2 categorías (requiere pensar más)
- **Con penalización**: error resta puntos — obliga a pensar antes de arrastrar
- **Cronometrado** (en niveles S): 90 segundos para clasificar todo

### 🗺️ DECIDE — Nivel Excelente
**Mínimo requerido:** 5 decisiones (nodos), 3 finales distintos, consecuencias en $, reflexión final

El árbol debe mostrar:
```
Inicio → Decisión 1 → Rama A o Rama B
  Rama A → Decisión 2A → Final Bueno o Decisión 3A
  Rama B → Decisión 2B → Final Malo
  Rama A+Decisión 3A → Final Excelente o Final Regular
```

**Consecuencias numéricas obligatorias en P4+:**
- "Elegiste no ahorrar → Después de 10 años tienes $45,000 vs $380,000 si hubieras invertido"
- Mostrar delta numérico entre caminos en la pantalla de final

**El "Fast Forward" mechanic:**
Al llegar a un nodo final, mostrar:
- Edad actual del personaje vs. edad con esa decisión acumulada
- Patrimonio neto comparativo
- Una lista de 3 cosas que cambió en su vida

### 🏗️ CONSTRUCTOR — Nivel Excelente
**Mínimo requerido:** 5 pasos, output visual en vivo, validación cruzada, exportable

El Constructor NO es un formulario. Es un **workspace en dos columnas**:
- Columna izquierda: campos de entrada por paso
- Columna derecha: preview del documento construyéndose en tiempo real

Tipos de Constructor que generan valor real:
1. **Plan financiero**: construye un PDF descargable con secciones
2. **Canvas**: los 9 bloques del BMC llenándose visualmente
3. **Dashboard**: KPIs que se llenan y muestran gráficas
4. **Presupuesto**: tabla que suma automáticamente con alertas de exceso
5. **Portafolio**: pie chart que se forma con cada activo añadido

**Validaciones cruzadas obligatorias:**
- Gastos > Ingresos → bloquear avance con alerta
- Riesgo alto + perfil conservador → advertencia
- Deuda > 40% ingreso → "Zona de peligro" en rojo

### 🎯 TRIVIA — Nivel Excelente
**Mínimo requerido:** 10 preguntas ESCRITAS en el JSON con las 4 opciones cada una

La trivia se vuelve profunda con:
- **Dato curioso** después de cada respuesta (incluso si acertaste)
- **Categorías temáticas** dentro de la misma trivia
- **Multiplicador de racha** que se acumula visualmente
- Preguntas de dificultad creciente (las últimas 3 son más difíciles)
- Comparativa con el promedio de la clase al final

### 🎮 JUEGO — Nivel Excelente
El juego debe tener:
- **3 niveles de dificultad** que se desbloquean al superar el anterior
- **Vidas** (3 vidas, no solo tiempo)
- **Power-ups** ganados por racha: congelar tiempo, eliminar opción incorrecta
- **Tabla de récords** personal y global
- Temática financiera integrada al mecánica (no solo skin)

### 🎲 RULETA — Nivel Excelente
- 8 sectores en el JSON (se sortean 5 por sesión → rejugabilidad)
- Cada escenario tiene 3 opciones con explicación de por qué una es mejor
- Al final: "Resumen de tus decisiones" con score y consejo personalizado
- Temas de los sectores deben variar: gasto/ahorro/inversión/deuda/emprendimiento

---

## CORRECCIONES COMPLETAS — Las 30 actividades ⭐

### ⭐ ACT-P4-3-3-A — Interés Compuesto (REEMPLAZAR COMPLETO)
**Problema actual:** Solo 3 inputs, sin aportación mensual, sin comparativa.
**Nuevo enfoque:** 5 inputs, comparativa lineal vs compuesto, costo de esperar 5 años, milestone de $1M.

```json
{
  "code": "ACT-P4-3-3-A",
  "unit_code": "P4-3-3",
  "unit_title": "El interés compuesto: la magia de hacer crecer tu dinero",
  "level": "P4", "edad": "9-10 años", "tipo": "SIMULADOR", "complejidad": "ALTO",
  "titulo": "La Bola de Nieve Imparable",
  "descripcion": "¿Sabías que Einstein llamó al interés compuesto 'la octava maravilla del mundo'? Mueve los controles y mira cómo el tiempo multiplica tu dinero de forma exponencial — luego descubre cuánto te CUESTA esperar 5 años más.",
  "objetivo": "Visualizar la diferencia entre crecimiento lineal y exponencial y el costo de oportunidad del tiempo",
  "xp": 250,
  "descripcion_formula": "VF = Capital × (1+r)^n + Aportación×12 × ((1+r)^n - 1) / r",
  "inputs": [
    { "id": "capital", "label": "Capital inicial hoy", "type": "slider", "min": 1000, "max": 50000, "step": 1000, "default": 10000, "unit": "$" },
    { "id": "aportacion", "label": "Ahorro mensual", "type": "slider", "min": 0, "max": 3000, "step": 100, "default": 500, "unit": "$" },
    { "id": "tasa", "label": "Rendimiento anual", "type": "slider", "min": 4, "max": 18, "step": 0.5, "default": 10, "unit": "%" },
    { "id": "anos", "label": "Años de inversión", "type": "slider", "min": 5, "max": 40, "step": 1, "default": 20, "unit": "años" },
    { "id": "inflacion", "label": "Inflación anual estimada", "type": "slider", "min": 3, "max": 9, "step": 0.5, "default": 4.5, "unit": "%" }
  ],
  "formula": "capital * Math.pow(1+tasa/100, anos) + aportacion*12 * ((Math.pow(1+tasa/100, anos)-1)/(tasa/100))",
  "formula_simple": "capital + aportacion*12*anos",
  "formula_real": "(capital * Math.pow(1+tasa/100, anos) + aportacion*12 * ((Math.pow(1+tasa/100, anos)-1)/(tasa/100))) / Math.pow(1+inflacion/100, anos)",
  "output_label": "Tu dinero con interés compuesto",
  "output_prefix": "$", "output_suffix": " MXN",
  "chart_type": "line",
  "chart_series": [
    { "id": "compuesto", "label": "Interés Compuesto", "color": "#FF8C00" },
    { "id": "simple", "label": "Ahorro sin invertir", "color": "#334155" },
    { "id": "real", "label": "Valor real (ajustado inflación)", "color": "#22c55e" }
  ],
  "milestones": [
    { "valor": 100000, "mensaje": "🎯 ¡Primer Millón de centavos! Vas por buen camino" },
    { "valor": 500000, "mensaje": "🚀 ¡Medio millón! La bola de nieve está rodando fuerte" },
    { "valor": 1000000, "mensaje": "💎 ¡MILLONARIO! Einstein tenía razón" }
  ],
  "comparativa_espera": {
    "titulo": "¿Cuánto te CUESTA esperar 5 años más?",
    "descripcion": "Si empezaras dentro de 5 años con el mismo plan, este sería tu resultado final:",
    "formula_penalizacion": "capital * Math.pow(1+tasa/100, Math.max(0,anos-5)) + aportacion*12 * ((Math.pow(1+tasa/100, Math.max(0,anos-5))-1)/(tasa/100))"
  },
  "escenarios": [
    { "condicion": "resultado > 1000000", "mensaje": "💎 ¡Club de los millonarios! El interés compuesto te llevó hasta aquí.", "tipo": "success" },
    { "condicion": "resultado > 500000", "mensaje": "🚀 ¡Poderoso! Tienes base sólida para la independencia financiera.", "tipo": "success" },
    { "condicion": "anos < 15", "mensaje": "⏰ Revelación: si añades 10 años más al slider, tu dinero NO se duplica — se CUADRUPLICA.", "tipo": "info" },
    { "condicion": "aportacion === 0", "mensaje": "💡 Prueba a poner $500/mes de aportación. El resultado te va a sorprender mucho.", "tipo": "warning" }
  ],
  "pregunta_reflexion": "Ahora que ves estos números, ¿a qué edad quisieras haber empezado a invertir? ¿Qué harías diferente?",
  "versión": "2026.Diamond.V2"
}
```

### ⭐ ACT-P5-1-1-A — Gobernador de Banxico (REEMPLAZAR COMPLETO)

```json
{
  "code": "ACT-P5-1-1-A",
  "unit_code": "P5-1-1",
  "unit_title": "El Banco de México: el cerebro del dinero",
  "level": "P5", "edad": "10-11 años", "tipo": "SIMULADOR", "complejidad": "ALTO",
  "titulo": "Gobernador de Banxico",
  "descripcion": "Acabas de ser nombrado Gobernador del Banco de México. Tu única misión: mantener la inflación entre 2% y 4%. Cada decisión sobre la tasa de interés tiene consecuencias en millones de familias mexicanas. ¿Estás listo?",
  "objetivo": "Entender cómo la tasa de interés de Banxico controla la inflación y su impacto en la vida cotidiana",
  "xp": 300,
  "modo": "multi_trimestre",
  "trimestres": 4,
  "descripcion_formula": "Modelo macroeconómico simplificado: tasa alta → crédito caro → menos gasto → inflación baja (pero más desempleo). Tasa baja → crédito barato → más gasto → inflación sube (pero más empleo).",
  "inputs": [
    { "id": "tasa", "label": "Tasa de interés objetivo (%)", "type": "slider", "min": 3, "max": 15, "step": 0.25, "default": 11.25, "unit": "%" }
  ],
  "variables_estado": {
    "inflacion_inicial": 5.5,
    "desempleo_inicial": 3.8,
    "crecimiento_inicial": 1.2,
    "tipo_cambio_inicial": 17.5
  },
  "formula_trimestre": "{ inflacion: Math.max(1.5, Math.min(12, estado.inflacion + (tasa < 8 ? 0.8 : tasa > 12 ? -0.7 : -0.1) + (Math.random()*0.4-0.2)), desempleo: Math.max(2, Math.min(9, estado.desempleo + (tasa > 10 ? 0.3 : -0.2) + (Math.random()*0.3-0.15))), crecimiento: Math.max(-2, Math.min(5, estado.crecimiento + (tasa < 8 ? 0.4 : tasa > 12 ? -0.5 : 0.1) + (Math.random()*0.3-0.15))), tipo_cambio: estado.tipo_cambio * (tasa > 10 ? 0.98 : 1.03) }",
  "output_label": "Indicadores económicos de México",
  "chart_type": "line",
  "chart_series": [
    { "id": "inflacion", "label": "Inflación (%)", "color": "#ef4444", "meta_min": 2, "meta_max": 4 },
    { "id": "desempleo", "label": "Desempleo (%)", "color": "#f59e0b" },
    { "id": "crecimiento", "label": "Crecimiento PIB (%)", "color": "#22c55e" }
  ],
  "noticias_aleatorias": [
    { "trimestre": 2, "evento": "🌎 Crisis en EE.UU.: la Fed sube su tasa", "impacto": { "inflacion": +1.2, "tipo_cambio": +2.5 } },
    { "trimestre": 3, "evento": "💰 Inversión extranjera récord en manufactura", "impacto": { "crecimiento": +0.8, "tipo_cambio": -1.5 } },
    { "trimestre": 4, "evento": "🛢️ Sube el precio del petróleo", "impacto": { "inflacion": +0.8 } }
  ],
  "escenarios": [
    { "condicion": "inflacion_promedio < 4 && inflacion_promedio > 2 && desempleo_promedio < 5", "mensaje": "🏆 Mandato cumplido. Eres el mejor gobernador que ha tenido Banxico. Inflación dentro del objetivo.", "tipo": "success" },
    { "condicion": "inflacion_promedio > 7", "mensaje": "🔥 Hiperinflación. Los mexicanos ya no pueden comprar comida básica. Debiste subir la tasa antes.", "tipo": "danger" },
    { "condicion": "desempleo_promedio > 7", "mensaje": "📉 Millones sin trabajo. La tasa estaba demasiado alta — el crédito se congeló.", "tipo": "danger" },
    { "condicion": "crecimiento_promedio < 0", "mensaje": "⚠️ Recesión. La economía se contrajo. Fue demasiado restrictivo.", "tipo": "warning" }
  ],
  "calificacion_final": {
    "Gobernador Estelar": { "condicion": "inflacion_prom < 4 && inflacion_prom > 2", "xp_bonus": 150 },
    "Gobernador Aceptable": { "condicion": "inflacion_prom < 5", "xp_bonus": 75 },
    "Gobernador Reprobado": { "condicion": "inflacion_prom >= 5", "xp_bonus": 0 }
  },
  "versión": "2026.Diamond.V2"
}
```

### ⭐ ACT-S3-2-4-A — Calculadora FIRE (REEMPLAZAR — CONTENIDO COMPLETAMENTE EQUIVOCADO)

```json
{
  "code": "ACT-S3-2-4-A",
  "unit_code": "S3-2-4",
  "unit_title": "Independencia financiera acelerada: el concepto FIRE",
  "level": "S3", "edad": "14-15 años", "tipo": "SIMULADOR", "complejidad": "ALTO",
  "titulo": "Calculadora FIRE: Tu Fecha de Libertad",
  "descripcion": "FIRE = Financial Independence, Retire Early. Existe una fórmula matemática exacta que dice cuándo puedes dejar de trabajar para siempre. Esta calculadora te da tu fecha real de libertad financiera. Prepárate para que los números te sorprendan.",
  "objetivo": "Calcular el número FIRE personal y entender cómo la tasa de ahorro determina el tiempo hasta la independencia financiera",
  "xp": 300,
  "descripcion_formula": "Número FIRE = Gastos anuales × 25 (Regla del 4%). Tiempo de FIRE según portfolio growth.",
  "inputs": [
    { "id": "edad", "label": "Tu edad actual", "type": "slider", "min": 14, "max": 35, "step": 1, "default": 15, "unit": "años" },
    { "id": "ingreso", "label": "Ingreso mensual (actual o esperado al trabajar)", "type": "slider", "min": 5000, "max": 120000, "step": 2500, "default": 20000, "unit": "$" },
    { "id": "gastos_retiro", "label": "Gastos mensuales que quieres en el retiro", "type": "slider", "min": 5000, "max": 80000, "step": 1000, "default": 25000, "unit": "$" },
    { "id": "tasa_ahorro", "label": "% de tu ingreso que ahorras e inviertes", "type": "slider", "min": 5, "max": 80, "step": 5, "default": 30, "unit": "%" },
    { "id": "rendimiento", "label": "Rendimiento anual de inversiones", "type": "slider", "min": 5, "max": 15, "step": 0.5, "default": 8, "unit": "%" },
    { "id": "patrimonio_actual", "label": "Inversiones que ya tienes hoy", "type": "slider", "min": 0, "max": 500000, "step": 5000, "default": 0, "unit": "$" }
  ],
  "formula": "gastos_retiro * 12 * 25",
  "formula_anos": "Math.log(1 + (gastos_retiro*12*25 - patrimonio_actual) * (rendimiento/100) / (ingreso * tasa_ahorro/100 * 12)) / Math.log(1 + rendimiento/100)",
  "outputs": [
    { "id": "fire_number", "label": "Tu Número FIRE (lo que necesitas acumular)", "prefix": "$", "formula": "gastos_retiro*12*25" },
    { "id": "edad_retiro", "label": "Edad en que te retiras", "suffix": " años", "formula": "edad + Math.ceil(Math.log(1 + (gastos_retiro*12*25 - patrimonio_actual) * (rendimiento/100) / (ingreso * tasa_ahorro/100 * 12)) / Math.log(1 + rendimiento/100))" },
    { "id": "anos_libertad", "label": "Años trabajando hasta retirarte", "suffix": " años", "formula": "Math.ceil(Math.log(1 + (gastos_retiro*12*25 - patrimonio_actual) * (rendimiento/100) / (ingreso * tasa_ahorro/100 * 12)) / Math.log(1 + rendimiento/100))" }
  ],
  "comparativas": [
    { "id": "escenario_20pct", "label": "Si ahorras solo 20%", "descripcion": "Qué edad tendrías si solo ahorraras el 20%" },
    { "id": "escenario_50pct", "label": "Si ahorras el 50%", "descripcion": "Qué edad tendrías con una tasa de ahorro del 50%" }
  ],
  "tabla_tasas_ahorro": {
    "titulo": "La tabla que cambia vidas: tasa de ahorro → años para FIRE",
    "filas": [
      { "tasa": 10, "anos_aproximados": 43 },
      { "tasa": 20, "anos_aproximados": 32 },
      { "tasa": 30, "anos_aproximados": 25 },
      { "tasa": 40, "anos_aproximados": 19 },
      { "tasa": 50, "anos_aproximados": 14 },
      { "tasa": 60, "anos_aproximados": 10 },
      { "tasa": 70, "anos_aproximados": 7 }
    ]
  },
  "escenarios": [
    { "condicion": "anos_libertad < 15", "mensaje": "🔥 ¡FIRE extremo! Con esa tasa de ahorro te retiras antes de los 30. Eres una máquina.", "tipo": "success" },
    { "condicion": "anos_libertad < 25", "mensaje": "💪 ¡Buen camino FIRE! Te retiras antes que el 95% de la gente.", "tipo": "success" },
    { "condicion": "tasa_ahorro < 20", "mensaje": "📊 Dato impactante: si subes tu tasa de ahorro de 20% a 40%, reduces tu tiempo de trabajo a la MITAD.", "tipo": "info" },
    { "condicion": "anos_libertad > 40", "mensaje": "⏰ Con esta tasa de ahorro trabajarás hasta los 65. Sube el slider de ahorro para ver el cambio.", "tipo": "warning" }
  ],
  "pregunta_reflexion": "Tu número FIRE es el dinero que necesitas para no trabajar nunca más. ¿Te parece alcanzable? ¿Qué cambiarías en tu plan de vida para lograrlo antes?",
  "versión": "2026.Diamond.V2"
}
```

### ⭐ ACT-P5-4-5-A — Shark Tank CEN (REEMPLAZAR — era solo 3 textareas)

```json
{
  "code": "ACT-P5-4-5-A",
  "unit_code": "P5-4-5",
  "unit_title": "Shark Tank CEN: la hora de la verdad",
  "level": "P5", "edad": "10-11 años", "tipo": "CONSTRUCTOR", "complejidad": "ALTO",
  "titulo": "Shark Tank CEN",
  "descripcion": "Tienes exactamente 3 minutos para presentar tu negocio ante 4 tiburones inversores. Cada uno tiene $500,000 MXN para invertir — pero son implacables. ¿Tu idea resiste el escrutinio?",
  "objetivo": "Construir y defender un pitch de inversión completo con proyecciones financieras reales",
  "xp": 400,
  "output_type": "Deck de Inversión",
  "exportable": true,
  "pasos": [
    {
      "id": "el_problema",
      "titulo": "🎯 El Problema (30 segundos)",
      "descripcion": "Los tiburones solo invierten en problemas REALES que afectan a muchas personas.",
      "campos": [
        { "id": "problema", "label": "¿Qué problema resuelves? (sé específico)", "type": "textarea", "placeholder": "Ej: 'Los estudiantes de secundaria pierden 2 horas semanales buscando apuntes desorganizados...'", "requerido": true, "min_palabras": 20 },
        { "id": "afectados", "label": "¿A cuántas personas afecta este problema? (en México)", "type": "select", "opciones": ["Miles (miles de personas)", "Cientos de miles", "Millones", "Más de 10 millones"], "requerido": true },
        { "id": "urgencia", "label": "¿Qué tan urgente es resolverlo?", "type": "select", "opciones": ["Lo necesitan HOY", "Lo necesitan este año", "Sería una mejora gradual"], "requerido": true }
      ]
    },
    {
      "id": "la_solucion",
      "titulo": "💡 Tu Solución (30 segundos)",
      "descripcion": "¿Qué tienes TÚ que nadie más tiene?",
      "campos": [
        { "id": "solucion", "label": "Tu producto o servicio en una oración", "type": "text", "placeholder": "Ej: 'Una app que organiza automáticamente los apuntes en categorías con IA'", "requerido": true },
        { "id": "diferenciador", "label": "¿Por qué tu solución es mejor que las existentes?", "type": "textarea", "placeholder": "Los tiburones SIEMPRE preguntan '¿Por qué no Google?' Responde eso.", "requerido": true },
        { "id": "traccion", "label": "¿Ya tienes clientes o usuarios?", "type": "select", "opciones": ["Sí, tengo X clientes pagando", "Tengo usuarios en beta gratis", "Tengo una lista de espera", "Todavía es una idea"], "requerido": true }
      ]
    },
    {
      "id": "los_numeros",
      "titulo": "📊 Los Números (60 segundos — los más importantes)",
      "descripcion": "Los tiburones viven en Excel. Si no tienes números, no hay inversión.",
      "campos": [
        { "id": "precio_unitario", "label": "Precio de venta por unidad/suscripción ($MXN)", "type": "number", "min": 1, "max": 99999, "requerido": true },
        { "id": "costo_unitario", "label": "Costo de producir/entregar cada unidad ($MXN)", "type": "number", "min": 0, "max": 99999, "requerido": true },
        { "id": "clientes_meta_y1", "label": "Meta de clientes en el Año 1", "type": "number", "min": 1, "max": 1000000, "requerido": true },
        { "id": "inversion_pedida", "label": "¿Cuánto dinero pides a los tiburones? ($MXN)", "type": "slider", "min": 50000, "max": 2000000, "step": 50000, "default": 500000, "unit": "$" },
        { "id": "porcentaje_ofrecido", "label": "¿Qué % de la empresa ofreces a cambio?", "type": "slider", "min": 5, "max": 49, "step": 1, "default": 20, "unit": "%" }
      ],
      "calculos_automaticos": [
        { "id": "margen_bruto", "label": "Tu margen bruto por unidad", "formula": "precio_unitario - costo_unitario", "prefix": "$" },
        { "id": "revenue_y1", "label": "Ingresos proyectados Año 1", "formula": "precio_unitario * clientes_meta_y1", "prefix": "$" },
        { "id": "valuacion_implicita", "label": "Valuación implícita de tu empresa", "formula": "inversion_pedida / (porcentaje_ofrecido/100)", "prefix": "$" },
        { "id": "multiplo_ventas", "label": "Múltiplo de ventas (valuación/ingresos Y1)", "formula": "(inversion_pedida / (porcentaje_ofrecido/100)) / (precio_unitario * clientes_meta_y1)", "suffix": "x" }
      ]
    },
    {
      "id": "el_equipo",
      "titulo": "👥 El Equipo (30 segundos)",
      "descripcion": "Los tiburones dicen: 'Invierto en personas, no en ideas.'",
      "campos": [
        { "id": "tu_rol", "label": "¿Cuál es TU superpoder en este negocio?", "type": "text", "placeholder": "Ej: 'Soy el mejor programador de mi generación' o 'Conozco a todos los clientes potenciales'", "requerido": true },
        { "id": "socios", "label": "¿Tienes socios? ¿Qué habilidad aportan?", "type": "textarea", "placeholder": "Si vas solo, explica por qué puedes hacerlo solo.", "requerido": false }
      ]
    },
    {
      "id": "la_oferta",
      "titulo": "🤝 Cierre del Deal (30 segundos)",
      "descripcion": "Llegó el momento. Presenta tu oferta final y maneja las objeciones.",
      "campos": [
        { "id": "uso_del_dinero", "label": "¿En qué exactamente gastas los $500,000 que pides?", "type": "textarea", "placeholder": "Marketing: $200k / Tecnología: $150k / Equipo: $150k — Los tiburones necesitan saber que no malgastarás.", "requerido": true },
        { "id": "objecion_precio", "label": "Un tiburón dice: 'Tu valuación está inflada.' ¿Qué respondes?", "type": "textarea", "placeholder": "Defiende tu valuación con datos o negocia inteligentemente...", "requerido": true }
      ]
    }
  ],
  "evaluacion_tiburones": [
    { "tiburon": "Rodrigo (El Financiero)", "evalua": ["margen_bruto", "valuacion_implicita"], "critica_si_malo": "Tu margen es demasiado bajo. Con menos del 40% no puedes crecer." },
    { "tiburon": "Elena (La Marketera)", "evalua": ["problema", "diferenciador"], "critica_si_malo": "No veo diferenciación real. El mercado tiene 10 apps así ya." },
    { "tiburon": "Carlos (El Emprendedor)", "evalua": ["traccion", "tu_rol"], "critica_si_malo": "Sin tracción, esto es solo una idea. Vuelve cuando tengas usuarios." },
    { "tiburon": "Ana (La Analista)", "evalua": ["uso_del_dinero", "clientes_meta_y1"], "critica_si_malo": "Tus proyecciones son irreales. ¿Cómo llegas a esos clientes?" }
  ],
  "versión": "2026.Diamond.V2"
}
```

### ⭐ ACT-S2-1-5-A — Crisis Económica (REEMPLAZAR — era un Builder de trading)

```json
{
  "code": "ACT-S2-1-5-A",
  "unit_code": "S2-1-5",
  "unit_title": "Crisis económicas: lecciones del 94, 2008 y 2020 en México",
  "level": "S2", "edad": "13-14 años", "tipo": "DECIDE", "complejidad": "ALTO",
  "titulo": "El Gran Crash: Sobrevive Tres Crisis",
  "descripcion": "Eres un ciudadano mexicano de clase media. Debes tomar decisiones financieras durante las tres crisis más devastadoras de las últimas décadas. Cada error tiene un costo numérico real. ¿Tu familia sale adelante?",
  "objetivo": "Aplicar decisiones financieras correctas en contextos de crisis económica y entender sus consecuencias reales",
  "xp": 300,
  "personaje_principal": "Familia Méndez (clase media CDMX)",
  "patrimonio_inicial": 250000,
  "contexto_inicial": "Tienes $250,000 en ahorros, una hipoteca de $800,000 y trabajo estable. Estamos en diciembre de 1993.",
  "nodo_inicial": "crisis_94_inicio",
  "nodos": {
    "crisis_94_inicio": {
      "id": "crisis_94_inicio",
      "texto": "📅 Diciembre 1994 — 'El Error de Diciembre'. El gobierno devalúa el peso. El dólar pasa de $3.40 a $7.50 en semanas. Tu hipoteca estaba en UDIS (indexada a inflación). Tu mensualidad se duplica de golpe.",
      "patrimonio_actual": 250000,
      "impacto_visual": "💸 Tu mensualidad: $3,200 → $6,800/mes",
      "opciones": [
        { "id": "a", "texto": "Vender el carro para pagar la hipoteca y no caer en mora", "siguiente_nodo": "crisis_94_vendiste_carro", "consecuencia": "Vendes el carro en -$45,000 pero mantienes la casa.", "impacto_patrimonio": -45000, "xp_bonus": 80, "es_optima": true },
        { "id": "b", "texto": "Sacar todos tus ahorros del banco antes de que los congelen", "siguiente_nodo": "crisis_94_retiraste_todo", "consecuencia": "Tienes el efectivo, pero pierde valor rápido con 52% de inflación.", "impacto_patrimonio": -30000, "xp_bonus": 30, "es_optima": false },
        { "id": "c", "texto": "No hacer nada y esperar a que pase la crisis", "siguiente_nodo": "crisis_94_no_actuaste", "consecuencia": "Caes en mora. El banco inicia proceso de adjudicación de tu casa.", "impacto_patrimonio": -200000, "xp_bonus": 0, "es_optima": false }
      ]
    },
    "crisis_94_vendiste_carro": {
      "id": "crisis_94_vendiste_carro",
      "texto": "Sacrificaste el carro pero salvaste la casa. La crisis dura 2 años. Para 1996, México empieza a recuperarse. Patrimonio actual: $205,000. Ahora viene 2008...",
      "patrimonio_actual": 205000,
      "opciones": [
        { "id": "a", "texto": "Continuar → Crisis 2008", "siguiente_nodo": "crisis_2008_inicio", "consecuencia": "Avanzas con la lección aprendida del 94", "impacto_patrimonio": 0, "xp_bonus": 0, "es_optima": true }
      ]
    },
    "crisis_94_retiraste_todo": {
      "id": "crisis_94_retiraste_todo",
      "texto": "El dinero en efectivo pierde 52% de su valor por inflación ese año. Tu casa quedó en riesgo también. Para 1996 te recuperaste parcialmente. Patrimonio: $175,000",
      "patrimonio_actual": 175000,
      "opciones": [
        { "id": "a", "texto": "Continuar → Crisis 2008", "siguiente_nodo": "crisis_2008_inicio", "consecuencia": "", "impacto_patrimonio": 0, "xp_bonus": 0, "es_optima": true }
      ]
    },
    "crisis_94_no_actuaste": {
      "id": "crisis_94_no_actuaste",
      "texto": "Perdiste la casa. Tienen que rentar por 10 años para volver a tener un activo. Patrimonio: $50,000. Lección dolorosa.",
      "patrimonio_actual": 50000,
      "opciones": [
        { "id": "a", "texto": "Continuar → Crisis 2008 (con desventaja)", "siguiente_nodo": "crisis_2008_inicio", "consecuencia": "", "impacto_patrimonio": 0, "xp_bonus": 0, "es_optima": true }
      ]
    },
    "crisis_2008_inicio": {
      "id": "crisis_2008_inicio",
      "texto": "📅 Septiembre 2008 — 'La Gran Recesión'. Quiebra Lehman Brothers. La bolsa cae 40% en México. Tu empresa habla de recortes. Tienes 3 meses de fondo de emergencia.",
      "opciones": [
        { "id": "a", "texto": "Vender tus acciones/fondos de inversión antes de que caigan más", "siguiente_nodo": "vendiste_acciones_2008", "consecuencia": "Vendes con -30% de pérdida y el dinero queda en efectivo.", "impacto_patrimonio": -60000, "xp_bonus": 20, "es_optima": false },
        { "id": "b", "texto": "No tocar las inversiones — esperar la recuperación y buscar más trabajo", "siguiente_nodo": "aguantaste_2008", "consecuencia": "Doloroso ver las pérdidas en papel, pero no son reales hasta que vendes.", "impacto_patrimonio": 0, "xp_bonus": 100, "es_optima": true },
        { "id": "c", "texto": "COMPRAR más acciones — las precios están en descuento histórico", "siguiente_nodo": "compraste_2008", "consecuencia": "Riesgo alto, pero capturaste los mejores precios de la década.", "impacto_patrimonio": 0, "xp_bonus": 150, "es_optima": true }
      ]
    },
    "vendiste_acciones_2008": {
      "id": "vendiste_acciones_2008",
      "texto": "Vendiste con pánico. Para 2010 la bolsa ya recuperó todo. Te perdiste la recuperación más poderosa. Cometiste el error clásico: vender en mínimos.",
      "patrimonio_actual_delta": -60000,
      "opciones": [
        { "id": "a", "texto": "Continuar → COVID 2020", "siguiente_nodo": "crisis_2020_inicio", "consecuencia": "", "impacto_patrimonio": 0, "xp_bonus": 0, "es_optima": true }
      ]
    },
    "aguantaste_2008": {
      "id": "aguantaste_2008",
      "texto": "Las pérdidas en papel eran terribles de ver, pero para 2011 tu portafolio recuperó el 100% y siguió subiendo. La paciencia fue tu mejor inversión.",
      "patrimonio_actual_delta": 40000,
      "opciones": [
        { "id": "a", "texto": "Continuar → COVID 2020", "siguiente_nodo": "crisis_2020_inicio", "consecuencia": "", "impacto_patrimonio": 0, "xp_bonus": 0, "es_optima": true }
      ]
    },
    "compraste_2008": {
      "id": "compraste_2008",
      "texto": "Fue un movimiento audaz pero con fundamentos sólidos. Para 2013 habías triplicado lo que invertiste en el piso. Eso se llama 'comprar el miedo'.",
      "patrimonio_actual_delta": 90000,
      "opciones": [
        { "id": "a", "texto": "Continuar → COVID 2020", "siguiente_nodo": "crisis_2020_inicio", "consecuencia": "", "impacto_patrimonio": 0, "xp_bonus": 0, "es_optima": true }
      ]
    },
    "crisis_2020_inicio": {
      "id": "crisis_2020_inicio",
      "texto": "📅 Marzo 2020 — COVID-19. El mundo se detiene. Tu trabajo es 'no esencial'. Tu empresa cierra 3 meses. Tienes 6 meses de fondo de emergencia esta vez. ¿Aprendiste la lección del 2008?",
      "opciones": [
        { "id": "a", "texto": "Activar el fondo de emergencia y no tocar las inversiones", "siguiente_nodo": "final_sobreviviste", "consecuencia": "El fondo cumplió exactamente su función. Tus inversiones se recuperaron en 6 meses.", "impacto_patrimonio": 0, "xp_bonus": 120, "es_optima": true },
        { "id": "b", "texto": "Pedir créditos porque el fondo no alcanza", "siguiente_nodo": "final_deuda_covid", "consecuencia": "Saliste, pero con $80,000 de nuevas deudas a pagar.", "impacto_patrimonio": -80000, "xp_bonus": 40, "es_optima": false },
        { "id": "c", "texto": "Buscar trabajo freelance digital mientras dura el cierre", "siguiente_nodo": "final_adaptado", "consecuencia": "Encontraste oportunidades en la crisis. Tus ingresos se diversificaron.", "impacto_patrimonio": 30000, "xp_bonus": 200, "es_optima": true }
      ]
    },
    "final_sobreviviste": {
      "id": "final_sobreviviste", "es_final": true, "tipo_final": "bueno",
      "texto": "🏆 Familia Méndez: Sobreviviste las 3 crisis con el patrimonio intacto y aprendizajes invaluables.",
      "reflexion_final": "El fondo de emergencia es el activo más subestimado de las finanzas personales. La paciencia en inversiones vence al pánico cada vez. Las crisis son temporales; las decisiones impulsivas dejan cicatrices permanentes.",
      "opciones": []
    },
    "final_deuda_covid": {
      "id": "final_deuda_covid", "es_final": true, "tipo_final": "regular",
      "texto": "⚠️ Sobreviviste pero con deudas. La siguiente crisis te encontrará más vulnerable.",
      "reflexion_final": "El COVID demostró que 3 meses de fondo de emergencia no son suficientes. Los expertos recomiendan 6 meses. ¿Cuánto tiempo tardarías en construir ese colchón?",
      "opciones": []
    },
    "final_adaptado": {
      "id": "final_adaptado", "es_final": true, "tipo_final": "bueno",
      "texto": "💡 No solo sobreviviste — encontraste oportunidades donde otros veían solo pérdidas.",
      "reflexion_final": "Las personas con habilidades digitales y mentalidad adaptable transforman las crisis en trampolines. La diversificación de ingresos es tan importante como la de inversiones.",
      "opciones": []
    }
  },
  "versión": "2026.Diamond.V2"
}
```

### ⭐ ACT-P5-3-4-A — Portafolio Virtual BMV

```json
{
  "code": "ACT-P5-3-4-A",
  "unit_code": "P5-3-4",
  "unit_title": "La Bolsa de Valores: ser dueño de las grandes empresas",
  "level": "P5", "edad": "10-11 años", "tipo": "SIMULADOR", "complejidad": "ALTO",
  "titulo": "Portafolio Virtual BMV",
  "descripcion": "Tienes $50,000 MXN virtuales para invertir en la Bolsa Mexicana de Valores. Elige tus acciones, diversifica tu portafolio y descubre si eres mejor inversionista que el promedio del mercado.",
  "objetivo": "Aprender los conceptos de portafolio, diversificación y análisis básico de acciones mexicanas",
  "xp": 350,
  "modo": "portafolio_builder",
  "capital_inicial": 50000,
  "acciones_disponibles": [
    { "ticker": "AMXL", "empresa": "América Móvil (Telcel)", "sector": "Telecomunicaciones", "precio": 15.20, "rendimiento_historico_5a": 42, "riesgo": "Medio", "descripcion": "La empresa de Carlos Slim. Domina las telecomunicaciones en Latinoamérica.", "dividendo_anual_pct": 2.1 },
    { "ticker": "WALMEX", "empresa": "Walmart México", "sector": "Consumo básico", "precio": 68.50, "rendimiento_historico_5a": 78, "riesgo": "Bajo", "descripcion": "Opera Walmart, Bodega Aurrerá, Sam's Club y BAIT en México.", "dividendo_anual_pct": 1.8 },
    { "ticker": "FEMSAUBD", "empresa": "FEMSA (OXXO/Heineken)", "sector": "Bebidas/Retail", "precio": 172.30, "rendimiento_historico_5a": 55, "riesgo": "Bajo", "descripcion": "Dueña de OXXO, Coca-Cola FEMSA y parte de Heineken.", "dividendo_anual_pct": 1.5 },
    { "ticker": "BIMBOA", "empresa": "Grupo Bimbo", "sector": "Alimentos", "precio": 88.00, "rendimiento_historico_5a": 61, "riesgo": "Bajo", "descripcion": "La panificadora más grande del mundo. Presente en 33 países.", "dividendo_anual_pct": 1.2 },
    { "ticker": "GMEXICOB", "empresa": "Grupo México (Cobre)", "sector": "Minería", "precio": 112.70, "rendimiento_historico_5a": 148, "riesgo": "Alto", "descripcion": "Mayor productor de cobre en México. Muy ligado al precio internacional del cobre.", "dividendo_anual_pct": 4.5 },
    { "ticker": "LIVEPOLC", "empresa": "Liverpool", "sector": "Retail", "precio": 155.20, "rendimiento_historico_5a": 35, "riesgo": "Medio", "descripcion": "La cadena de tiendas departamentales más importante de México.", "dividendo_anual_pct": 0.8 },
    { "ticker": "CEMEXCPO", "empresa": "CEMEX", "sector": "Construcción", "precio": 12.85, "rendimiento_historico_5a": -12, "riesgo": "Alto", "descripcion": "Cementera global mexicana. Su precio fluctúa mucho con el ciclo de construcción.", "dividendo_anual_pct": 0 },
    { "ticker": "GFINBURO", "empresa": "Grupo Financiero Inbursa", "sector": "Financiero", "precio": 35.60, "rendimiento_historico_5a": 22, "riesgo": "Medio", "descripcion": "Banco del Grupo Carso de Carlos Slim. Servicios financieros diversificados.", "dividendo_anual_pct": 3.2 }
  ],
  "simulacion_rendimientos": {
    "descripcion": "Al completar el portafolio, se simula el rendimiento usando variación aleatoria basada en el riesgo de cada acción",
    "formula_retorno_anual": "rendimiento_historico_5a/5 + (riesgo === 'Alto' ? (Math.random()*30-15) : riesgo === 'Medio' ? (Math.random()*20-10) : (Math.random()*12-6))"
  },
  "reglas": [
    "Debes invertir al menos 70% de tu capital ($35,000)",
    "Ninguna acción puede representar más del 40% del portafolio",
    "Debes tener mínimo 3 acciones diferentes (diversificación)",
    "Puedes guardar hasta 30% en efectivo"
  ],
  "metricas_portafolio": [
    { "id": "rendimiento_esperado", "label": "Rendimiento esperado anual", "formula": "suma(acciones.peso * acciones.rendimiento_historico_5a/5)", "suffix": "%" },
    { "id": "riesgo_portafolio", "label": "Nivel de riesgo", "formula": "promedio_ponderado_riesgo" },
    { "id": "diversificacion", "label": "Score de diversificación", "formula": "numero_sectores_distintos * 20", "suffix": "/100" },
    { "id": "dividendos_anuales", "label": "Dividendos anuales esperados", "formula": "suma(monto_invertido * dividendo_anual_pct/100)", "prefix": "$" }
  ],
  "escenarios": [
    { "condicion": "diversificacion >= 80", "mensaje": "🏆 Portafolio bien diversificado. El riesgo está distribuido entre múltiples sectores.", "tipo": "success" },
    { "condicion": "un_activo_pct > 40", "mensaje": "⚠️ Concentración peligrosa. Si esa empresa cae, tu portafolio sufre mucho.", "tipo": "warning" },
    { "condicion": "riesgo_promedio === 'Alto'", "mensaje": "🎲 Portafolio agresivo. Puedes ganar mucho — o perder mucho.", "tipo": "info" },
    { "condicion": "efectivo_pct > 40", "mensaje": "💤 Demasiado efectivo parado. El dinero sin invertir pierde contra la inflación.", "tipo": "warning" }
  ],
  "versión": "2026.Diamond.V2"
}
```

---

## MEJORAS POR TIPO — Para aplicar a TODOS los archivos de ese tipo

### Todos los QUIZ — agregar este bloque de preguntas

Cada archivo de tipo QUIZ que tenga `preguntas: []` vacío debe recibir mínimo 8 preguntas reales. Ejemplo del estándar:

```json
"preguntas": [
  {
    "id": "q1",
    "texto": "Una familia tiene ingresos de $18,000/mes y gastos de $16,500. Su tasa de ahorro es:",
    "opciones": ["8.3%", "16.5%", "91.7%", "1,500%"],
    "correcta": 0,
    "explicacion": "Tasa de ahorro = (Ahorro / Ingreso) × 100 = (1,500 / 18,000) × 100 = 8.3%. El ahorro son los $1,500 que sobran.",
    "tipo": "calculo"
  },
  {
    "id": "q2",
    "texto": "SITUACIÓN: Carlos tiene tarjeta con saldo de $10,000 al 60% anual. Solo paga el mínimo mensual de $300. ¿Cuánto paga solo en intereses en el primer mes?",
    "opciones": ["$300", "$500", "$600", "$1,000"],
    "correcta": 1,
    "explicacion": "$10,000 × 60% / 12 meses = $500 solo en intereses. De sus $300 de pago, $200 van a intereses — su deuda AUMENTA.",
    "tipo": "caso_trampa"
  }
]
```

### Todos los ARRASTRA — agregar feedback y hints obligatorios

Todo item debe tener:
- `"feedback": "Mensaje educativo específico al acertar (no solo '¡Correcto!')"` 
- `"hint": "Pista que aparece al equivocarse por segunda vez"`

### Todos los DECIDE — mínimo 5 nodos y consecuencias numéricas

Agregar en cada opción:
```json
"impacto_patrimonio": -50000,
"impacto_label": "Perdiste $50,000 en esa decisión"
```

Y agregar en nodos finales:
```json
"resumen_decisiones": true,
"patrimonio_final": 320000,
"vs_mejor_camino": 480000,
"diferencia": -160000
```

### Todos los CONSTRUCTOR — agregar `calculos_automaticos`

Todo Constructor con campos numéricos debe calcular en vivo:
```json
"calculos_automaticos": [
  { "id": "total_ingresos", "label": "Total ingresos", "formula": "suma de todos los campos de ingreso", "prefix": "$" },
  { "id": "total_gastos", "label": "Total gastos", "formula": "suma de todos los campos de gasto", "prefix": "$" },
  { "id": "balance", "label": "Balance mensual", "formula": "total_ingresos - total_gastos", "prefix": "$", "alerta_si_negativo": true }
]
```

---

## INTEGRACIÓN UI — Design System CEN Academy

El sistema de diseño usa:
```
Fondo principal: bg-[#05010D] (negro casi puro)
Texto: text-white / text-white/60 para secundario
Acento: #FF8C00 (naranja CEN)
Cards: bg-white/5 border border-white/10 rounded-2xl
Botones primarios: bg-[#FF8C00] text-black font-black rounded-2xl
Botones secundarios: bg-white/10 text-white rounded-2xl
Gradientes: from-[#FF8C00]/20 to-transparent
Fuente: font-epilogue (headings) / font-sans (body)
Animaciones: framer-motion (ya instalado)
```

**Patrón de header que DEBEN usar todos los componentes:**
```tsx
<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
  <Zap size={14} className="text-[#FF8C00]" />
  <span className="text-[10px] font-black uppercase tracking-[0.3em]">{data.tipo} · {data.level}</span>
</div>
<h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none mb-4">
  {data.titulo}
</h1>
```

**Patrón de escenario/feedback:**
```tsx
const colorMap = { success: 'border-[#FF8C00]/50 bg-[#FF8C00]/10 text-[#FF8C00]', danger: 'border-red-500/50 bg-red-500/10 text-red-400', warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400', info: 'border-blue-500/50 bg-blue-500/10 text-blue-400' };
<motion.div className={`p-4 rounded-2xl border ${colorMap[escenario.tipo]} font-semibold text-sm`}>
  {escenario.mensaje}
</motion.div>
```

**Patrón de resultado numérico grande (Simuladores):**
```tsx
<div className="bg-gradient-to-br from-[#FF8C00]/20 to-transparent border border-[#FF8C00]/30 rounded-3xl p-8 text-center">
  <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-2">{data.output_label}</p>
  <motion.p
    key={resultado}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-6xl md:text-8xl font-black text-[#FF8C00] tabular-nums"
  >
    {data.output_prefix}{resultado.toLocaleString('es-MX', {maximumFractionDigits: 0})}{data.output_suffix}
  </motion.p>
</div>
```

**XP Reward animation (usar en CompletionScreen):**
```tsx
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: "spring", damping: 10 }}
  className="w-32 h-32 bg-gradient-to-br from-[#FF8C00] to-[#FFB057] rounded-full flex items-center justify-center mx-auto"
>
  <div className="text-center">
    <p className="text-3xl font-black text-black">+{xp}</p>
    <p className="text-xs font-black text-black/70">XP</p>
  </div>
</motion.div>
```

---

## CHECKLIST FINAL antes de marcar cada actividad como terminada

```
DATOS:
[ ] unit_code coincide exactamente con el currículo en src/data/pedagogia/
[ ] unit_title es el título real de la unidad (no uno inventado)
[ ] El array preguntas/items/nodos/pasos tiene contenido REAL (no vacío ni placeholder)
[ ] SIMULADOR: mínimo 4 inputs con rangos realistas para México
[ ] QUIZ: mínimo 8 preguntas con explicación en cada una
[ ] ARRASTRA: mínimo 10 items, mínimo 3 categorías (P4+)
[ ] DECIDE: mínimo 5 nodos, 3 finales, consecuencias en $ (P4+)
[ ] CONSTRUCTOR: mínimo 5 pasos, cálculos automáticos donde aplique
[ ] TRIVIA: exactamente 10 preguntas escritas

UI/UX:
[ ] Usa bg-[#05010D] como fondo (no bg-white ni bg-gray)
[ ] Acento #FF8C00 en elementos activos y resultados
[ ] Framer-motion en transiciones y resultados numéricos
[ ] Funciona en móvil 375px (touch, sin hover-only interactions)
[ ] CompletionScreen muestra XP con animación
[ ] El progreso se guarda en Supabase al completar

PROFUNDIDAD PEDAGÓGICA:
[ ] La actividad tarda mínimo 5 minutos en completarse
[ ] Hay al menos un "aha moment" (resultado sorprendente o insight revelador)
[ ] Los números usan contexto mexicano real (pesos, no dólares; OXXO no 7-Eleven)
[ ] La retroalimentación explica EL POR QUÉ, no solo correcto/incorrecto
[ ] Para S2/S3: incluye dato de contexto mexicano real (cifra de Banxico, INEGI, BMV)
```

---

## Prioridad de corrección (en este orden)

1. **Crítico**: Corregir los 15+ archivos con `unit_code` y `unit_title` incorrectos
2. **Alto**: Agregar preguntas reales a todos los QUIZ vacíos
3. **Alto**: Reemplazar los 30 ⭐ con las versiones mejoradas de este documento
4. **Medio**: Agregar `feedback` y `hint` a todos los ARRASTRA
5. **Medio**: Agregar `impacto_patrimonio` a todos los DECIDE de P4+
6. **Bajo**: Agregar `calculos_automaticos` a todos los CONSTRUCTOR
