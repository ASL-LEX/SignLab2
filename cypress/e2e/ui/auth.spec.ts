describe('User Login', () => {
  before(() => {
    cy.resetDB();
    cy.firstTimeSetup();
  });

  it('show correct organizations', () => {
    cy.visit('/');
  });
});
