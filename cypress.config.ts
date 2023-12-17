import { defineConfig } from "cypress";
import 'dotenv/config';

const wantedEnvVars = ["STAFF_USERNAME", "STAFF_PASSWORD"];
const envVars = wantedEnvVars.reduce((acc, curr) => {
  acc[curr] = process.env[curr];
  return acc;
}, {})

export default defineConfig({
  env: envVars,
  e2e: {
    baseUrl: 'https://goal-dev.mdx.ac.uk/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
