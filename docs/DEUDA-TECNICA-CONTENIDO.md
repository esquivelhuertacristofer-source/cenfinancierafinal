# Deuda Técnica de Contenido — CEN Financiera

**Fecha:** 2026-05-11  
**Contexto:** Hallazgos descubiertos durante la auditoría programática de 364 actividades JSON.

---

## 1. CONTROL — Renderer completamente hardcodeado

**Severidad:** Baja (funcional, pero inflexible)  
**Actividad afectada:** `ACT-P1-2-5-A`  
**Archivo:** `src/components/activities/ServiceControlActivity.tsx`

### Descripción
`ServiceControlActivity.tsx` ignora completamente el contenido del JSON de la actividad. Los 3 servicios (luz, agua, gas), sus valores de presupuesto y los escenarios de ajuste están escritos directamente en el código del componente.

### Impacto
- El warning `CONTROL_SIN_SERVICIOS` en el audit es un **falso positivo** — la actividad funciona, pero solo porque el renderer no lee el JSON.
- No es posible configurar ni personalizar la actividad sin tocar el código fuente.
- Impide escalar el tipo CONTROL a otros grados o unidades con distintos contextos (ej. presupuesto escolar, viaje familiar).

### Solución recomendada
Refactorizar `ServiceControlActivity.tsx` para leer `data.servicios[]` con estructura:
```json
{
  "servicios": [
    { "id": "luz", "nombre": "Electricidad", "icono": "⚡", "presupuesto": 800, "consumo_actual": 950 },
    ...
  ]
}
```
Luego actualizar `ACT-P1-2-5-A` con ese formato.

**Prioridad:** Media (no bloquea lanzamiento).

---

## 2. RELLENA — Dos formatos de datos inconsistentes en el corpus

**Severidad:** Alta (resuelto para los casos auditados, pero puede reaparecer)  
**Actividades corregidas:** ACT-P2-1-3-A, ACT-P2-3-1-A, ACT-P5-2-1-B

### Descripción
Durante la auditoría se encontraron al menos 3 formatos distintos de RELLENA en el corpus:

| Formato | Campo texto | Campo blanks | Campo respuesta | Estado |
|---------|-------------|--------------|-----------------|--------|
| **Renderer contract** (correcto) | `texto` con `__BLANKn__` | `blanks[].id/opciones/respuesta` | `respuesta` | ✅ Renderer lo espera |
| **Formato `espacios`** (incorrecto) | `texto` con `[BLANKn]` | `espacios[].id/opciones/correcta` | `correcta` | ❌ Corregido en auditoría |
| **Formato pool global** (incorrecto) | `parrafo` con `[Término]` | top-level `opciones[]` sin asignación por blank | — | ❌ Corregido en auditoría |

### Riesgo futuro
Si se crean nuevas actividades RELLENA sin referirse al contrato del renderer, el error puede reaparecer. El audit script actualmente detecta los primeros 2 formatos incorrectos pero no el tercer formato (pool global) por sí solo.

### Solución recomendada
1. Documentar el contrato RELLENA en `src/components/activities/FillBlanksActivity.tsx` (JSDoc en la interfaz de props).
2. Actualizar `scripts/audit-activities.mjs` para detectar el formato `parrafo`+pool.
3. Crear una plantilla JSON de referencia en `src/data/actividades/_templates/rellena-template.json`.

**Prioridad:** Alta (preventiva para contenido nuevo).

---

## 3. MEMORIA — Un único formato de pares confirmado en prod

**Severidad:** Informativa  
**Actividad corregida:** ACT-P1-2-4-B

### Descripción
El corpus tenía un formato de MEMORIA basado en cartas individuales (`parejas[]`) con IDs numéricos duplicados (dos cartas con mismo ID = par). `MatchingActivity.tsx` espera un array de pares como objetos únicos (`pares[]` con `{id, termino, definicion}`).

### Riesgo futuro
Bajo — corregida la única actividad MEMORIA con el problema. Pero el formato incorrecto es intuitivo para editores de contenido no técnicos (especialmente si copian la estructura `parejas[]`).

### Solución recomendada
Crear `src/data/actividades/_templates/memoria-template.json` con la estructura correcta como referencia.

**Prioridad:** Baja.

---

## 4. QUIZ — Inconsistencia en campos `code` vs `id`

**Severidad:** Baja (no afecta funcionalidad)  
**Actividades afectadas:** ACT-P6-4-5-B, ACT-S2-4-4-B (usan `id` en lugar de `code`)

### Descripción
La mayoría de actividades usan `"code": "ACT-XXX"` como identificador principal. Al menos 2 actividades QUIZ usan `"id": "ACT-XXX"` en su lugar.

### Impacto
Si el código de la aplicación busca el identificador por `activity.code` (sin fallback a `activity.id`), estas dos actividades podrían no aparecer correctamente en historial, logros o cross-references.

### Solución recomendada
1. Verificar en el frontend que todos los accesos al código de actividad usen `activity.code ?? activity.id`.
2. Normalizar los JSON a `code` como campo canónico.

**Prioridad:** Media (revisar antes de activar el historial de logros por alumno).

---

## 5. RULETA — Mínimo de segmentos no documentado

**Severidad:** Informativa  
**Actividad corregida:** ACT-P1-3-5-B

### Descripción
El audit detectó que `RouletteActivity.tsx` require un mínimo de 4 segmentos. Este mínimo no está documentado en ningún lugar del proyecto.

### Solución recomendada
Añadir un comentario en `RouletteActivity.tsx` y en `scripts/audit-activities.mjs` explicando el mínimo requerido y su razón (experiencia de juego + distribución visual).

**Prioridad:** Baja.

---

## Resumen de Prioridades

| Ítem | Severidad | Prioridad | Bloquea lanzamiento |
|------|-----------|-----------|---------------------|
| CONTROL hardcodeado | Baja | Media | No |
| RELLENA formatos inconsistentes | Alta | Alta | No (corregido) |
| MEMORIA formato alternativo | Info | Baja | No |
| QUIZ `id` vs `code` | Baja | Media | Depende |
| RULETA mínimo no documentado | Info | Baja | No |
