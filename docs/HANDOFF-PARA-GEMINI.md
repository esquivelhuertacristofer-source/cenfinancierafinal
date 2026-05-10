# HANDOFF: Lo que Claude construyó — léelo antes de integrar

> Este documento es para Gemini. Describe todo lo que Claude programó en este proyecto durante las últimas sesiones de trabajo. Tu tarea es leerlo, revisar el código real en los archivos indicados, y unirlo con la landing page que ya tienes construida para que el flujo completo funcione de extremo a extremo.

---

## 1. Qué leer primero

Lee este documento en este orden:

1. `docs/TEMARIO-CURRICULAR.md` — El alma del proyecto. Define los 180 temas, la pedagogía, la estructura de contenidos y las instrucciones técnicas de arquitectura.
2. Este documento (`HANDOFF-PARA-GEMINI.md`) — Lo que Claude construyó en código.
3. El código en los archivos listados abajo — Verifica que todo compila y tiene sentido junto.

---

## 2. Stack tecnológico

- **Next.js 16** con App Router (todo en `src/app/`)
- **TypeScript** estricto
- **Tailwind CSS** con colores personalizados definidos en `tailwind.config.ts`:
  - `cen-blue: #011C40`
  - `cen-orange: #FF8C00`
  - `cen-cyan: #42E8E0`
  - `cen-bg: #F9FAFB`
- **Fuente**: Epilogue (`font-epilogue`)
- **Supabase v2** para Auth + base de datos
- Sin subida de archivos a Supabase — todo el contenido (videos, PDFs, fichas) vive en URLs externas

---

## 3. Base de datos Supabase

El schema está en `supabase/schema.sql`. No lo modifiques. Las tablas relevantes son:

| Tabla | Uso |
|-------|-----|
| `profiles` | Perfil del usuario. Campo clave: `school_level` (`primary`, `secondary`, `teacher`, `admin`), `grade` (número), `full_name` |
| `progress` | Progreso de actividades. Columnas: `user_id` (uuid), `activity_id` (text) |

El formato de `activity_id` es: `${unitCode}-${contentType}` — por ejemplo `P4-1-1-video`, `P4-2-3-quiz`.

No hay tabla `lessons` ni `lesson_contents` en uso — todo el contenido está hardcodeado en `src/lib/hub.ts` para la demo.

---

## 4. Autenticación y flujo de login

**Archivo:** `src/app/log-in/page.tsx`

- Login con email/password via Supabase Auth
- Después del login, consulta `profiles.school_level` del usuario
- Redirige a `/dashboard` si es `teacher` o `admin`
- Redirige a `/hub` si es cualquier otro nivel (estudiante)
- El botón "Salir" en el hub llama a `supabase.auth.signOut()` y redirige a `/log-in`

---

## 5. El Hub de Estudiantes — Arquitectura completa

El hub tiene 3 niveles de navegación:

```
/hub                          ← Vista general con los 4 pilares
/hub/[pillar]                 ← Timeline de 5 unidades del pilar
ContentModal (overlay)        ← Visor de contenido con tabs por modalidad
```

### 5.1 Librería de datos: `src/lib/hub.ts`

Este es el archivo más importante del hub. Contiene:

- **Tipos TypeScript**: `Unit`, `PillarMeta`, `ContentItem`, `ContentType`, `UserProfile`, `QuizQuestion`
- **`PILLARS`**: Array con los 4 pilares de Primaria 4°, cada uno con 5 unidades. Cada unidad tiene sus `contents` (array de `ContentItem`) con `type`, `label`, `url` (null en la demo), `required` (boolean).
- **`MODALITY_ICONS`**: Mapa de emoji por tipo de contenido (`video`, `reading`, `simulator`, `printable`, `quiz`)
- **`QUIZ_QUESTIONS`**: Banco de preguntas para 4 unidades demo (`P4-1-1`, `P4-2-1`, `P4-3-1`, `P4-4-1`) + fallback genérico
- **`getQuizForUnit(unitCode)`**: Devuelve las preguntas del quiz para una unidad
- **`getCompletedActivities(userId)`**: Lee la tabla `progress` de Supabase y devuelve un `Set<string>` de activity IDs completados
- **`markActivityComplete(userId, activityId)`**: Inserta en la tabla `progress`
- **`getCurrentProfile()`**: Obtiene el perfil del usuario autenticado actual
- **`getPillarProgress(pillar, completed)`**: Calcula `{ done, total, pct }` para un pilar
- **`getUnitStatus(unit, pillar, completed)`**: Devuelve `'done' | 'available' | 'locked'` — una unidad se desbloquea cuando la anterior está completa (por su contenido `required: true`)

