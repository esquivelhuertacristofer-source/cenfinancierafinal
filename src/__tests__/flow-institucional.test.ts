/**
 * Tests del flujo institucional CEN — end-to-end mock
 *
 * Cubre la cadena: alumno completa actividad → datos persisten con el shape
 * correcto → profesor puede consultarlos → cola offline se sincroniza.
 *
 * Estos tests NO usan Supabase real; verifican los contratos de datos entre
 * las capas de escritura (markActivityComplete) y lectura (getCompletedActivities,
 * MetricCards, TopAlumnos) que el bug del UUID_REGEX rompió silenciosamente.
 */

import React from "react";
import { render } from "@testing-library/react";
import { supabase } from "@/lib/supabase-browser";
import {
  markActivityComplete,
  getCompletedActivities,
  processSyncQueue,
} from "@/lib/hub";
import MetricCards from "@/components/dashboard/MetricCards";

const mockFrom = supabase.from as jest.Mock;

const STUDENT_UUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const ACTIVITY_ID = "ACT-P1-1-1-B";
const GROUP_ID = "b1ffcd00-1d1c-5fg9-cc7e-7cc0ce491b22";

// ─── Test 1 ───────────────────────────────────────────────────────────────────
// El payload que markActivityComplete escribe en 'intentos' debe contener todos
// los campos que el dashboard del profesor consulta (user_id, activity_id,
// status="completed", score, tiempo_segundos).
describe("Flujo 1: contrato de escritura — markActivityComplete escribe el shape correcto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem("cen_sync_queue");
  });

  it("escribe a intentos con payload completo y a progress con upsert idempotente", async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    const mockUpsert = jest.fn().mockResolvedValue({ error: null });

    mockFrom.mockReturnValue({
      insert: mockInsert,
      upsert: mockUpsert,
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });

    const result = await markActivityComplete(STUDENT_UUID, ACTIVITY_ID, {
      score: 85,
      tiempo_segundos: 120,
    });

    expect(result).toBe(true);

    // Ambas tablas fueron escritas
    const tables = mockFrom.mock.calls.map((c) => c[0]);
    expect(tables).toContain("intentos");
    expect(tables).toContain("progress");

    // Payload de intentos contiene los campos que el dashboard lee
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: STUDENT_UUID,
        activity_id: ACTIVITY_ID,
        status: "completed",
        score: 85,
        tiempo_segundos: 120,
      })
    );

    // Upsert en progress es idempotente (onConflict user_id,activity_id)
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: STUDENT_UUID,
        activity_id: ACTIVITY_ID,
      }),
      expect.objectContaining({ onConflict: "user_id,activity_id" })
    );
  });
});

// ─── Test 2 ───────────────────────────────────────────────────────────────────
// getCompletedActivities (lectura del dashboard) lee de la tabla 'progress'
// con el mismo user_id que markActivityComplete escribió.
// Verifica la consistencia del contrato entre escritura y lectura.
describe("Flujo 2: contrato de lectura — getCompletedActivities lee lo que markActivityComplete escribió", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devuelve la actividad completada cuando progress la contiene", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ activity_id: ACTIVITY_ID }],
        error: null,
      }),
    });

    const completed = await getCompletedActivities(STUDENT_UUID);

    expect(completed.has(ACTIVITY_ID)).toBe(true);
    // La query usa tabla 'progress' (no 'intentos') — consistente con lo que escribe markActivityComplete
    expect(mockFrom).toHaveBeenCalledWith("progress");
    // El filtro usa el mismo user_id que se usó al escribir
    const eqMock = mockFrom.mock.results[0].value.eq as jest.Mock;
    expect(eqMock).toHaveBeenCalledWith("user_id", STUDENT_UUID);
  });

  it("devuelve Set vacío cuando el alumno no tiene actividades registradas", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const completed = await getCompletedActivities(STUDENT_UUID);
    expect(completed.size).toBe(0);
  });
});

