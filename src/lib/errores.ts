/**
 * Sacar un mensaje legible de algo que se atrapó en un `catch`.
 *
 * POR QUÉ EXISTE. En JavaScript se puede lanzar cualquier cosa, no sólo un `Error`: una cadena, un
 * objeto suelto, `undefined`. Por eso TypeScript tipa lo atrapado como `unknown` y obliga a mirar
 * qué es antes de usarlo. El atajo de escribir `catch (e: any)` y leer `e.message` calla al
 * compilador pero no arregla nada: cuando lo lanzado no es un `Error` —una promesa rechazada con un
 * texto, un error de red serializado por el driver de Supabase— `e.message` vale `undefined`, y el
 * `?? "Error desconocido"` que suele venir detrás lo tapa. El resultado es el peor posible: un log
 * que dice "Error desconocido" cuando el motivo real estaba ahí, en el propio valor.
 *
 * QUÉ DEVUELVE. Siempre una cadena con algo dentro, nunca vacía, para que quien la escribe en un log
 * o se la enseña a un profesor no tenga que comprobar nada.
 */
export function mensajeDeError(e: unknown): string {
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === 'string' && e) return e;

  /* Los errores de Supabase y de `fetch` llegan a veces como objetos planos, sin pasar por la clase
     `Error`, pero con el mismo campo dentro. Vale la pena mirarlo antes de rendirse. */
  if (e && typeof e === 'object') {
    const obj = e as Record<string, unknown>;
    for (const campo of ['message', 'error_description', 'error', 'details'] as const) {
      const v = obj[campo];
      if (typeof v === 'string' && v) return v;
    }
    /* Último recurso antes del texto genérico: serializarlo. Un `{"code":"23505"}` en el log dice
       muchísimo más que "Error desconocido", que no dice nada. */
    try {
      const json = JSON.stringify(e);
      if (json && json !== '{}') return json;
    } catch {
      /* Referencias circulares: se cae al genérico de abajo. */
    }
  }

  return 'Error desconocido';
}
