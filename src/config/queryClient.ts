import { QueryClient } from '@tanstack/react-query';

// Configuración de QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos"
      staleTime: 5 * 60 * 1000, // 5 minutos

      // Tiempo que los datos permanecen en cache
      gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)

      // Reintentos automáticos en caso de error
      retry: 2,

      // Refetch automático al enfocar la app
      refetchOnWindowFocus: true,

      // Refetch automático al reconectar internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentos para mutations
      retry: 0,
    },
  },
});
