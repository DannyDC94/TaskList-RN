import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = () => {
  const getAsyncStorage = async <T>(key: string): Promise<T | null> => {
    try {
      const store = await AsyncStorage.getItem(key);
      if (store !== null) {
        const storeParsed = JSON.parse(store);
        return storeParsed as T;
      }
      return null;
    } catch (error) {
      console.error(`Error al obtener ${key}:`, error);
      return null;
    }
  };

  const setAsyncStorage = async <T>(
    key: string,
    values: T,
  ): Promise<boolean> => {
    try {
      if (!key) {
        console.error('La clave (key) es requerida');
        return false;
      }
      const storeSerialized = JSON.stringify(values);
      await AsyncStorage.setItem(key, storeSerialized);
      return true;
    } catch (error) {
      console.error(`Error al guardar ${key}:`, error);
      return false;
    }
  };

  const deleteAsyncStorage = async (key: string): Promise<boolean> => {
    try {
      if (!key) {
        console.error('La clave (key) es requerida');
        return false;
      }
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar ${key}:`, error);
      return false;
    }
  };

  const existsInStorage = async (key: string): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error al verificar si existe ${key}:`, error);
      return false;
    }
  };

  return {
    getAsyncStorage,
    setAsyncStorage,
    deleteAsyncStorage,
    existsInStorage,
  };
};
