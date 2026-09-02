/**
 * Motor matemático seguro para resolver las fórmulas de los simuladores.
 * Usa mathjs en lugar de new Function() / eval() para evitar ejecución de
 * código arbitrario (OWASP A03 Injection).
 */
import { evaluate } from 'mathjs';

/**
 * Convierte funciones JS (Math.ceil, Math.max, etc.) al equivalente mathjs.
 * Las fórmulas en los JSON usan sintaxis JS; mathjs usa los mismos nombres
 * pero sin el prefijo "Math.".
 *
 * También traduce los operadores que mathjs NO entiende y que sí aparecen en
 * los JSON de actividades: `===`/`!==` (mathjs usa `==`/`!=`) y `&&`/`||`
 * (mathjs usa `and`/`or`). Sin esta traducción mathjs lanza "Value expected"
 * y `solveFormula` devuelve 0, que era la causa de que las condiciones de los
 * escenarios de los simuladores nunca se cumplieran.
 */
export function normalizeFormula(formula: string): string {
  return formula
    // Comparaciones contra literales de texto: mathjs no puede comparar
    // cadenas con `==` (intenta convertirlas a número y lanza), así que se
    // traducen a `equalText`. `string(...)` protege el caso en que la
    // variable llegue como número.
    .replace(/([A-Za-zÀ-ÿ_$][\w$À-ÿ]*)\s*!==\s*'([^']*)'/g, "not equalText(string($1), '$2')")
    .replace(/'([^']*)'\s*!==\s*([A-Za-zÀ-ÿ_$][\w$À-ÿ]*)/g, "not equalText(string($2), '$1')")
    .replace(/([A-Za-zÀ-ÿ_$][\w$À-ÿ]*)\s*===\s*'([^']*)'/g, "equalText(string($1), '$2')")
    .replace(/'([^']*)'\s*===\s*([A-Za-zÀ-ÿ_$][\w$À-ÿ]*)/g, "equalText(string($2), '$1')")
    .replace(/!==/g, '!=')
    .replace(/===/g, '==')
    .replace(/&&/g, ' and ')
    .replace(/\|\|/g, ' or ')
    .replace(/Math\.ceil\(/g, 'ceil(')
    .replace(/Math\.floor\(/g, 'floor(')
    .replace(/Math\.round\(/g, 'round(')
    .replace(/Math\.max\(/g, 'max(')
    .replace(/Math\.min\(/g, 'min(')
    .replace(/Math\.pow\(/g, 'pow(')
    .replace(/Math\.abs\(/g, 'abs(')
    .replace(/Math\.sqrt\(/g, 'sqrt(')
    .replace(/Math\.log\(/g, 'log(')
    .replace(/Math\.PI\b/g, 'pi')
    .replace(/Math\.E\b/g, 'e');
}

export function solveFormula(formula: string, variables: Record<string, number | string>): number {
  try {
    const normalized = normalizeFormula(formula);
    const result = evaluate(normalized, variables);
    const num = typeof result === 'boolean' ? (result ? 1 : 0) : Number(result);
    return isFinite(num) ? num : 0;
  } catch (error) {
    console.error('[MathEngine] Error resolviendo fórmula:', formula, error);
    return 0;
  }
}
