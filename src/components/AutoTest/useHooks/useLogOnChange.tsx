import { useEffect, useRef } from "react";

/**
 * `console.log` when the `val` has changed from a previous render.
 * @param val - The value to check on change
 * @param name - The name of the variable to output to the console.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLogOnChange = (val: any, name?: string) => {
  const prevVal = useRef(val);

  //* If there is a .current then we are dealing with a useRef.
  //* useRef won't call a useEffect on change so we deal with it when the function is called.
  if (val?.current) {
    if (JSON.stringify(prevVal) !== JSON.stringify(val)) {
      console.log(`${name} changed`, val);
      prevVal.current = val.current;
    }
  }
  useEffect(() => {
    if (JSON.stringify(prevVal.current) !== JSON.stringify(val)) {
      console.log(`${name} changed`, val);
      prevVal.current = val;
    }
  }, [name, val]);
};
