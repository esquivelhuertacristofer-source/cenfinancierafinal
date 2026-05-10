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
