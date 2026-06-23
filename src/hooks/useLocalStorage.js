import { useState } from "react";

function useLocalStorage(key, initialValue = null) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? stored : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, newValue);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeStoredValue = () => {
    try {
      localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.log(error);
    }
  };

  return [value, setStoredValue, removeStoredValue];
}

export default useLocalStorage;