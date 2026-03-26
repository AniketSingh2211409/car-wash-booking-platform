export const getStorageItem = (key: string, defaultValue: string = ''): string => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) || defaultValue;
    }
  } catch (error) {
    console.warn(`Error accessing localStorage for key "${key}":`, error);
  }
  return defaultValue;
};

export const setStorageItem = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`Error setting localStorage for key "${key}":`, error);
  }
};
