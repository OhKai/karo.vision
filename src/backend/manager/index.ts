import { scanFolder } from "./fs";

export const initManager = async () => {
  console.log("initManager");
  const files = scanFolder("./src");
  for await (const file of files) {
    console.log(file);
  }
};
