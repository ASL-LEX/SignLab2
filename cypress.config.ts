import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import { configurePlugin } from 'cypress-mongodb';

dotenv.config();

export default defineConfig({
  env: {
    mongodb: {
      uri: process.env.CYPRESS_MONGO_URI,
      database: process.env.CYPRESS_MONGO_DB
    }
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, _config) {
      configurePlugin(on);
    },
  }
});