### 5.2 Página principal del Hub: `src/app/hub/page.tsx`

- Carga el perfil del usuario y sus actividades completadas al montar
- Muestra saludo con nombre, nivel escolar, y anillo de progreso general (% de unidades completadas)
- Renderiza `<PillarGrid completed={completed} />`
- Botón "Continuar →" lleva al primer pilar incompleto
- Botón "Salir" hace signOut y redirige a `/log-in`
- El progreso se re-fetcha automáticamente cuando el usuario vuelve a esta página (el componente remonta en cada navegación)

### 5.3 Página de pilar: `src/app/hub/[pillar]/page.tsx`

- Ruta dinámica — `pillarId` viene de `useParams()`
- Muestra header del pilar con icono, `ProgressRing`, barra de progreso
- Renderiza `<UnitTimeline pillar={pillar} completed={completed} userId={userId} onComplete={handleComplete} />`
- `handleComplete` añade el `activityId` al Set local de `completed`
- Al fondo: bloque de **Proyecto Integrador** — bloqueado hasta completar todas las unidades, desbloqueado muestra botón "Ver proyecto →"
- El botón "Ver proyecto →" abre un **modal** (estado `showProject`) con:
  - Descripción del proyecto integrador
  - 4 pasos de ejecución
  - Rúbrica de evaluación (Claridad 30%, Conexión 30%, Creatividad 20%, Trabajo en equipo 20%)

### 5.4 Componentes del Hub

