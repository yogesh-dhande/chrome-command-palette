import path from "path";
import { defineNuxtConfig } from "nuxt";
const deployTarget = process.env.DEPLOY_TARGET || "development";
console.log("deploy target: ", deployTarget);

require("dotenv").config({
  path: path.resolve(__dirname, `envs/.env.${deployTarget}.local`),
});

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false,
  },
  modules: ["@nuxtjs/tailwindcss"],
  buildModules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      baseUrl: "https://singledispatch.com",
      apiKey: process.env.NUXT_ENV_FIREBASE_CONFIG_API_KEY,
      authDomain: process.env.NUXT_ENV_FIREBASE_CONFIG_AUTH_DOMAIN,
      projectId: process.env.NUXT_ENV_FIREBASE_CONFIG_PROJECT_ID,
      storageBucket: process.env.NUXT_ENV_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_ENV_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_ENV_APP_ID,
      functionsUrl: process.env.NUXT_ENV_FIREBASE_FUNCTIONS_URL,
      useFirebaseEmulators: deployTarget === "development",
      analyticsApiKey: process.env.NUXT_ENV_ANALYTICS_API_KEY,
      extensionID: process.env.NUXT_ENV_EXTENSION_ID,
    },
  },
});
