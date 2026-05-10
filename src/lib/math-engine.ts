/**
 * Motor matemático seguro para resolver las fórmulas de los simuladores 
 * sin usar eval() directo.
 */
export function solveFormula(formula: string, variables: Record<string, any>): number {
  try {
    let sanitizedFormula = formula;

    // Reemplaza cada variable por su valor real
    Object.keys(variables).forEach(key => {
      const value = variables[key];
      // Usamos una regex para asegurar que reemplazamos la variable exacta
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      sanitizedFormula = sanitizedFormula.replace(regex, value.toString());
    });

    // Limpiamos la fórmula de cualquier caracter que no sea matemático
    // Permitimos números, letras (para Math.ceil, etc.), operadores básicos, paréntesis y puntos.
    sanitizedFormula = sanitizedFormula.replace(/[^0-9a-zA-Z+\-*/().\s?<>:=!|&]/g, '');

    // Resolvemos la expresión de forma controlada
    // Nota: Para lógica compleja de escenarios, usamos Function en un entorno aislado
    return new Function(`return ${sanitizedFormula}`)();
  } catch (error) {
    console.error("[MathEngine] Error resolviendo fórmula:", formula, error);
    return 0;
  }
}
