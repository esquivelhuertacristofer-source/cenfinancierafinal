# Sentry — Instrucciones de Configuración Manual

El código de Sentry ya está integrado en la plataforma. Solo faltan los pasos manuales de cuenta y variables de entorno.

---

## Paso 1 — Crear cuenta y proyecto en Sentry

1. Ve a [sentry.io](https://sentry.io) y crea una cuenta gratuita (tier Hobby es suficiente).
2. Crea un nuevo **Proyecto** → selecciona **Next.js** como plataforma.
3. Copia el **DSN** que aparece al crear el proyecto. Tiene este formato:
   ```
   https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxxxxxx.ingest.sentry.io/xxxxxxxxxx
   ```

---

## Paso 2 — Configurar variable de entorno local

En el archivo `.env.local` (en la raíz del proyecto), agrega:

```env
NEXT_PUBLIC_SENTRY_DSN=https://TU_DSN_AQUI@xxxxx.ingest.sentry.io/xxxxx
```

> **Nota:** `.env.local` está en `.gitignore` — NO hacer commit de este archivo.

---

## Paso 3 — Configurar variable en Vercel

1. Ve a tu proyecto en [vercel.com/dashboard](https://vercel.com/dashboard)
2. → **Settings** → **Environment Variables**
3. Agrega:
   - **Name:** `NEXT_PUBLIC_SENTRY_DSN`
   - **Value:** tu DSN de Sentry
   - **Environments:** Production + Preview + Development (marcar los 3)
4. Haz click en **Save**

---

## Paso 4 — Deploy y verificación

1. Haz push a `main` para disparar el deploy en Vercel:
   ```bash
   git push origin main
   ```

2. Después del deploy, verifica Sentry visitando:
   ```
   https://tu-dominio.vercel.app/api/test-sentry?test=true
   ```
   
   Deberías recibir una respuesta como:
   ```json
   {
     "ok": true,
     "eventId": "xxxxx",
     "dsn_configured": true,
     "env": "production",
     "message": "Test error sent to Sentry. Check your Sentry dashboard."
   }
   ```

3. Ve a tu dashboard en Sentry → debería aparecer el evento de prueba en menos de 30 segundos.

---

## Qué está configurado automáticamente

| Feature | Estado |
|---------|--------|
| Captura de errores de cliente | ✅ Activo (solo en producción) |
| Captura de errores de servidor | ✅ Activo (solo en producción) |
| Session Replay | ✅ 1% sesiones normales, 100% en errores |
| Performance tracing | ✅ 10% de requests |
| Tunnel route (`/monitoring`) | ✅ Para evitar ad blockers |
| Source maps ocultos del cliente | ✅ |
| Errores de extensiones de browser | ❌ Filtrados (no se reportan) |
| Errores de ad blockers | ❌ Filtrados (no se reportan) |
| Errores manejados por ErrorBoundary | ⚠️ Se reportan con contexto adicional |

---

## Variables de entorno opcionales para Source Maps

Para que Sentry pueda mostrar el código fuente real en los errores (en lugar de código minificado), puedes configurar también en Vercel:

```env
SENTRY_AUTH_TOKEN=tu_auth_token_de_sentry
SENTRY_ORG=tu_organizacion_en_sentry
SENTRY_PROJECT=nombre_del_proyecto
```

Estos se obtienen en Sentry → Settings → Auth Tokens / Organization / Projects.

Son opcionales para el funcionamiento básico, pero mejoran mucho la utilidad de los stack traces.

---

## Archivos creados/modificados

| Archivo | Propósito |
|---------|-----------|
| `sentry.client.config.ts` | Init de Sentry en el navegador |
| `sentry.server.config.ts` | Init de Sentry en Node.js (API routes, SSR) |
| `sentry.edge.config.ts` | Init de Sentry en Edge Runtime (middleware) |
| `next.config.ts` | Envuelto con `withSentryConfig` |
| `src/app/error.tsx` | Error boundary global que reporta a Sentry |
| `src/app/api/test-sentry/route.ts` | Endpoint de prueba de conectividad |
