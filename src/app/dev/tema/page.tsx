import { notFound } from 'next/navigation';
import TemaClient from './TemaClient';

/**
 * Recorrido de un tema completo. SOLO DESARROLLO.
 *
 * Abre cualquier unidad del temario con su flujo real —Marco Teórico,
 * Laboratorio/Ejercicio y Evaluación— usando el mismo ContentModal del hub,
 * pero sin sesión de Supabase. Sirve para revisar una unidad de punta a punta
 * sin tener que autenticarse.
 */
export const dynamic = 'force-dynamic';

export default function RecorridoDeTema() {
  // Nunca debe existir en producción: expone contenido sin autenticación.
  if (process.env.NODE_ENV === 'production') notFound();

  return <TemaClient />;
}
