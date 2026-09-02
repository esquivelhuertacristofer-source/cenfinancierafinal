import { notFound } from 'next/navigation';
import PlaneamientoPage from '@/app/dashboard/teacher/planeamiento/page';

// Espejo sin autenticación del panel de planeamiento del profesor, para revisar
// el temario durante el desarrollo. /dev/* es público (ver middleware.ts), así
// que la ruta se apaga en producción.
export default function DevPlaneamiento() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <PlaneamientoPage />;
}
