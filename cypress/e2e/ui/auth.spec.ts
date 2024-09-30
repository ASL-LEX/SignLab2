describe('User Login', () => {
  before(() => {
    cy.resetDB();
    cy.firstTimeSetup();
    cy.login(Cypress.env('auth').testUID, undefined, Cypress.env('tenantID'));
  });

  it('show correct organizations', () => {
    cy.visit('/');
  });
});
