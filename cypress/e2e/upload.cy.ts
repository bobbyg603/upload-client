describe('Upload', () => {
  const filePath = 'car.jpg';
  const fileName = `test-${Math.random() * 10000000}.jpg`;
  it('should upload a file and refresh the files list', () => {
    cy.uploadFile({ filePath, fileName });
    cy.get('[data-cy=files-table]').should('contain.text', fileName);
  });
});