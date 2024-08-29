Cypress.Commands.add('resetDB', () => {
  cy.deleteMany({}, { collection: 'bucketinfos' });
  cy.deleteMany({}, { collection: 'datasetdownloadrequests' });
  cy.deleteMany({}, { collection: 'datasets' });
  cy.deleteMany({}, { collection: 'entries' });
  cy.deleteMany({}, { collection: 'entryuploads' });
  cy.deleteMany({}, { collection: 'organizations' });
  cy.deleteMany({}, { collection: 'projects' });
  cy.deleteMany({}, { collection: 'studies' });
  cy.deleteMany({}, { collection: 'studydownloadrequests' });
  cy.deleteMany({}, { collection: 'tags' });
  cy.deleteMany({}, { collection: 'trainingsets' }),
  cy.deleteMany({}, { collection: 'uploadsessions' }),
  cy.deleteMany({}, { collection: 'userorgs' }),
  cy.deleteMany({}, { collection: 'videofieldintermediates' }),
  cy.deleteMany({}, { collection: 'videofields' })
});

Cypress.Commands.add('firstTimeSetup', () => {
  // Make the default organization
  cy.insertOne({
    name: 'test-org',
    projectId: 'does-not-matter',
    authURL: 'does-not-matter',
    tenantID: Cypress.env('auth').tenantID
  }, { collection: 'organizations' });
});
