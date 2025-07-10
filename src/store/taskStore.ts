import { create } from 'zustand';
import { Task } from '../types';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/generateId';

interface TaskState {
  // Estado
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // Acciones
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (
    id: Task['id'],
    updateData: Partial<Omit<Task, 'id' | 'createdAt'>>,
  ) => void;
  deleteTask: (id: Task['id']) => void;
  cleanTasks: () => void;

  // Estados de loading y error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      tasks: [],
      loading: false,
      error: null,
      // Agregar funciones
      addTask: taskData => {
        try {
          const newTask = {
            ...taskData,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };
          set(state => ({
            tasks: [...state.tasks, newTask],
            error: null,
          }));
        } catch (error) {
          console.error('Error agregando tarea:', error);
          set({ error: 'Error al agregar la tarea' });
        }
      },
      updateTask: (id, updateData) => {
        try {
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === id ? { ...task, ...updateData } : task,
            ),
            error: null,
          }));
        } catch (error) {
          console.error('Error actualizando tarea:', error);
          set({ error: 'Error al actualizar la tarea' });
        }
      },
      deleteTask: id => {
        try {
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== id),
            error: null,
          }));
        } catch (error) {
          console.error('Error eliminando tarea:', error);
          set({ error: 'Error al eliminar la tarea' });
        }
      },
      cleanTasks: () => set({ tasks: [], error: null }),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        tasks: state.tasks,
      }),
      onRehydrateStorage: () => state => {
        console.log('Tareas cargadas desde storage:', state?.tasks.length || 0);
      },
    },
  ),
);

// Hook combinado para facilidad de uso
export const useTasks = () => {
  const state = useTaskStore();

  return {
    // Estado
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,

    // Acciones
    addTask: state.addTask,
    updateTask: state.updateTask,
    deleteTask: state.deleteTask,
    cleanTasks: state.cleanTasks,

    // Error handling
    setError: state.setError,
    clearError: state.clearError,
  };
};

// Hooks personalizados para casos específicos
// export const useTaskActions = () => {
//   const addTask = useTaskStore(state => state.addTask);
//   const updateTask = useTaskStore(state => state.updateTask);
//   const deleteTask = useTaskStore(state => state.deleteTask);
//   const cleanTasks = useTaskStore(state => state.cleanTasks);

//   return { addTask, updateTask, deleteTask, cleanTasks };
// };

// export const useTaskData = () => {
//   const tasks = useTaskStore(state => state.tasks);
//   const loading = useTaskStore(state => state.loading);
//   const error = useTaskStore(state => state.error);

//   return { tasks, loading, error };
// };
