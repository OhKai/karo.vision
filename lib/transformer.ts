import superjson from "superjson";
import { uneval } from "devalue";

// devalue is faster than superjson but unsafe for user input on the server.
export const transformer = {
  input: superjson,
  output: {
    serialize: (object: any) => uneval(object),
    // This `eval` only ever happens on the **client**
    deserialize: (object: any) => eval(`(${object})`),
  },
};
