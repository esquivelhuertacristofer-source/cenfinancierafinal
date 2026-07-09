import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Config mínima: sin caché incremental externa (R2) por ahora.
// La plataforma es mayormente dinámica (sesiones Supabase por cookie),
// así que ISR/data-cache aporta poco en el primer despliegue.
const config = defineCloudflareConfig({});

// Turbopack (default en Next 16) no genera middleware.js.nft.json en Windows,
// lo que rompe el build standalone que OpenNext necesita. Webpack sí lo genera.
config.buildCommand = 'npx next build --webpack';

export default config;
