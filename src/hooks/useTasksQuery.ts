import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { TaskApiResponse, TaskFormData, TaskFormUpdate } from '../schema/taskSchema';

// Query Keys - Centralizar las claves de cache
export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...taskQueryKeys.lists(), { filters }] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskQueryKeys.details(), id] as const,
  search: (query: string) => [...taskQueryKeys.all, 'search', query] as const,
};

// Query para obtener todas las tareas
export const useTasksQuery = () => {
  return useQuery({
    queryKey: taskQueryKeys.lists(),
    queryFn: () => taskService.getAllTask(),
    select: data => {
      // Opcional: transformar datos aquí
      return data.map(task => ({
        ...task,
      }));
    },
  });
};

// Query para obtener una tarea específica
export const useTaskQuery = (id: string) => {
  return useQuery({
    queryKey: taskQueryKeys.detail(id),
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id, // Solo ejecutar si hay ID
  });
};

// Mutation para crear tarea
export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskFormData) => taskService.createTask(data),

    // Optimistic Update - Actualizar UI inmediatamente
    onMutate: async newTask => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });

      // Snapshot del estado previo
      const previousTasks = queryClient.getQueryData(taskQueryKeys.lists());

      // Actualizar cache optimísticamente
      queryClient.setQueryData(
        taskQueryKeys.lists(),
        (old: TaskApiResponse[] = []) => [
          ...old,
          {
            ...newTask,
          } as TaskApiResponse,
        ],
      );

      return { previousTasks };
    },

    // ✅ En caso de éxito
    onSuccess: newTask => {
      console.log('Tarea creada:', newTask);

      // Invalidar y refetch para obtener datos actualizados del servidor
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },

    // En caso de error, revertir cambios optimistas
    onError: (error, newTask, context) => {
      console.error('Error creando tarea:', error);

      // Revertir al estado anterior
      if (context?.previousTasks) {
        queryClient.setQueryData(taskQueryKeys.lists(), context.previousTasks);
      }
    },

    // Siempre se ejecuta al final
    onSettled: () => {
      // Opcional: refetch después de cualquier resultado
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
};

// Mutation para actualizar tarea
export const useUpdateTaskMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, updates }: { id: TaskApiResponse['id']; updates: TaskFormUpdate }) =>
        taskService.updateTask(id, updates),
  
      onMutate: async ({ id, updates }) => {
        await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });
        await queryClient.cancelQueries({ queryKey: taskQueryKeys.detail(id) });
  
        const previousTasks = queryClient.getQueryData(taskQueryKeys.lists());
        const previousTask = queryClient.getQueryData(taskQueryKeys.detail(id));
  
        // Actualizar cache optimísticamente
        queryClient.setQueryData(
          taskQueryKeys.lists(),
          (old: TaskApiResponse[] = []) =>
            old.map(task => (task.id === id ? { ...task, ...updates } : task)),
        );
  
        // Actualizar cache del detalle si existe
        if (previousTask) {
          queryClient.setQueryData(
            taskQueryKeys.detail(id),
            (old: TaskApiResponse) => ({
              ...old,
              ...updates,
            }),
          );
        }
  
        return { previousTasks, previousTask };
      },
  
      onSuccess: (updatedTask, { id }) => {
        console.log('Tarea actualizada:', updatedTask);
        queryClient.setQueryData(
          taskQueryKeys.detail(id), // ← Usar el id del parámetro
          updatedTask, // ← updatedTask SÍ tiene id porque viene del backend
        );
  
        // Invalidar lista para refrescar
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      },
  
      onError: (error, { id }, context) => {
        console.error('Error actualizando tarea:', error);
  
        // Revertir cambios
        if (context?.previousTasks) {
          queryClient.setQueryData(taskQueryKeys.lists(), context.previousTasks);
        }
        if (context?.previousTask) {
          queryClient.setQueryData(
            taskQueryKeys.detail(id),
            context.previousTask,
          );
        }
      },
    });
  };

// Mutation para eliminar tarea
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),

    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });

      const previousTasks = queryClient.getQueryData(taskQueryKeys.lists());

      // Remover optimísticamente
      queryClient.setQueryData(
        taskQueryKeys.lists(),
        (old: TaskApiResponse[] = []) => old.filter(task => task.id !== id),
      );

      return { previousTasks };
    },

    onSuccess: (_, deletedId) => {
      console.log('Tarea eliminada:', deletedId);

      // Remover del cache
      queryClient.removeQueries({ queryKey: taskQueryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },

    onError: (error, deletedId, context) => {
      console.error('Error eliminando tarea:', error);

      if (context?.previousTasks) {
        queryClient.setQueryData(taskQueryKeys.lists(), context.previousTasks);
      }
    },
  });
};

// Hook combinado para facilitar el uso
export const useTasks = () => {
  const tasksQuery = useTasksQuery();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  return {
    // Estado
    tasks: tasksQuery.data || [],
    loading:
      tasksQuery.isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      tasksQuery.error?.message ||
      createMutation.error?.message ||
      updateMutation.error?.message ||
      deleteMutation.error?.message,
    isRefetching: tasksQuery.isRefetching,

    // Acciones
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,

    // Funciones de utilidad
    refetch: tasksQuery.refetch,

    // Estados individuales de mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Errores individuales
    createError: createMutation.error?.message,
    updateError: updateMutation.error?.message,
    deleteError: deleteMutation.error?.message,
  };
};

export default useTasks;
