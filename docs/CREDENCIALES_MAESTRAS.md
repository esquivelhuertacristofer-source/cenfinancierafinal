# 🔐 CREDENCIALES MAESTRAS - CEN (V2)

Este documento es la fuente de verdad para los accesos técnicos y de prueba del proyecto. **NO PERDER.**

## 0. Identidad y Propiedad
*   **Propietario:** Cristofer Huerta Esquivel
*   **Email Administrativo:** `cristoferhuertaesquivel@gmail.com`
*   **GitHub Username:** `esquivelhuertacristofer-source`
*   **GitHub Repo:** `https://github.com/esquivelhuertacristofer-source/CENPLATAFORMAFINANCIERA.git`
*   **Vercel URL:** `https://cenlabs.vercel.app` (Despliegue Maestro)

## 1. Conexión Supabase (Producción)
*   **URL:** `https://kmskaebltcbqgqrgrilq.supabase.co`
*   **Legacy Anon Key (JWT):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imttc2thZWJsdGNicWdxcmdyaWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTkwODUsImV4cCI6MjA5MzQ5NTA4NX0.sOhQv7yQ6URHzalT-QvAZYdjYmFN6-BcaTVwWjnTJss`

> **IMPORTANTE:** El frontend usa la Legacy Anon Key (JWT).
> La Secret Key ha sido eliminada de este documento por seguridad y debe gestionarse únicamente en las variables de entorno de Vercel.

## 2. Cuentas de Acceso (Test)
Las siguientes cuentas han sido dadas de alta en el proyecto `kmskaebltcbqgqrgrilq` el 04/05/2026:

### 🎓 Alumno (Vista Student Hub → /hub)
*   **Usuario:** `estudiante.prueba@cen.edu`
*   **Password:** `password123`
*   **Rol:** student
*   **Grupo:** 1A

### 👨‍🏫 Profesor (Vista Dashboard → /dashboard/teacher)
*   **Usuario:** `profesor.prueba@cen.edu`
*   **Password:** `password123`
*   **Rol:** teacher
*   **Grupo:** 1A

## 3. Esquema de la Tabla `profiles`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auth.users.id |
| email | text | |
| full_name | text | |
| role | text | 'student' o 'teacher' |
| school_level | text | 'primary', 'secondary', etc. |
| group_id | text | '1A', '2B', etc. |
| total_minutes | integer | Minutos acumulados |
| created_at | timestamptz | |

## 4. Estado del Proyecto
*   **Landing Page:** Versión V3 (Diamond State) finalizada.
*   **Login:** Funcional con autenticación Supabase y redirección por roles.
*   **Hub del Alumno:** Funcional con pilares, unidades y progreso.
*   **Dashboard del Profesor:** Funcional con gestión de grupos y métricas.