// ─── Test 3 ───────────────────────────────────────────────────────────────────
// Flujo offline completo:
//   1. Supabase no disponible → markActivityComplete falla → item queda en cola
//   2. Supabase vuelve → processSyncQueue reintenta → cola queda vacía
// Este flujo ocurre silenciosamente en producción; sin este test no hay
// garantía de que los alumnos no pierdan progreso.
describe("Flujo 3: resiliencia offline — actividad encolada se sincroniza cuando vuelve la red", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem("cen_sync_queue");
  });

  it("cola vacía después de que processSyncQueue procesa el item exitosamente", async () => {
    // Paso 1: red caída — ambas escrituras fallan
    mockFrom.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: { message: "Network error", code: "NETWORK" } }),
      upsert: jest.fn().mockResolvedValue({ error: { message: "Network error", code: "NETWORK" } }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });

    const result = await markActivityComplete(STUDENT_UUID, ACTIVITY_ID);
    expect(result).toBe(false);

    let queue = JSON.parse(localStorage.getItem("cen_sync_queue") ?? "[]");
    expect(queue.length).toBe(1);
    expect(queue[0].userId).toBe(STUDENT_UUID);
    expect(queue[0].activityId).toBe(ACTIVITY_ID);

    // Paso 2: red recuperada — upsert en processSyncQueue tiene éxito
    mockFrom.mockReturnValue({
      upsert: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });

    await processSyncQueue();

    queue = JSON.parse(localStorage.getItem("cen_sync_queue") ?? "[]");
    expect(queue.length).toBe(0); // Cola limpia tras sincronización exitosa
  });
});

// ─── Test 4 ───────────────────────────────────────────────────────────────────
// MetricCards con teacherGroupIds consulta 'alumnos_grupos' (esquema nuevo),
// NO 'profiles' directamente. Verifica que el componente usa la ruta correcta
// cuando el profesor ya tiene grupos asignados en el esquema institucional.
describe("Flujo 4: vista del profesor — MetricCards usa alumnos_grupos con esquema nuevo", () => {
  beforeEach(() => jest.clearAllMocks());

  it("consulta alumnos_grupos y no profiles cuando teacherGroupIds está presente", async () => {
    const mockIn = jest.fn().mockResolvedValue({ count: 3, data: [], error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      in: mockIn,
      eq: jest.fn().mockReturnThis(),
    });

    render(React.createElement(MetricCards, { teacherGroupIds: [GROUP_ID] }));

    // Esperar microtasks del fetch
    await new Promise((r) => setTimeout(r, 50));

    const queriedTables: string[] = mockFrom.mock.calls.map((c: string[]) => c[0]);
    expect(queriedTables).toContain("alumnos_grupos");
    // Con esquema nuevo NO debe contar alumnos desde 'profiles' directamente
    expect(queriedTables).not.toContain("profiles");
  });
});

// ─── Test 5 ───────────────────────────────────────────────────────────────────
// Prevención de regresión del bug UUID_REGEX:
// La misma UUID que usa markActivityComplete para ESCRIBIR debe ser aceptada
// por addToSyncQueue cuando hay un fallo. Si el regex vuelve a ser incorrecto
// (como ocurrió hoy), este test falla inmediatamente.
describe("Flujo 5: prevención de regresión UUID — write UUID debe ser válida para la cola de sync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem("cen_sync_queue");
  });

  it("la UUID de producción (formato 8-4-4-4-12) es aceptada por la cola de sync", async () => {
    // UUIDs reales de producción con los 5 grupos (formato estándar RFC 4122)
    const productionUUIDs = [
      "550e8400-e29b-41d4-a716-446655440000", // v4 estándar
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8", // v1 estándar
      "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // otro v4
    ];

    for (const uuid of productionUUIDs) {
      localStorage.removeItem("cen_sync_queue");
      jest.clearAllMocks();

      mockFrom.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: { message: "fail", code: "ERR" } }),
        upsert: jest.fn().mockResolvedValue({ error: { message: "fail", code: "ERR" } }),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      });

      await markActivityComplete(uuid, ACTIVITY_ID);

      const queue = JSON.parse(localStorage.getItem("cen_sync_queue") ?? "[]");
      // Si el UUID_REGEX falla, la cola tendrá 0 items → regresión detectada
      expect(queue.length).toBe(1);
      expect(queue[0].userId).toBe(uuid);
    }
  });

  it("UUIDs malformados son rechazados por la cola de sync (no contaminan)", async () => {
    const invalidUUIDs = [
      "not-a-uuid",
      "550e8400-e29b-41d4-a716",              // truncado
      "550e8400e29b41d4a716446655440000",     // sin guiones
      "guest_user",
      "",
    ];

    for (const uuid of invalidUUIDs) {
      localStorage.removeItem("cen_sync_queue");
      jest.clearAllMocks();

      mockFrom.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: { message: "fail" } }),
        upsert: jest.fn().mockResolvedValue({ error: { message: "fail" } }),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      });

      await markActivityComplete(uuid, ACTIVITY_ID);

      const queue = JSON.parse(localStorage.getItem("cen_sync_queue") ?? "[]");
      expect(queue.length).toBe(0);
    }
  });
});
