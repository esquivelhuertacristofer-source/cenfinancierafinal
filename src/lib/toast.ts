import { toast } from "sonner";

export const notify = {
  success: (msg: string) => toast.success(msg, { duration: 3000 }),
  error: (msg: string) => toast.error(msg, { duration: 5000 }),
  info: (msg: string) => toast(msg, { duration: 3000 }),
  loading: (msg: string) => toast.loading(msg),
  dismiss: (id?: string | number) => toast.dismiss(id),

  /** Activity completed */
  activityDone: () =>
    toast.success("¡Actividad completada!", {
      description: "Tu progreso ha sido guardado.",
      duration: 3000,
    }),

  /** Activity saved offline (queue) */
  activityQueued: () =>
    toast("Sin conexión — actividad guardada localmente", {
      description: "Se sincronizará cuando recuperes la conexión.",
      duration: 5000,
    }),

  /** Admin: users created */
  usersCreated: (count: number, errors: number) => {
    if (errors === 0) {
      toast.success(`${count} usuario${count === 1 ? "" : "s"} creado${count === 1 ? "" : "s"} exitosamente.`, { duration: 4000 });
    } else {
      toast(`${count} creado${count === 1 ? "" : "s"}, ${errors} con error`, {
        description: "Revisa los detalles en la tabla.",
        duration: 6000,
      });
    }
  },

  /** Generic fetch error */
  fetchError: () =>
    toast.error("No se pudieron cargar los datos", {
      description: "Verifica tu conexión e intenta de nuevo.",
      duration: 5000,
    }),
};
