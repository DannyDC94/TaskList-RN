export const statusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'En Progreso', value: 'inProgress' },
  { label: 'Completada', value: 'complete' },
] as const;


export type TaskStatus = typeof statusOptions[number]['value'];

export function getStatusLabel(value: TaskStatus | string): string {
  const status = statusOptions.find((s) => s.value === value);
  return status?.label ?? 'Desconocido';
}
