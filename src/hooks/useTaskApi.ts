import { useState, useCallback } from 'react';
import { TaskFormData } from '../schema/taskSchema';
import { taskService } from '../services/taskService';

export const useTaskApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = useCallback(
    async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error('Error en API request:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    clearError,

    // Métodos que wrappean las llamadas de API
    getAllTasks: () => executeRequest(() => taskService.getAllTask()),
    getTask: (id: string) => executeRequest(() => taskService.getTaskById(id)),
    createTask: (data: TaskFormData) =>
      executeRequest(() => taskService.createTask(data)),
    updateTask: (id: string, data: TaskFormData) =>
      executeRequest(() => taskService.updateTask(id, data)),
    deleteTask: (id: string) =>
      executeRequest(() => taskService.deleteTask(id)),
  };
};
