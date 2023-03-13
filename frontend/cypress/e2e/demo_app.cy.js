describe('Template app', function () {

    describe('basic functionality', function () {

        it('page can be opened and has a working button', function () {
            cy.visit('http://localhost:3000')
            cy.contains('Get answer').click()
            cy.contains('Answer: 42')
        })
    })

})