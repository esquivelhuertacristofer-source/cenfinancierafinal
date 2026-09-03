import { useSyncExternalStore } from 'react';

/**
 * Nunca cambia nada, asi que no hace falta avisar a nadie: la funcion existe solo porque
 * `useSyncExternalStore` la exige, y devolver siempre la misma evita resuscripciones.
 */
const sinSuscripcion = () => () => {};

/**
 * `false` mientras se dibuja en el servidor y durante la hidratacion; `true` en cuanto React
 * termina de hidratar.
 *
 * Sirve para no dibujar en el servidor lo que depende del navegador (la URL, `localStorage`, la
 * hora, el ancho de la ventana) y evitar asi que el HTML del servidor y el del cliente no coincidan.
 *
 * Antes esto era un `useState(false)` con un `useEffect` que lo ponia a `true`. Funcionaba, pero es
 * exactamente el patron que React ya resuelve de serie: `useSyncExternalStore` distingue el valor
 * del servidor del valor del cliente sin efectos de por medio, que es para lo que se aniadio.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(sinSuscripcion, () => true, () => false);
}
