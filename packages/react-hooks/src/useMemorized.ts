import { useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';

export const useMemorized = <T extends unknown>(value: T): T => {
  const [_value, setValue] = useState<T>(value);
  const ref = useRef<T>(value);

  useEffect(() => {
    if (JSON.stringify(ref.current) !== JSON.stringify(value)) {
      ref.current = value;
      setValue(value);
    }
  }, [value, setValue]);

  return _value;
};

export const useMemState = <T extends unknown>(defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [_value, _setValue] = useState<T>(defaultValue);
  const ref = useRef<T>(defaultValue);

  const setValue = useCallback((value: T) => {
    if (JSON.stringify(value) !== JSON.stringify(ref.current)) {
      _setValue(value);
    }
  }, [_setValue]) as Dispatch<SetStateAction<T>>;

  return [_value, setValue];
};
