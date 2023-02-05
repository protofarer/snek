/// <reference types="vitest" />

// import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // root: "/home/kenny/projects/kenny.net/app/",
    globals: true,
    environment: "jsdom",
    // setupFiles: [
    //   "./test/setup-test-env.ts", 
    //   "node_modules/dotenv/config"
    // ],
    exclude: ["node_modules", "mocks/**/*.{js,ts}"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["app/**/*.{js,ts}"],
      all: true,
    },
  },
  // resolve: {
  //   alias: {
  //     "~": path.resolve(__dirname, "./game"),
  //   }
  // }
});
