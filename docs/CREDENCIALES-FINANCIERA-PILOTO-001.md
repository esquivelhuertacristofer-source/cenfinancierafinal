# Credenciales — GRUPO-FINANCIERA-PILOTO-001
**Generado:** 2026-05-11  
**Grado:** P4 — Primaria 4  
**Contraseña única:** `pilotofin2026`  
**URL:** https://cenfinanciera.vercel.app/log-in

---

## Alumnos

| # | Nombre | Email | Contraseña |
|---|--------|-------|------------|
| 1 | Sofia Hernandez | sofia.hernandez@cenfinanciera.com | pilotofin2026 |
| 2 | Diego Morales | diego.morales@cenfinanciera.com | pilotofin2026 |
| 3 | Valentina Reyes | valentina.reyes@cenfinanciera.com | pilotofin2026 |
| 4 | Mateo Jimenez | mateo.jimenez@cenfinanciera.com | pilotofin2026 |
| 5 | Ximena Torres | ximena.torres@cenfinanciera.com | pilotofin2026 |
| 6 | Sebastian Gutierrez | sebastian.gutierrez@cenfinanciera.com | pilotofin2026 |
| 7 | Camila Vazquez | camila.vazquez@cenfinanciera.com | pilotofin2026 |
| 8 | Emiliano Mendoza | emiliano.mendoza@cenfinanciera.com | pilotofin2026 |
| 9 | Isabella Ramirez | isabella.ramirez@cenfinanciera.com | pilotofin2026 |
| 10 | Santiago Cruz | santiago.cruz@cenfinanciera.com | pilotofin2026 |

## Profesor

| Nombre | Email | Contraseña |
|--------|-------|------------|
| Profesor Piloto Financiera | profesor.piloto.financiera@cenfinanciera.com | pilotofin2026 |

---

## Estado verificado programáticamente (2026-05-11)

| Check | Resultado |
|-------|-----------|
| Tablas `grupos`, `alumnos_grupos`, `intentos` creadas | ✅ |
| Grupo `GRUPO-FINANCIERA-PILOTO-001` creado (UUID: `476f822a-3340-43c2-a3f2-969061f77914`) | ✅ |
| 10 alumnos creados en Supabase Auth | ✅ |
| Trigger `handle_new_user` pobló `alumnos_grupos` automáticamente (10/10 filas) | ✅ |
| Profesor creado y asignado al grupo (`id_profesor`) | ✅ |
| Login como `sofia.hernandez@cenfinanciera.com` exitoso | ✅ |
| Sofia insertó intento `ACT-P4-1-1-B` (score=85, 240s) | ✅ |
| Profesor ve 10 alumnos via `alumnos_grupos` (RLS) | ✅ |
| Profesor ve intento de Sofia (RLS `profesor_ve_intentos_de_su_grupo`) | ✅ |

---

## Escenarios de testing manual

### Escenario 1 — Flujo alumno básico
**Objetivo:** Verificar que un alumno puede iniciar sesión y navegar el hub.

1. Ir a `/log-in`
2. Email: `sofia.hernandez@cenfinanciera.com` / Password: `pilotofin2026`
3. **Esperado:** Redirige a `/hub/portal`
4. Hacer clic en cualquier actividad del hub
5. **Esperado:** La actividad carga correctamente
6. Completar la actividad
7. **Esperado:** Progreso actualizado en el hub (círculo de progreso o badge)
8. Ir a `/hub/logros`
9. **Esperado:** Se ve el logro recién completado

**Criterio de éxito:** Actividad completada aparece como completada en el hub sin errores de consola.

---

### Escenario 2 — Dashboard docente con datos reales
**Objetivo:** Verificar que el profesor ve métricas reales de sus alumnos.

1. Ir a `/log-in`
2. Email: `profesor.piloto.financiera@cenfinanciera.com` / Password: `pilotofin2026`
3. **Esperado:** Redirige a `/dashboard/teacher`
4. Verificar `MetricCards`:
   - "Alumnos Activos" debe mostrar **10**
   - "Grupos" debe mostrar **1**
   - "Logros SEP" debe mostrar **≥1** (el intento de Sofia ya existe)
5. Verificar `LatestDeliveries`:
   - Debe aparecer `ACT-P4-1-1-B` completado por Sofia Hernandez
6. Verificar `TopAlumnos`:
   - Sofia Hernandez debe aparecer en la lista (tiene el único intento)
7. Ir a `/dashboard/teacher/alumnos`
   - Deben aparecer las 10 tarjetas de alumnos
   - Hacer clic en "Sofia Hernandez"
   - Modal: "Actividades" debe mostrar **1/20**, "Puntaje Prom." debe mostrar **85/100**

**Criterio de éxito:** Todos los datos coinciden con los del test programático.

---

### Escenario 3 — Módulo admin `/admin/usuarios`
**Objetivo:** Verificar que el admin puede crear usuarios institucionales desde la UI.

1. Ir a `/log-in`
2. Email: `admin@cenfinanciera.com` / Password: _(la que se configuró en Fase 0)_
3. Ir a `/admin/usuarios`
4. **Esperado:** Carga la página sin redirigir (guard de `role === 'admin'` pasa)
5. En el selector de grupo elegir "GRUPO-FINANCIERA-PILOTO-001"
6. En Grado elegir "P4 — Primaria 4"
7. En Rol elegir "Alumno"
8. En Contraseña escribir: `test1234`
9. En el textarea escribir:
   ```
   Prueba Manual Uno
   Prueba Manual Dos
   ```
10. Hacer clic en "Crear usuarios"
11. **Esperado:** Panel verde con 2 éxitos + 2 emails generados automáticamente
12. Hacer clic en "Descargar PDF de credenciales"
13. **Esperado:** Se descarga el PDF con los 2 usuarios + contraseña
14. Verificar en Supabase Dashboard → Authentication → Users que los 2 nuevos usuarios existen

**Criterio de éxito:** 2 usuarios creados exitosamente, PDF descargado, usuarios visibles en Supabase Auth.

---

## Notas para el testing manual

- Si el login falla con "Invalid login credentials": verificar que el proyecto Supabase no esté pausado.
- Si `/admin/usuarios` redirige sin mostrar la página: verificar que `admin@cenfinanciera.com` tiene `role = 'admin'` en la tabla `profiles` (Supabase Table Editor).
- Si el dashboard del profesor muestra métricas en 0: la migración SQL puede no haberse ejecutado correctamente — re-ejecutar `institutional_full.sql`.
- Los logs del navegador (DevTools → Console) pueden mostrar errores de RLS útiles para diagnóstico.
