// ─── CURRICULUM TYPES ──────────────────────────────────────────────────────────
// Shared type definitions for new game mechanics components.

export type ActivityType =
  | 'SIMULADOR' | 'QUIZ' | 'ARRASTRA' | 'TRIVIA' | 'RELLENA'
  | 'DECIDE' | 'CONSTRUCTOR' | 'MEMORIA' | 'JUEGO' | 'RULETA'
  | 'BALANCE' | 'RADAR' | 'CRECIMIENTO' | 'CONTROL'
  | 'cochinito_vivo'
  | 'supermercado_caos'
  | 'familia_ramirez'
  | 'banco_del_tiempo'
  | 'inversor_a10'
  | 'primer_negocio'
  | 'negocia_sueldo'
  | 'crisis_room'
  | 'portfolio_builder';

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  xp: number;
  duration: number;
  pillar: number;
  unit: number;
  grade: string;
  content: Record<string, unknown>;
}
