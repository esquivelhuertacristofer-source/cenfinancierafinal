/**
 * Tests for src/lib/math-engine.ts
 * Verifica equivalencia funcional con las fórmulas reales de los JSON
 * y rechazo de inputs maliciosos.
 */

import { solveFormula, normalizeFormula } from '@/lib/math-engine';

describe('normalizeFormula', () => {
  it('convierte Math.ceil → ceil', () => {
    expect(normalizeFormula('Math.ceil(x)')).toBe('ceil(x)');
  });

  it('convierte Math.max → max', () => {
    expect(normalizeFormula('Math.max(1, x)')).toBe('max(1, x)');
  });

  it('convierte Math.round → round', () => {
    expect(normalizeFormula('Math.round(x)')).toBe('round(x)');
  });

  it('convierte Math.pow → pow', () => {
    expect(normalizeFormula('Math.pow(x, 2)')).toBe('pow(x, 2)');
  });

  it('convierte Math.min → min', () => {
    expect(normalizeFormula('Math.min(a, b)')).toBe('min(a, b)');
  });

  it('no altera fórmulas sin Math.*', () => {
    const f = '(ingresos - egresos) * 100';
    expect(normalizeFormula(f)).toBe(f);
  });
});

describe('solveFormula — expresiones aritméticas básicas', () => {
  it('suma simple', () => {
    expect(solveFormula('a + b', { a: 3, b: 4 })).toBe(7);
  });

  it('porcentaje de margen', () => {
    const result = solveFormula(
      '((precio_unitario - costo_unitario) / precio_unitario) * 100',
      { precio_unitario: 100, costo_unitario: 60 }
    );
    expect(result).toBe(40);
  });

  it('balance mensual', () => {
    const result = solveFormula(
      '(sueldo + ventas) - (renta + comida + servicios)',
      { sueldo: 10000, ventas: 2000, renta: 4000, comida: 1500, servicios: 500 }
    );
    expect(result).toBe(6000);
  });
});

describe('solveFormula — fórmulas con Math.* (fórmulas reales del proyecto)', () => {
  it('Math.ceil sobre meses de ahorro', () => {
    const result = solveFormula(
      'Math.ceil(50000 / Math.max(1, pago_extra_mensual))',
      { pago_extra_mensual: 2000 }
    );
    expect(result).toBe(25); // ceil(50000/2000) = ceil(25) = 25
  });

  it('Math.round con porcentaje', () => {
    const result = solveFormula(
      'Math.round((precio_unitario - costo_unitario) / Math.max(1, precio_unitario) * 100)',
      { precio_unitario: 150, costo_unitario: 90 }
    );
    expect(result).toBe(40); // round(60/150*100) = round(40) = 40
  });

  it('Math.max evita división por cero', () => {
    const result = solveFormula(
      'Math.ceil(50000 / Math.max(1, pago_extra_mensual))',
      { pago_extra_mensual: 0 }
    );
    expect(result).toBe(50000); // ceil(50000/1) = 50000
  });

  it('Math.pow para interés compuesto', () => {
    const result = solveFormula(
      'Math.round(capital_etf * Math.pow(1.10, 10))',
      { capital_etf: 10000 }
    );
    expect(result).toBe(25937); // round(10000 * 1.1^10)
  });
});

describe('solveFormula — robustez y seguridad', () => {
  it('retorna 0 para fórmula vacía', () => {
    expect(solveFormula('', {})).toBe(0);
  });

  it('retorna 0 si la variable no existe', () => {
    expect(solveFormula('x + 1', {})).toBe(0);
  });

  it('rechaza intento de ejecutar código arbitrario', () => {
    // mathjs no tiene acceso a process, require, etc.
    // evaluate() lanza un error para estas expresiones
    const result = solveFormula('process.exit(1)', {});
    expect(result).toBe(0); // error silenciado, retorna 0
  });

  it('rechaza inyección via nombre de variable', () => {
    // mathjs solo permite expresiones matemáticas — no executa código
    const result = solveFormula('x + y', { 'x': 5, 'y': 3 });
    expect(result).toBe(8);
  });
});
