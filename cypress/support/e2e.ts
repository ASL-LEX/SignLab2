import { addCommands } from 'cypress-mongodb/dist/index-browser';
import { attachCustomCommands } from 'cypress-firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
// import firebase from '@firebase/app';
// import * as firebase from '@firebase/app';

// cypress-firebase setup
firebase.initializeApp({
  apiKey: Cypress.env('auth').apiKey,
  authDomain: Cypress.env('auth').authDomain
});
attachCustomCommands({ Cypress, cy, firebase });

// cypress-mongodb setup
addCommands();

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
