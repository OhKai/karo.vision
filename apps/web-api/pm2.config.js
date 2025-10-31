module.exports = {
  title: "Karo.Vision Web API", // Name of your application
  script: "dist/main.js", // Entry point of your application
  interpreter: "bun", // Bun interpreter
  env: {
    NODE_ENV: "production",
    PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
  },
};
