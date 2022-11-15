import { useRef, useEffect } from "react";

export const useOnMount = (cb: () => void) => {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current) {
      cb();
    }
    return () => {
      isLoaded.current = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
