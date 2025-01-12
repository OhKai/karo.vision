namespace NodeJS {
  interface ProcessEnv {
    // We use config.ts instead of .env since we don't need to set vars after build and .env files
    // are inconvenient for standalone executables.
    //  DB_FILE_NAME: string;
    //  PORT: string;
  }
}
