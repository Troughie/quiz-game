import { useState } from "react";

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  };

  const remove = () => {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      console.error(err);
    }
  };

  return { storedValue, setValue, remove } as const;
}
