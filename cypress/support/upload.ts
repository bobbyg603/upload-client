import 'cypress-file-upload';

// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    uploadFile(fixture: FixtureData | FixtureData[], processingOpts?: FileProcessingOptions): typeof uploadFile;
  }
}

function uploadFile(fixture: FixtureData | FixtureData[], processingOpts?: FileProcessingOptions): void {
  cy.visit('/');
  cy.get('[data-cy=open-upload-modal-button]').click();
  cy.get('[data-cy=upload-modal-drag-drop]')
    .get('input[type=file]')
    .attachFile(fixture, processingOpts);
  cy.get('[data-cy=upload-modal]')
    .get('ngb-progressbar')
    .should('contain.text', '100%');
  cy.get('[data-cy=upload-modal-close-button]').click();
}

Cypress.Commands.add('uploadFile', uploadFile);