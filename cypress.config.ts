import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import { configurePlugin } from 'cypress-mongodb';
import { plugin as cypressFirebasePlugin } from 'cypress-firebase';
import admin from 'firebase-admin';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

dotenv.config();

export default defineConfig({
  env: {
    mongodb: {
      uri: process.env.CYPRESS_MONGO_URI,
      database: process.env.CYPRESS_MONGO_DB
    },
    auth: {
      tenantID: process.env.CYPRESS_TENANT_ID,
      apiKey: process.env.CYPRESS_FIREBASE_API_KEY,
      authDomain: process.env.CYPRESS_FIREBASE_AUTH_DOMAIN,
      testUID: process.env.CYPRESS_DEFAULT_UID
    }
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      configurePlugin(on);
      cypressFirebasePlugin(on, config, admin);
    },
  }
});