**`src/components/hub/PillarGrid.tsx`**
- Grid responsivo `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
- Renderiza 4 `<PillarCard>` con `completed` pasado como prop

**`src/components/hub/PillarCard.tsx`**
- Card por pilar con icono, `ProgressRing`, título, barra de progreso
- Link a `/hub/${pillar.id}`
- CTA dinámico: "Comenzar" / "Continuar" / "¡Completado! 🎉"

**`src/components/hub/UnitTimeline.tsx`**
- Lista vertical de `<UnitCard>` para las 5 unidades del pilar
- Maneja estado `activeUnit` — al hacer click en una unidad, abre el `ContentModal`
- Calcula y pasa `onNextUnit` al modal: cuando el usuario completa una unidad y presiona "Siguiente unidad →", el modal cierra la actual y abre automáticamente la siguiente
- Si es la última unidad, el botón dice "Cerrar" en lugar de "Siguiente unidad →"

**`src/components/hub/UnitCard.tsx`**
- Fila de unidad con botón circular de estado (✓ verde / 🔒 gris / número azul)
- Muestra iconos de modalidades disponibles y objetivo de la unidad
- Deshabilitado cuando `status === 'locked'`

**`src/components/hub/ContentModal.tsx`**
- Overlay modal con backdrop blur
- Header con badge de pilar + número de unidad, título, botón ✕
- Tab bar con una tab por modalidad de contenido
- Contenido por tab:
  - **VideoTab**: iframe de YouTube (convierte URL watch?v= → embed/). Si `url` es null muestra placeholder "Video próximamente". Botón "Marcar como visto ✓"
  - **ReadingTab**: iframe con lectura. Si null, placeholder. Botón "He terminado la lectura ✓"
  - **SimulatorTab**: iframe sandboxed. Si null, placeholder. Botón "Simulador completado ✓"
  - **PrintableTab**: Link de descarga de PDF + botón secundario "Ya la imprimí, marcar como hecho"
  - **QuizTab**: Preguntas de opción múltiple. Carga preguntas específicas por `unitCode` via `getQuizForUnit()`. Al enviar calcula % de aciertos y muestra resultado. Se puede responder solo una vez.
- Footer de celebración cuando el contenido `required` está completado:
  - Muestra "¡Unidad completada! 🎉"
  - Botón "Siguiente unidad →" (o "Cerrar" si es la última) — wired a `onNextUnit` prop

**`src/components/ui/ProgressRing.tsx`**
- SVG de anillo de progreso circular
- Props: `pct`, `size`, `stroke`, `color`, `trackColor`
- Usado en PillarCard, hub page y pillar page

---

## 6. Lo que TÚ (Gemini) necesitas integrar

### 6.1 Conectar la landing con el login

La landing page que tienes debe tener un botón/link que lleve a `/log-in`. Verifica que:

```
Landing (/) → /log-in → /hub (estudiantes) o /dashboard (maestros)
```

El link de la navbar y el CTA principal de la landing deben apuntar a `/log-in`.

### 6.2 Navbar de la landing

El hub tiene su propia navbar interna. La landing debe tener la suya con:
- Logo "CEN ACADEMY" en `font-epilogue font-black` con `text-cen-blue` y `text-cen-cyan`
- Link "Iniciar sesión" → `/log-in`
- CTA "Comenzar gratis" o similar → `/log-in`

### 6.3 Colores y tipografía que DEBES usar

```css
cen-blue: #011C40   ← azul oscuro, textos principales y fondos hero
cen-orange: #FF8C00 ← naranja, CTAs y acentos
cen-cyan: #42E8E0   ← cyan, paneles decorativos y highlights
cen-bg: #F9FAFB     ← fondo gris muy claro
font-epilogue        ← fuente principal (ya cargada en el proyecto)
```

### 6.4 Verificar que el router redirige bien

Después del login exitoso:
- Usuarios con `school_level = 'teacher'` o `'admin'` → `/dashboard`
- Todos los demás → `/hub`

Confirma que `/dashboard` existe como ruta. Si no existe aún, crea un placeholder simple para no romper el redirect.

### 6.5 Supabase — tabla `progress`

Verifica en el schema SQL que exista:

```sql
CREATE TABLE progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_id)
);
```

Si no existe, agrégala. El hub escribe y lee de esta tabla para todo el tracking de progreso.

---

## 7. Archivos que NO debes tocar

- `src/lib/hub.ts` — Librería de datos del hub. Solo Claude la modifica.
- `src/components/hub/` — Todos los componentes del hub. Solo Claude los modifica.
- `src/app/hub/` — Rutas del hub. Solo Claude las modifica.
- `src/app/log-in/page.tsx` — Login ya completo y funcional.
- `supabase/schema.sql` — No modificar el schema existente, solo agregar si falta.

---

## 8. Flujo completo esperado (lo que hay que poder hacer en el demo)

1. Usuario llega a la landing `/`
2. Hace click en "Iniciar sesión" → va a `/log-in`
3. Ingresa credenciales → Supabase Auth verifica
4. Si es estudiante → redirige a `/hub`
5. Ve sus 4 pilares con progreso en 0%
6. Hace click en un pilar → va a `/hub/primeros-pasos` (o el id correspondiente)
7. Ve 5 unidades, la primera disponible y las demás bloqueadas
8. Hace click en la primera unidad → abre ContentModal
9. Navega por las tabs (Video, Lectura, Quiz, etc.)
10. Completa el contenido requerido → aparece "¡Unidad completada! 🎉"
11. Hace click "Siguiente unidad →" → se abre automáticamente la Unidad 2
12. Al completar las 5 unidades → se desbloquea el Proyecto Integrador
13. Hace click "Ver proyecto →" → modal con instrucciones
14. Vuelve a `/hub` → el anillo de progreso refleja las unidades completadas
15. Hace click "Salir" → signOut y regresa a `/log-in`

---

## 9. Preguntas frecuentes

**¿Por qué los videos no se ven?**
Todos los `url` están en `null` en `hub.ts` para la demo. El modal muestra un placeholder "Video próximamente". Para activarlos, hay que poner la URL de YouTube en el campo `url` de cada `ContentItem` en `hub.ts`.

**¿Los datos de lecciones están en Supabase?**
No para la demo. Todo el contenido (títulos, objetivos, modalidades) está hardcodeado en `PILLARS` dentro de `src/lib/hub.ts`. Solo el progreso (qué actividades completó el usuario) va a Supabase en la tabla `progress`.

**¿Hay contenido para otros grados?**
`hub.ts` solo tiene Primaria 4° (20 unidades). Los otros 8 grados están definidos en `docs/TEMARIO-CURRICULAR.md` pero aún no están programados. La demo corre con Primaria 4°.

**¿El quiz se puede repetir?**
No. Una vez enviado, se marca como completado en Supabase y el componente muestra directamente el resultado sin opción de reintentar.
