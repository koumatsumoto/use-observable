import { useEffect, useMemo, useState } from "react";
import { type Observable } from "rxjs";

export function useObservable<T>(observable: Observable<T>, options: { defaultValue: T }): T;
export function useObservable<T>(observable: Observable<T>, options?: { defaultValue?: T }): T | undefined {
  const initialValue = useMemo(() => {
    return options && "defaultValue" in options ? options.defaultValue : getCurrentValue(observable);
  }, [observable, options]);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const subscription = observable.subscribe((v) => setValue(v));
    return () => subscription.unsubscribe();
  }, [observable, options]);

  return value;
}

function getCurrentValue<T>(observable: Observable<T>): T | undefined {
  if ("getValue" in observable && typeof observable.getValue === "function") {
    return observable.getValue();
  } else {
    return undefined;
  }
}
