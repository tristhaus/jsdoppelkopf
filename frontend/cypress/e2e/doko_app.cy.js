describe('Doko app', function () {

    describe('initialization', function () {

        it('page can be opened and has a working New Game button', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')
            cy.contains('Neues Spiel beginnen').click()
        })

        it('player entry dialog can be opened and cancelled', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')
            cy.contains('Neues Spiel beginnen').click()
            cy.contains('Abbrechen').click()
        })

        it('player entry dialog with valid data can be closed by OK', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')
            cy.contains('Neues Spiel beginnen').click()
            cy.contains('OK').should('be.disabled')

            cy.get('#text-0').type('A')
            cy.get('#text-1').type('B')
            cy.get('#text-2').type('C')
            cy.get('#text-3').type('D')
            cy.get('#text-4').type('E')
            cy.get('#text-5').type('F')
            cy.get('#text-6').type('G')

            cy.contains('OK').should('not.be.disabled').click()
        })

        it('player entry dialog has drag and drop-based swapping of the boxes', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')
            cy.contains('Neues Spiel beginnen').click()
            cy.contains('OK').should('be.disabled')

            cy.get('#text-0').type('A')
            cy.get('#text-1').type('B')
            cy.get('#text-2').type('C')
            cy.get('#text-3').type('D')
            cy.get('#text-4').type('E')
            cy.get('#text-5').type('F')
            cy.get('#text-6').type('G')

            cy.get('#radio-3').click()

            cy.get('#box-1').trigger('dragstart')
            cy.get('#box-3').trigger('drop')

            cy.get('#text-0').should('have.value', 'A')
            cy.get('#text-1').should('have.value', 'B')
            cy.get('#text-2').should('have.value', 'C')
            cy.get('#text-3').should('have.value', 'D')
            cy.get('#text-4').should('have.value', 'E')
            cy.get('#text-5').should('have.value', 'F')
            cy.get('#text-6').should('have.value', 'G')

            cy.get('.playerNameInputText').eq(0).should('have.value', 'A')
            cy.get('.playerNameInputText').eq(1).should('have.value', 'D')
            cy.get('.playerNameInputText').eq(2).should('have.value', 'C')
            cy.get('.playerNameInputText').eq(3).should('have.value', 'B')
            cy.get('.playerNameInputText').eq(4).should('have.value', 'E')
            cy.get('.playerNameInputText').eq(5).should('have.value', 'F')
            cy.get('.playerNameInputText').eq(6).should('have.value', 'G')

            cy.get('.dealerRadioButton').eq(1).should('be.checked')

            // trigger reordering
            cy.get('#deleteButton-6').click()

            cy.get('#text-0').should('have.value', 'A')
            cy.get('#text-1').should('have.value', 'D')
            cy.get('#text-2').should('have.value', 'C')
            cy.get('#text-3').should('have.value', 'B')
            cy.get('#text-4').should('have.value', 'E')
            cy.get('#text-5').should('have.value', 'F')

            cy.get('#radio-1').should('be.checked')
        })

        it('player entry dialog with duplicated player name has disabled OK', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')
            cy.contains('Neues Spiel beginnen').click()
            cy.contains('OK').should('be.disabled')

            cy.get('#text-0').type('A')
            cy.get('#text-1').type('B')
            cy.get('#text-2').type('duplicate')
            cy.get('#text-3').type('D')
            cy.get('#text-4').type('E')
            cy.get('#text-5').type('duplicate')
            cy.get('#text-6').type('G')

            cy.contains('OK').should('be.disabled')
        })

        it('player entry dialog with empty player name has disabled OK', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')
            cy.contains('Neues Spiel beginnen').click()
            cy.contains('OK').should('be.disabled')

            cy.get('#text-0').type('A')
            cy.get('#text-1').type('B')
            //cy.get('#text-2')
            cy.get('#text-3').type('D')
            cy.get('#text-4').type('E')
            cy.get('#text-5').type('F')
            cy.get('#text-6').type('G')

            cy.contains('OK').should('be.disabled')
        })
    })

    describe('access write page', function () {

        it('page can be opened and has correct content', function () {

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'Player A',
                    'Player B',
                    'Player C',
                    'Player D',
                    'Player E',
                    'Player F',
                    'Player G'
                ],
                dealerName: 'Player C',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content)

            cy.visit('http://localhost:3000/writer/myWriterId')
            cy.get('#writer-writerId').contains('myWriterId')
            cy.get('#writer-readerId').contains('myReaderId')
        })
    })

    describe('access read page', function () {

        it('page can be opened and has correct content', function () {

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'Player A',
                    'Player B',
                    'Player C',
                    'Player D',
                    'Player E',
                    'Player F',
                    'Player G'
                ],
                dealerName: 'Player C',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const content = {
                readerId: 'myReaderId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content)

            cy.visit('http://localhost:3000/myReaderId')
            cy.get('#reader-readerId').contains('myReaderId')
        })
    })
})