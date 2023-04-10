describe('Stress the Doko app', function () {

    describe('write landing page', function () {

        const deploymentInitialLandingPage = 'http://localhost:3000'
        // const deploymentInitialLandingPage = 'https://beta-jsdoko.onrender.com'

        it('page can be opened and has correct content', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game',
            }).as('createGame')

            cy.visit(deploymentInitialLandingPage)
            cy.contains('Neues Spiel beginnen').click()
            cy.contains('OK').should('be.disabled')

            cy.get('#text-0').type('PlayerA')
            cy.get('#text-1').type('PlayerB')
            cy.get('#text-2').type('PlayerC')
            cy.get('#text-3').type('PlayerD')

            cy.get('#deleteButton-6').click()
            cy.get('#deleteButton-5').click()
            cy.get('#deleteButton-4').click()

            cy.contains('OK').should('not.be.disabled').click()

            cy.wait('@createGame')

            var genArr = Array.from({ length: 40 }, (v, k) => k + 1)
            cy.wrap(genArr).each(() => {
                cy.get('#currentDeal_PlayerA').type('{selectAll}{backspace}6')
                cy.get('#currentDeal_PlayerB')
                cy.get('#currentDeal_PlayerC')
                cy.get('#currentDeal_PlayerD').type('{selectAll}{backspace}6')

                cy.get('#bockereignisse').type('{selectAll}{backspace}2')

                cy.get('.dealButton').click()
            })

        })
    })
})