import { useState } from "react";

/**
 * Side-effect free change handler that doesn't require a useEffect and immediately updates during
 * render.
 * @param value
 * @param handler
 */
const useChange = (value: any, handler: () => void) => {
  const [prev, setPrev] = useState(value);

  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (prev !== value) {
    setPrev(value);
    handler();
  }
};

export default useChange;
