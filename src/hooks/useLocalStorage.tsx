import { useEffect, useState, Dispatch, SetStateAction, useMemo } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  prefix: string = "FIB_"
): [T, Dispatch<SetStateAction<T>>] {
  const prefixedKey = useMemo(() => prefix + key, [prefix, key]);

  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue !== null) {
      try {
        // Use try-catch for type safety
        return JSON.parse(jsonValue) as T;
      } catch (error) {
        // Handle parsing error, e.g., corrupted data
        console.error("Error parsing stored value:", error);
      }
    }
    // Ensure type safety for defaultValue
    return typeof defaultValue === "function"
      ? (defaultValue as () => T)()
      : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]); // Include value in the dependency array

  return [value, setValue];
}
