import { notFound } from 'next/navigation';
import HubPage from '@/app/hub/page';

// Espejo sin autenticación del hub del estudiante, para auditar el layout en
// móvil y tableta sin necesidad de sesión. El hub ya degrada a FALLBACK_PROFILE
// cuando no hay perfil, así que renderiza igual. /dev/* es público (ver
// middleware.ts), de modo que la ruta se apaga en producción.
export default function DevHub() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <HubPage />;
}
