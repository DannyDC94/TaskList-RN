import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api';

// Instancia principal de Axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para requests (peticiones salientes)
apiClient.interceptors.request.use(
  config => {
    // Log de peticiones en desarrollo
    if (__DEV__) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
      });
    }

    config.headers.userId = API_CONFIG.USER_ID;

    //  Agregar token de autenticación si existe
    // const token = getAuthToken(); // Implementar después
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log(config);

    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

// ✅ Interceptor para responses (respuestas entrantes)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de respuestas en desarrollo
    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  error => {
    // ✅ Manejo centralizado de errores
    console.error('Response Error:', error);

    if (error.response) {
      // Error del servidor (4xx, 5xx)
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.log('No autorizado - Redirigir a login');
          // handleUnauthorized(); // Implementar después
          break;
        case 403:
          console.log('Acceso prohibido');
          break;
        case 404:
          console.log('Recurso no encontrado');
          break;
        case 500:
          console.log('Error del servidor');
          break;
        default:
          console.log(`Error ${status}:`, data?.message || 'Error desconocido');
      }
    } else if (error.request) {
      // Error de red
      console.log('Error de conexión - Sin respuesta del servidor');
    } else {
      // Error de configuración
      console.log('Error de configuración:', error.message);
    }

    return Promise.reject(error);
  },
);

// Funciones helper para diferentes tipos de peticiones
export const apiRequest = {
  // GET request
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

// Función para construir URLs de endpoints
export const buildEndpoint = (
  endpoint: string,
  params?: Record<string, string | number>,
): string => {
  let url = endpoint;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }

  return url;
};

// Función para manejar errores de API de forma consistente
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Error del servidor
    return {
      message: error.response.data?.message || 'Error del servidor',
      status: error.response.status,
      code: error.response.data?.code,
      details: error.response.data,
    };
  } else if (error.request) {
    // Error de red
    return {
      message: 'Error de conexión. Verifica tu internet.',
      status: 0,
      code: 'NETWORK_ERROR',
    };
  } else {
    // Error de configuración
    return {
      message: error.message || 'Error inesperado',
      code: 'CONFIG_ERROR',
    };
  }
};
