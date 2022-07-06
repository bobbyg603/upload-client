describe('Download', () => {
    const filePath = 'car.jpg';
    const fileName = `test-${Math.random() * 10000000}.jpg`;
    beforeEach(() => {
        cy.task('uploadFile', { filePath, fileName });
    });

    it('should download file', () => {
        throw new Error('todo bg');
    });
});
