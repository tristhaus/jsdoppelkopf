describe('Doko app', function () {

    describe('initialization', function () {

        it('page can be opened and has a working New Game button', function () {
            cy.visit('http://localhost:3000')
            cy.contains('Start new game').click()
            cy.contains('writerId:')
            cy.contains('readerId:')
        })
    })
})