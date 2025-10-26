import { useState } from "react";

/**
 * Side-effect free change handler that doesn't require a useEffect and immediately updates during
 * render.
 */
const useChange = (value: any, handler: () => void, includeInitial = false) => {
  // Only initialize prev with value on the first render if includeInitial is false.
  const [prev, setPrev] = useState(includeInitial ? Symbol() : value);

  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (prev !== value) {
    setPrev(value);
    handler();
  }
};

export default useChange;
