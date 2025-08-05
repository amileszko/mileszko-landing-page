import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { config as dotenvConfig } from "dotenv";
import path from "node:path";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

const requiredPublicEnvVars = ["API_URL"];
const optionalPublicEnvVars = ["GOOGLE_TAG_MANAGER_ID"];

export default defineConfig(() => {
  dotenvConfig();

  const port = 3000;

  for (const key of requiredPublicEnvVars) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    process.env[`VITE_${key}`] = process.env[key];
  }

  for (const key of optionalPublicEnvVars) {
    if (process.env[key]) {
      process.env[`VITE_${key}`] = process.env[key];
    }
  }

  process.env.VITE_HOST_NAME = process.env.HOST_NAME ?? `https://localhost:${port}`;

  return {
    plugins: [
      tailwindcss(),
      react(),
      mkcert(),
      vike(),
    ],

    preview: {
      host: "0.0.0.0",
      port,
    },

    resolve: {
      alias: {
        "@components": path.resolve(
          import.meta.dirname,
          "src/components",
        ),
        "@utils": path.resolve(
          import.meta.dirname,
          "src/utils",
        ),
      },
    },

    server: {
      host: "0.0.0.0",
      port,
    },
  };
});
