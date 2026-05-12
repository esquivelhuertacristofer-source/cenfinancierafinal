# Auditoría Post-Fixes — CEN Financiera

**Fecha de fixes:** 2026-05-11  
**Script:** `node scripts/audit-activities.mjs`

---

## Resumen Comparativo

| Métrica | Antes | Después | Delta |
|---------|-------|---------|-------|
| ✅ OK | 348 (95.6%) | 363 (99.7%) | +15 |
| ⚠️ Warning | 12 (3.3%) | 1 (0.3%) | −11 |
| ❌ Error | 4 (1.1%) | 0 (0.0%) | −4 |
| **Total** | 364 | 364 | — |

---

## Fase 1 — Errores Críticos Resueltos (4 actividades)

### `ACT-P1-2-4-B` — MEMORIA
- **Problema:** `MEMORIA_SIN_PARES` — el JSON usaba `parejas[]` (20 cartas individuales con IDs numéricos duplicados) en lugar del campo `pares[]` que espera `MatchingActivity.tsx`.
- **Fix:** Convertidos los 10 pares de cartas al formato `{id, termino, definicion}`. Los emojis se incorporaron al texto de cada tarjeta. Estructura compatible con el renderer.

### `ACT-P1-3-5-B` — RULETA
- **Problema:** `RULETA_SEGMENTOS_INSUF` — solo 3 escenarios (mínimo requerido: 4).
- **Fix:** Añadidos 2 escenarios pedagógicamente coherentes con el pilar P1-3 (metas, ahorro, celebración). Total: 5 escenarios.

### `ACT-P2-1-3-A` — RELLENA
- **Problema:** `RELLENA_SIN_OPCIONES` — JSON usaba `espacios[]` con `[BLANKn]` en el texto y campo `correcta`. `FillBlanksActivity.tsx` espera `blanks[]` con `__BLANKn__` y campo `respuesta`.
- **Fix:** Renombrado `espacios` → `blanks`, `correcta` → `respuesta` en cada blank. Reemplazados todos los `[BLANKn]` por `__BLANKn__` en el texto. Añadido campo `contexto`. Se corrigió además el campo `code` (faltaba prefijo `ACT-`).

### `ACT-P2-3-1-A` — RELLENA
- **Problema:** Idéntico a `ACT-P2-1-3-A` (`espacios[]` + `[BLANKn]`).
- **Fix:** Misma transformación aplicada. Campo `code` corregido.

---

## Fase 2 — Warning de RELLENA Mismatch Resuelto (1 actividad)

### `ACT-P5-2-1-B` — RELLENA
- **Problema:** `RELLENA_MISMATCH` — JSON usaba `parrafo` (con `[Término]` como marcadores), `opciones[]` como pool global de 7 palabras (5 correctas + 2 distractores). El renderer no puede mapear esto.
- **Fix:** Reestructurado completamente:
  - `parrafo` → `texto` con marcadores `__BLANK1__`–`__BLANK5__`
  - Pool global de 7 palabras → `blanks[]` con 5 blanks, cada uno con sus propios `opciones` (respuesta correcta + 2 distractores relevantes por blank)
  - Añadido `contexto`

---

## Fase 3 — Warnings de QUIZ sin Descripción Resueltos (10 actividades)

Se añadió el campo `descripcion` a las 10 actividades QUIZ que carecían de él:

| Actividad | Título | Descripción añadida |
|-----------|--------|---------------------|
| ACT-P2-4-1-B | Mis Primeras Ideas de Negocio | "Pon a prueba lo que aprendiste sobre emprendimiento..." |
| ACT-P2-4-2-B | El Costo de mi Negocio | "¿Sabes cuánto cuesta hacer lo que vendes?..." |
| ACT-P2-4-3-B | El Tesoro de la Ganancia | "La ganancia es el tesoro que buscas..." |
| ACT-P2-4-4-B | Vender con Honestidad | "Los mejores negocios se construyen con honestidad..." |
| ACT-P2-4-5-B | Mi Reporte de Éxito | "El reporte de resultados dice si tu negocio ganó o perdió..." |
| ACT-P3-1-2-B | Mi Presupuesto Maestro | "Un presupuesto bien hecho es tu mejor herramienta..." |
| ACT-P4-1-2-B | Mi Cuenta de Ahorro | "Los bancos son tus aliados financieros..." |
| ACT-P6-4-5-B | Certificación Final: Emprendimiento Social | "El verdadero emprendedor cambia el mundo..." |
| ACT-S1-3-3-B | El Monstruo de la Inflación | "La inflación es invisible pero poderosa..." |
| ACT-S2-4-4-B | Certificación: Estrategias de Negociación | "Negociar bien es una habilidad clave en los negocios..." |

---

## Fase 4 — Warning de CONTROL (falso positivo, sin cambio)

### `ACT-P1-2-5-A` — CONTROL
- **Warning:** `CONTROL_SIN_SERVICIOS` — el JSON no define servicios en el formato esperado.
- **Resolución:** Falso positivo confirmado. `ServiceControlActivity.tsx` está completamente hardcodeado con 3 servicios fijos (luz, agua, gas) e ignora todos los campos del JSON. La actividad funciona correctamente en runtime. El warning persiste en el audit como indicador de deuda técnica (ver DEUDA-TECNICA-CONTENIDO.md).

---

## Backups

Todos los archivos modificados tienen copia previa en:
`src/data/actividades/_pre-audit-fix-backup/` (15 archivos: 5 de Fase 1-2 + 10 de Fase 3)

---

## Estado Final

**364 actividades auditadas — 363 OK (99.7%) — 0 errores críticos**

El único warning restante (`CONTROL_SIN_SERVICIOS`) es un falso positivo estructural documentado.
