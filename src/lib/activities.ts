// Caché en memoria para evitar peticiones redundantes
const activityCache: Record<string, any> = {};

/**
 * Obtiene los datos de una actividad desde la API route (sin pasar por webpack).
 * Los JSON nunca se bundlean — se sirven bajo demanda vía /api/activity/[id].
 */
export async function getActivityData(activityId: string) {
  if (activityCache[activityId]) {
    return activityCache[activityId];
  }

  try {
    const parts = activityId.split('-');
    if (parts.length < 4 || parts[0] !== 'ACT') {
      return null;
    }

    const response = await fetch(`/api/activity/${activityId}`);
    if (!response.ok) return null;

    const data = await response.json();

    if (!data || (!data.tipo && !data.code)) {
      return null;
    }

    activityCache[activityId] = data;
    return data;
  } catch {
    return null;
  }
}

/**
 * Pre-carga una actividad en segundo plano para eliminar tiempos de espera.
 */
export function prefetchActivity(activityId: string) {
  if (!activityCache[activityId]) {
    getActivityData(activityId).catch(() => {});
  }
}

/**
 * Calcula el XP ganado basado en el puntaje y bonos.
 */
export function calculateXP(score: number, xpBase: number, racha: number = 0): number {
  const perfectionBonus = score === 100 ? 50 : 0;
  const streakBonus = racha >= 5 ? 100 : racha >= 3 ? 30 : 0;

  return Math.round((xpBase * (score / 100)) + perfectionBonus + streakBonus);
}

/**
 * Actualiza y devuelve la racha de días consecutivos con actividad completada.
 * Persiste en localStorage por usuario; se resetea si hay un día de hueco.
 */
export function getAndUpdateRacha(userId: string): number {
  if (typeof window === 'undefined') return 0;

  const key = `cen_racha_${userId}`;
  const today = new Date().toISOString().slice(0, 10);

  let stored: { count: number; lastDate: string } | null = null;
  try {
    stored = JSON.parse(localStorage.getItem(key) ?? 'null');
  } catch {
    stored = null;
  }

  if (stored?.lastDate === today) {
    return stored.count;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = stored?.lastDate === yesterday ? stored.count + 1 : 1;

  localStorage.setItem(key, JSON.stringify({ count, lastDate: today }));
  return count;
}
