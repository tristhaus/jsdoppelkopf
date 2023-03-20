describe('Doko app', function () {

    describe('initialization', function () {

        it('page can be opened and has a working New Game button', function () {
            cy.visit('http://localhost:3000')
            cy.contains('Start new game').click()
            cy.contains('writerId:')
            cy.contains('readerId:')
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