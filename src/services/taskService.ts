import { API_CONFIG } from '../config/api';
import { apiRequest, buildEndpoint, handleApiError } from './apiClient';
import { TaskApiResponse, TaskFormData, TaskFormUpdate } from '../schema/taskSchema';
import { ApiResponse } from '../types/api';

export class TaskService {
  private readonly endpoint = API_CONFIG.ENDPOINTS.TASKS;
  async getAllTask(): Promise<TaskApiResponse[]> {
    try {
      const response = await apiRequest.get<TaskApiResponse[]>(this.endpoint);
      return response.data || [];
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Error obteniendo tareas:', apiError);
      throw new Error(apiError.message);
    }
  }
  // Obtener una tarea por ID
  async getTaskById(id: string): Promise<TaskApiResponse> {
    try {
      const url = buildEndpoint(`${this.endpoint}/:id`, { id });
      const response = await apiRequest.get<TaskApiResponse>(url);
      
      if (!response.data) {
        throw new Error('Tarea no encontrada');
      }
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error obteniendo tarea ${id}:`, apiError);
      throw new Error(apiError.message);
    }
  }

  async createTask(taskData: TaskFormData): Promise<TaskApiResponse> {
    try {
      console.log('Creando tarea:', taskData);
      
      const response = await apiRequest.post<TaskApiResponse>(
        this.endpoint,
        taskData
      );
      
      if (!response.data || !response.data.id) {
        throw new Error('Error creando la tarea');
      }
      
      console.log('Tarea creada:', response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error('Error creando tarea:', apiError);
      throw new Error(apiError.message);
    }
  }

  async updateTask(id: string, updates: TaskFormUpdate): Promise<TaskApiResponse> {
    try {
      console.log(`Actualizando tarea ${id}:`, updates);
      
      const url = buildEndpoint(`${this.endpoint}/:id`, { id });
      const response = await apiRequest.put<TaskApiResponse>(
        url,
        updates
      );
      
      if (!response.data || !response.data.id) {
        throw new Error('Error actualizando la tarea');
      }
      
      console.log('Tarea actualizada:', response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error actualizando tarea ${id}:`, apiError);
      throw new Error(apiError.message);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      console.log(`Eliminando tarea ${id}`);
      
      const url = buildEndpoint(`${this.endpoint}/:id`, { id });
      await apiRequest.delete(url);
      
      console.log('Tarea eliminada exitosamente');
    } catch (error) {
      const apiError = handleApiError(error);
      console.error(`Error eliminando tarea ${id}:`, apiError);
      throw new Error(apiError.message);
    }
  }
}

export const taskService = new TaskService();
