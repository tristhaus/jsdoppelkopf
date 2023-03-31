describe('Doko app', function () {

    const absentPlayerFontColor = 'rgba(0, 0, 0, 0.5)'

    describe('main landing page', function () {

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
            cy.intercept({
                method: 'POST',
                url: '/api/game',
            }).as('createGame')

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

            cy.wait('@createGame')
        })

        it('player entry dialog can remove and add player lines within it', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')
            cy.contains('Neues Spiel beginnen').click()

            cy.get('#text-0').type('A')
            cy.get('#text-1').type('B')
            cy.get('#text-2').type('C')
            cy.get('#text-3').type('D')
            cy.get('#text-4').type('E')
            cy.get('#text-5').type('F')
            cy.get('#text-6').type('G')

            cy.get('#addButton').should('be.disabled')

            cy.get('#deleteButton-5').click()
            cy.get('#deleteButton-3').click()
            cy.get('#deleteButton-1').click()

            cy.get('#deleteButton-0').should('be.disabled')
            cy.get('#deleteButton-1').should('be.disabled')
            cy.get('#deleteButton-2').should('be.disabled')
            cy.get('#deleteButton-3').should('be.disabled')

            cy.get('#addButton').click()
            cy.get('#addButton').click()
            cy.get('#addButton').click()

            cy.contains('OK').should('be.disabled')

            cy.get('#text-4').type('F')
            cy.get('#text-5').type('D')
            cy.get('#text-6').type('B')

            cy.contains('OK').should('not.be.disabled')
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

        it('page has a writer ID input field, accesses correct page', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const content = {
                readerId: 'RBBBBBB',
                writerId: 'WAAAAAA',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000')

            cy.get('#inputWriterId').type('WAAAAAA')
            cy.get('#writerIdButton').click()

            cy.get('#name_PlayerA').contains('PlayerA')
            cy.get('#name_PlayerB').contains('PlayerB')
            cy.get('#name_PlayerC').contains('PlayerC')
            cy.get('#name_PlayerD').contains('PlayerD')
            cy.get('#name_PlayerE').contains('PlayerE')
            cy.get('#name_PlayerF').contains('PlayerF')
            cy.get('#name_PlayerG').contains('PlayerG')

            cy.get('#currentDeal_PlayerA')
            cy.get('#currentDeal_PlayerB')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')
        })

        it('page validates the entered writer ID: works', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputWriterId').type('WaBcDeF')
            cy.get('#writerIdButton').should('not.be.disabled')
        })

        it('page validates the entered writer ID: too short', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputWriterId').type('Wshort')
            cy.get('#writerIdButton').should('be.disabled')
        })

        it('page validates the entered writer ID: too long', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputWriterId').type('Wtoolong')
            cy.get('#writerIdButton').should('be.disabled')
        })

        it('page validates the entered writer ID: wrong characters', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputWriterId').type('W123456')
            cy.get('#writerIdButton').should('be.disabled')
        })

        it('page has a reader ID input field, accesses correct page', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const content = {
                readerId: 'RBBBBBB',
                writerId: 'WAAAAAA',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000')

            cy.get('#inputReaderId').type('RBBBBBB')
            cy.get('#readerIdButton').click()

            cy.get('#name_PlayerA').contains('PlayerA')
            cy.get('#name_PlayerB').contains('PlayerB')
            cy.get('#name_PlayerC').contains('PlayerC')
            cy.get('#name_PlayerD').contains('PlayerD')
            cy.get('#name_PlayerE').contains('PlayerE')
            cy.get('#name_PlayerF').contains('PlayerF')
            cy.get('#name_PlayerG').contains('PlayerG')

            cy.get('#currentDeal_PlayerA').should('not.exist')
            cy.get('#currentDeal_PlayerB').should('not.exist')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD').should('not.exist')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF').should('not.exist')
            cy.get('#currentDeal_PlayerG').should('not.exist')
        })

        it('page validates the entered reader ID: works', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputReaderId').type('RaBcDeF')
            cy.get('#readerIdButton').should('not.be.disabled')
        })

        it('page validates the entered reader ID: too short', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputReaderId').type('Rshort')
            cy.get('#readerIdButton').should('be.disabled')
        })

        it('page validates the entered reader ID: too long', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputReaderId').type('Rtoolong')
            cy.get('#readerIdButton').should('be.disabled')
        })

        it('page validates the entered reader ID: wrong characters', function () {
            cy.request('POST', 'http://localhost:3000/api/testing/reset')
            cy.visit('http://localhost:3000')

            cy.get('#inputReaderId').type('R123456')
            cy.get('#readerIdButton').should('be.disabled')
        })
    })

    describe('write landing page', function () {

        it('page can be opened and has correct content', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.mandatorySoloButton').should('not.be.disabled')
            cy.get('#currentBockStatus').contains('Kein Bock')
            cy.get('#bockPreviewTriple').contains('0')
            cy.get('#bockPreviewDouble').contains('0')
            cy.get('#bockPreviewSingle').contains('0')

            cy.get('#name_PlayerA').contains('PlayerA')
            cy.get('#name_PlayerB').contains('PlayerB')
            cy.get('#name_PlayerC').contains('PlayerC')
            cy.get('#name_PlayerD').contains('PlayerD')
            cy.get('#name_PlayerE').contains('PlayerE')
            cy.get('#name_PlayerF').contains('PlayerF')
            cy.get('#name_PlayerG').contains('PlayerG')

            cy.get('#lastDeal_PlayerA').contains('1')
            cy.get('#lastDeal_PlayerB').contains('1')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-1')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-1')
            cy.get('#lastDeal_PlayerG').should('be.empty')

            cy.get('#currentDeal_PlayerA').should('not.exist')
            cy.get('#currentDeal_PlayerB')
            cy.get('#currentDeal_PlayerC')
            cy.get('#currentDeal_PlayerD').should('not.exist')
            cy.get('#currentDeal_PlayerE')
            cy.get('#currentDeal_PlayerF').should('not.exist')
            cy.get('#currentDeal_PlayerG')

            cy.get('#popButton').should('not.be.disabled')
            cy.get('#dealButton').should('be.disabled')

            cy.get('#score_PlayerA').contains('1')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')

            cy.get('#cash_PlayerA').contains('0,00')
            cy.get('#cash_PlayerB').contains('0,00')
            cy.get('#cash_PlayerC').contains('0,00')
            cy.get('#cash_PlayerD').contains('0,01')
            cy.get('#cash_PlayerE').contains('0,00')
            cy.get('#cash_PlayerF').contains('0,01')
            cy.get('#cash_PlayerG').contains('0,00')

            cy.get('#totalCash').contains('0,02 (inkl. 0,00 pro Abwesender)')
        })

        it('page displays error when using bad ID', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            cy.visit('http://localhost:3000/writer/WNONEXISTENT')

            cy.contains('kann nicht laden, writer ID')
        })

        it('page has a working reload button', function () {

            cy.intercept({
                method: 'GET',
                url: '/api/game/write/**',
            }).as('load')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#score_PlayerA').contains('0')
            cy.get('#score_PlayerB').contains('0')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('0')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('0')
            cy.get('#score_PlayerG').contains('0')

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            cy.request('POST', 'http://localhost:3001/api/game/write/myWriterId/deal', deal).as('deal')
            cy.get('@deal')

            cy.get('#reloadButton').click()
            cy.wait('@load')

            cy.get('#score_PlayerA').contains('1')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')
        })

        it('page handles entries for current game correctly: one valid entry for solo', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('-9')
            cy.get('#currentDeal_PlayerB')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('not.be.disabled')
        })

        it('page handles entries for current game correctly: two equal entries', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('{selectAll}{backspace}6')
            cy.get('#currentDeal_PlayerB')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD').type('{selectAll}{backspace}6')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('not.be.disabled')
        })

        it('page handles entries for current game correctly: three equal entries - solo', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('{selectAll}{backspace}6')
            cy.get('#currentDeal_PlayerB')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD').type('{selectAll}{backspace}6')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF').type('{selectAll}{backspace}6')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('not.be.disabled')
        })

        it('page handles entries for current game correctly: four valid entries', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerB').type('{selectAll}{backspace}-5')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF').type('{selectAll}{backspace}-5')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('not.be.disabled')
        })

        it('page handles entries for current game correctly: one entry - cannot be solo', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('5')
            cy.get('#currentDeal_PlayerB')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('be.disabled')
        })

        it('page handles entries for current game correctly: two unequal entries', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('5')
            cy.get('#currentDeal_PlayerB')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD').type('17')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('be.disabled')
        })

        it('page handles entries for current game correctly: four invalid entries', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('5')
            cy.get('#currentDeal_PlayerB').type('-5')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD').type('4')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF').type('-4')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('be.disabled')
        })

        it('page copies entry made when clicking other fields', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('7')
            cy.get('#currentDeal_PlayerB').focus()

            cy.get('#dealButton').click()

            cy.get('#score_PlayerA').contains('7')
            cy.get('#score_PlayerB').contains('7')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-7')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-7')
            cy.get('#score_PlayerG').contains('0')
        })

        it('page does not copy entries made when they are inconsistent', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('7')
            cy.get('#currentDeal_PlayerB').type('{selectAll}{backspace}6')
            cy.get('#currentDeal_PlayerD').focus()

            cy.get('#dealButton').should('be.disabled')
        })

        it('page allows to note a deal after deleting an erroneously copied entry', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('7')
            cy.get('#currentDeal_PlayerB').focus()
            cy.get('#currentDeal_PlayerD').type('{selectAll}{backspace}')

            cy.get('#dealButton').should('not.be.disabled')
        })

        it('page can start mandatory solo round and pop it again', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game/write/**',
            }).as('push')
            cy.intercept({
                method: 'DELETE',
                url: '/api/game/write/**',
            }).as('pop')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.mandatorySoloButton').should('not.be.disabled').click()
            cy.wait('@push')

            cy.get('.mandatorySoloButton').should('be.disabled')
            cy.get('#currentBockStatus').contains('Pflichtsolo')

            cy.on('window:confirm', str => {
                expect(str).to.eq('Letzte Pflichtsolorunde rückgängig machen?')
                return true
            })

            cy.get('#popButton').should('not.be.disabled').click()
            cy.wait('@pop')

            cy.get('.mandatorySoloButton').should('not.be.disabled')
            cy.get('#currentBockStatus').contains('Kein Bock')
        })

        it('page can start mandatory solo round and not pop it on cancelling', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game/write/**',
            }).as('push')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.mandatorySoloButton').should('not.be.disabled').click()
            cy.wait('@push')

            cy.get('.mandatorySoloButton').should('be.disabled')
            cy.get('#currentBockStatus').contains('Pflichtsolo')

            cy.on('window:confirm', str => {
                expect(str).to.eq('Letzte Pflichtsolorunde rückgängig machen?')
                return false
            })

            cy.get('#popButton').should('not.be.disabled').click()

            cy.get('.mandatorySoloButton').should('be.disabled')
            cy.get('#currentBockStatus').contains('Pflichtsolo')
        })

        it('page displays error if unable to start mandatory solo round', function () {

            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/game/write/**',
                },
                {
                    statusCode: 499,
                    body: 'Intercepted by cypress'
                }).as('push')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.mandatorySoloButton').should('not.be.disabled').click()
            cy.wait('@push')

            cy.contains('Pflichtsolorunde konnte nicht gestartet werden.')
        })

        it('page can note a deal and pop it again on confirming', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game/write/**',
            }).as('push')
            cy.intercept({
                method: 'DELETE',
                url: '/api/game/write/**',
            }).as('pop')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerB').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#bockereignisse').type(2)

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('not.be.disabled').click()
            cy.wait('@push')

            cy.get('#currentBockStatus').contains('Doppelbock')
            cy.get('#bockPreviewTriple').contains('0')
            cy.get('#bockPreviewDouble').contains('7')
            cy.get('#bockPreviewSingle').contains('0')

            cy.get('#lastDeal_PlayerA').contains('5')
            cy.get('#lastDeal_PlayerB').contains('5')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-5')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-5')
            cy.get('#lastDeal_PlayerG').should('be.empty')

            cy.get('#score_PlayerA').contains('5')
            cy.get('#score_PlayerB').contains('5')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-5')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-5')
            cy.get('#score_PlayerG').contains('0')

            cy.on('window:confirm', str => {
                expect(str).to.eq('Letztes Spiel rückgängig machen?')
                return true
            })

            cy.get('#popButton').should('not.be.disabled').click()
            cy.wait('@pop')

            cy.get('#currentBockStatus').contains('Kein Bock')
            cy.get('#bockPreviewTriple').contains('0')
            cy.get('#bockPreviewDouble').contains('0')
            cy.get('#bockPreviewSingle').contains('0')

            cy.get('#lastDeal_PlayerA').should('be.empty')
            cy.get('#lastDeal_PlayerB').should('be.empty')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').should('be.empty')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').should('be.empty')
            cy.get('#lastDeal_PlayerG').should('be.empty')

            cy.get('#score_PlayerA').contains('0')
            cy.get('#score_PlayerB').contains('0')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('0')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('0')
            cy.get('#score_PlayerG').contains('0')
        })

        it('page can note a deal and not pop it on cancelling', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game/write/**',
            }).as('push')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerB').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#bockereignisse').type(2)

            cy.get('#popButton').should('be.disabled')
            cy.get('#dealButton').should('not.be.disabled').click()
            cy.wait('@push')

            cy.get('#currentBockStatus').contains('Doppelbock')
            cy.get('#bockPreviewTriple').contains('0')
            cy.get('#bockPreviewDouble').contains('7')
            cy.get('#bockPreviewSingle').contains('0')

            cy.get('#lastDeal_PlayerA').contains('5')
            cy.get('#lastDeal_PlayerB').contains('5')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-5')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-5')
            cy.get('#lastDeal_PlayerG').should('be.empty')

            cy.get('#score_PlayerA').contains('5')
            cy.get('#score_PlayerB').contains('5')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-5')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-5')
            cy.get('#score_PlayerG').contains('0')

            cy.on('window:confirm', str => {
                expect(str).to.eq('Letztes Spiel rückgängig machen?')
                return false
            })

            cy.get('#popButton').should('not.be.disabled').click()

            cy.get('#score_PlayerA').contains('5')
            cy.get('#score_PlayerB').contains('5')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-5')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-5')
            cy.get('#score_PlayerG').contains('0')
        })

        it('page displays error if unable to note a deal', function () {

            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/game/write/**',
                },
                {
                    statusCode: 499,
                    body: 'Intercepted by cypress'
                }).as('push')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#currentDeal_PlayerA').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerB').type('{selectAll}{backspace}5')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#bockereignisse').type(2)

            cy.get('#dealButton').should('not.be.disabled').click()
            cy.wait('@push')

            cy.contains('Spiel konnte nicht notiert werden.')
        })

        // test fails in FF due to access to clipboard
        it('page has a working button: share reader link', { browser: '!firefox' }, function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#readerLinkButton').click()
            cy.contains('Reader-Link in Zwischenablage kopiert')
            cy.window().its('navigator.clipboard')
                .then(clip => clip.readText())
                .should('match', new RegExp('http://localhost:[0-9]+/myReaderId'))
        })

        // test fails in FF due to access to clipboard
        it('page has a working button: share writer link', { browser: '!firefox' }, function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#writerLinkButton').click()
            cy.contains('Writer-Link in Zwischenablage kopiert')

            cy.window().its('navigator.clipboard')
                .then(clip => clip.readText())
                .should('match', new RegExp('http://localhost:[0-9]+/writer/myWriterId'))
        })

        it('after a deal, page can change player and shows now-absent player in gray', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game/write/**',
            }).as('push')
            cy.intercept({
                method: 'DELETE',
                url: '/api/game/write/**',
            }).as('pop')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#lastDeal_PlayerH').should('not.exist')
            cy.get('#score_PlayerH').should('not.exist')

            cy.get('.changePlayersButton').should('not.be.disabled').click()

            cy.get('#text-0').type('{selectall}{backspace}PlayerH')

            cy.contains('OK').should('not.be.disabled').click()
            cy.wait('@push')

            cy.get('#lastDeal_PlayerH').should('be.empty')
            cy.get('#lastDeal_PlayerB').contains('1')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-1')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-1')
            cy.get('#lastDeal_PlayerG').should('be.empty')
            cy.get('#lastDeal_PlayerA').contains('1')


            cy.get('#score_PlayerH').contains('0')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')
            cy.get('#score_PlayerA').contains('1')

            cy.get('#name_PlayerA').should('have.css', 'color', absentPlayerFontColor)
            cy.get('#lastDeal_PlayerA').should('have.css', 'color', absentPlayerFontColor)
            cy.get('#score_PlayerA').should('have.css', 'color', absentPlayerFontColor)
            cy.get('#cash_PlayerA').should('have.css', 'color', absentPlayerFontColor)
        })

        it('after a deal, page can change player and pop again on confirming', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game/write/**',
            }).as('push')
            cy.intercept({
                method: 'DELETE',
                url: '/api/game/write/**',
            }).as('pop')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#lastDeal_PlayerH').should('not.exist')
            cy.get('#score_PlayerH').should('not.exist')

            cy.get('.changePlayersButton').should('not.be.disabled').click()

            cy.get('#text-0').type('{selectall}{backspace}PlayerH')

            cy.contains('OK').should('not.be.disabled').click()
            cy.wait('@push')

            cy.get('#lastDeal_PlayerH').should('be.empty')
            cy.get('#lastDeal_PlayerB').contains('1')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-1')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-1')
            cy.get('#lastDeal_PlayerG').should('be.empty')
            cy.get('#lastDeal_PlayerA').contains('1')

            cy.get('#score_PlayerH').contains('0')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')
            cy.get('#score_PlayerA').contains('1')

            cy.on('window:confirm', str => {
                expect(str).to.eq('Letzte Auswahl der Spieler rückgängig machen?')
                return true
            })

            cy.get('#popButton').should('not.be.disabled').click()
            cy.wait('@pop')

            cy.get('#lastDeal_PlayerA').contains('1')
            cy.get('#lastDeal_PlayerB').contains('1')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-1')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-1')
            cy.get('#lastDeal_PlayerG').should('be.empty')

            cy.get('#lastDeal_PlayerH').should('not.exist')

            cy.get('#score_PlayerA').contains('1')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')

            cy.get('#score_PlayerH').should('not.exist')
        })

        it('after a deal, page can change player and not pop on cancelling', function () {

            cy.intercept({
                method: 'POST',
                url: '/api/game/write/**',
            }).as('push')
            cy.intercept({
                method: 'DELETE',
                url: '/api/game/write/**',
            }).as('pop')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('#lastDeal_PlayerH').should('not.exist')
            cy.get('#score_PlayerH').should('not.exist')

            cy.get('.changePlayersButton').should('not.be.disabled').click()

            cy.get('#text-0').type('{selectall}{backspace}PlayerH')

            cy.contains('OK').should('not.be.disabled').click()
            cy.wait('@push')

            cy.get('#lastDeal_PlayerH').should('be.empty')
            cy.get('#lastDeal_PlayerB').contains('1')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-1')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-1')
            cy.get('#lastDeal_PlayerG').should('be.empty')
            cy.get('#lastDeal_PlayerA').contains('1')

            cy.get('#score_PlayerH').contains('0')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')
            cy.get('#score_PlayerA').contains('1')

            cy.on('window:confirm', str => {
                expect(str).to.eq('Letzte Auswahl der Spieler rückgängig machen?')
                return false
            })

            cy.get('#popButton').should('not.be.disabled').click()

            cy.get('#lastDeal_PlayerH').should('be.empty')
            cy.get('#lastDeal_PlayerB').contains('1')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-1')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-1')
            cy.get('#lastDeal_PlayerG').should('be.empty')
            cy.get('#lastDeal_PlayerA').contains('1')

            cy.get('#score_PlayerH').contains('0')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')
            cy.get('#score_PlayerA').contains('1')
        })

        it('page displays error if unable to change player', function () {

            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/game/write/**',
                },
                {
                    statusCode: 499,
                    body: 'Intercepted by cypress'
                }).as('push')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.changePlayersButton').should('not.be.disabled').click()

            cy.get('#text-0').type('{selectall}{backspace}PlayerH')

            cy.contains('OK').should('not.be.disabled').click()
            cy.wait('@push')

            cy.contains('Spieler konnten nicht geändert werden.')
        })

        it('starting with 7 players, player entry dialog can remove and add player lines within it', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.changePlayersButton').click()

            cy.get('#deleteButton-5').click()
            cy.get('#deleteButton-3').click()
            cy.get('#deleteButton-1').click()

            cy.get('#deleteButton-0').should('be.disabled')
            cy.get('#deleteButton-1').should('be.disabled')
            cy.get('#deleteButton-2').should('be.disabled')
            cy.get('#deleteButton-3').should('be.disabled')

            cy.contains('OK').should('not.be.disabled')

            cy.get('#addButton').click()
            cy.get('#addButton').click()
            cy.get('#addButton').click()

            cy.contains('OK').should('be.disabled')

            cy.get('#text-4').type('PlayerF')
            cy.get('#text-5').type('PlayerD')
            cy.get('#text-6').type('PlayerB')

            cy.contains('OK').should('not.be.disabled')
        })

        it('starting with 4 players, player entry dialog can add and remove player lines within it', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerC',
                        diff: -1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.changePlayersButton').click()

            cy.get('#deleteButton-0').should('be.disabled')
            cy.get('#deleteButton-1').should('be.disabled')
            cy.get('#deleteButton-2').should('be.disabled')
            cy.get('#deleteButton-3').should('be.disabled')

            cy.contains('OK').should('not.be.disabled')

            cy.get('#addButton').click()
            cy.get('#addButton').click()
            cy.get('#addButton').click()

            cy.contains('OK').should('be.disabled')

            cy.get('#text-4').type('PlayerE')
            cy.get('#text-5').type('PlayerF')
            cy.get('#text-6').type('PlayerG')

            cy.contains('OK').should('not.be.disabled')

            cy.get('#deleteButton-5').click()
            cy.get('#deleteButton-3').click()
            cy.get('#deleteButton-1').click()

            cy.contains('OK').should('not.be.disabled')
        })

        it('player entry dialog has drag and drop-based swapping of the boxes', function () {
            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.changePlayersButton').click()

            cy.contains('OK').should('not.be.disabled')

            cy.get('#text-0').type('{selectAll}{backspace}A')
            cy.get('#text-1').type('{selectAll}{backspace}B')
            cy.get('#text-2').type('{selectAll}{backspace}C')
            cy.get('#text-3').type('{selectAll}{backspace}D')
            cy.get('#text-4').type('{selectAll}{backspace}E')
            cy.get('#text-5').type('{selectAll}{backspace}F')
            cy.get('#text-6').type('{selectAll}{backspace}G')

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
            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.changePlayersButton').click()

            cy.contains('OK').should('not.be.disabled')

            cy.get('#text-0').type('{selectAll}{backspace}A')
            cy.get('#text-1').type('{selectAll}{backspace}B')
            cy.get('#text-2').type('{selectAll}{backspace}duplicate')
            cy.get('#text-3').type('{selectAll}{backspace}D')
            cy.get('#text-4').type('{selectAll}{backspace}E')
            cy.get('#text-5').type('{selectAll}{backspace}duplicate')
            cy.get('#text-6').type('{selectAll}{backspace}G')

            cy.contains('OK').should('be.disabled')
        })

        it('player entry dialog with empty player name has disabled OK', function () {
            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.get('.changePlayersButton').click()

            cy.get('#text-2').type('{selectAll}{backspace}')

            cy.contains('OK').should('be.disabled')
        })

        it('after a deal, page displays error if unable to pop again', function () {

            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/game/write/**',
                }).as('push')
            cy.intercept(
                {
                    method: 'DELETE',
                    url: '/api/game/write/**',
                },
                {
                    statusCode: 499,
                    body: 'Intercepted by cypress'
                }).as('pop')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/writer/myWriterId')

            cy.on('window:confirm', str => {
                expect(str).to.eq('Letztes Spiel rückgängig machen?')
                return true
            })

            cy.get('#popButton').should('not.be.disabled').click()
            cy.wait('@pop')

            cy.contains('Letzter Eintrag konnte nicht gelöscht werden.')
        })
    })

    describe('read landing page', function () {

        it('page can be opened and has correct content', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
                sitOutScheme: [
                    2,
                    4
                ]
            }

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            const content = {
                readerId: 'myReaderId',
                writerId: 'myWriterId',
                dataVersion: 1,
                creationDate: Date.now(),
                data: [playersSet, deal],
            }

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/myReaderId')

            cy.get('.mandatorySoloButton').should('not.exist')
            cy.get('#currentBockStatus').contains('Kein Bock')
            cy.get('#bockPreviewTriple').contains('0')
            cy.get('#bockPreviewDouble').contains('0')
            cy.get('#bockPreviewSingle').contains('0')

            cy.get('#name_PlayerA').contains('PlayerA')
            cy.get('#name_PlayerB').contains('PlayerB')
            cy.get('#name_PlayerC').contains('PlayerC')
            cy.get('#name_PlayerD').contains('PlayerD')
            cy.get('#name_PlayerE').contains('PlayerE')
            cy.get('#name_PlayerF').contains('PlayerF')
            cy.get('#name_PlayerG').contains('PlayerG')

            cy.get('#lastDeal_PlayerA').contains('1')
            cy.get('#lastDeal_PlayerB').contains('1')
            cy.get('#lastDeal_PlayerC').should('be.empty')
            cy.get('#lastDeal_PlayerD').contains('-1')
            cy.get('#lastDeal_PlayerE').should('be.empty')
            cy.get('#lastDeal_PlayerF').contains('-1')
            cy.get('#lastDeal_PlayerG').should('be.empty')

            cy.get('#currentDeal_PlayerA').should('not.exist')
            cy.get('#currentDeal_PlayerB').should('not.exist')
            cy.get('#currentDeal_PlayerC').should('not.exist')
            cy.get('#currentDeal_PlayerD').should('not.exist')
            cy.get('#currentDeal_PlayerE').should('not.exist')
            cy.get('#currentDeal_PlayerF').should('not.exist')
            cy.get('#currentDeal_PlayerG').should('not.exist')

            cy.get('#popButton').should('not.exist')
            cy.get('#dealButton').should('not.exist')

            cy.get('#score_PlayerA').contains('1')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')

            cy.get('#cash_PlayerA').contains('0,00')
            cy.get('#cash_PlayerB').contains('0,00')
            cy.get('#cash_PlayerC').contains('0,00')
            cy.get('#cash_PlayerD').contains('0,01')
            cy.get('#cash_PlayerE').contains('0,00')
            cy.get('#cash_PlayerF').contains('0,01')
            cy.get('#cash_PlayerG').contains('0,00')

            cy.get('#totalCash').contains('0,02 (inkl. 0,00 pro Abwesender)')
        })

        it('page displays error when using bad ID', function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            cy.visit('http://localhost:3000/RNONEXISTENT')

            cy.contains('kann nicht laden, reader ID')
        })

        it('page has a working reload button', function () {

            cy.intercept({
                method: 'GET',
                url: '/api/game/**',
            }).as('load')

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/myReaderId')

            cy.get('#score_PlayerA').contains('0')
            cy.get('#score_PlayerB').contains('0')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('0')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('0')
            cy.get('#score_PlayerG').contains('0')

            const deal = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'PlayerA',
                        diff: 1
                    },
                    {
                        name: 'PlayerB',
                        diff: 1
                    },
                    {
                        name: 'PlayerD',
                        diff: -1
                    },
                    {
                        name: 'PlayerF',
                        diff: -1
                    }
                ],
            }

            cy.request('POST', 'http://localhost:3001/api/game/write/myWriterId/deal', deal).as('deal')
            cy.get('@deal')

            cy.get('#reloadButton').click()
            cy.wait('@load')

            cy.get('#score_PlayerA').contains('1')
            cy.get('#score_PlayerB').contains('1')
            cy.get('#score_PlayerC').contains('0')
            cy.get('#score_PlayerD').contains('-1')
            cy.get('#score_PlayerE').contains('0')
            cy.get('#score_PlayerF').contains('-1')
            cy.get('#score_PlayerG').contains('0')
        })

        // test fails in FF due to access to clipboard
        it('page has one working button: just share reader link', { browser: '!firefox' }, function () {

            cy.request('POST', 'http://localhost:3001/api/testing/reset').as('delete')
            cy.get('@delete')

            const playersSet = {
                kind: 'playersSet',
                playerNames: [
                    'PlayerA',
                    'PlayerB',
                    'PlayerC',
                    'PlayerD',
                    'PlayerE',
                    'PlayerF',
                    'PlayerG'
                ],
                dealerName: 'PlayerC',
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

            cy.request('POST', 'http://localhost:3001/api/testing/setup', content).as('create')
            cy.get('@create')

            cy.visit('http://localhost:3000/myReaderId')

            cy.get('#readerLinkButton').click()
            cy.contains('Reader-Link in Zwischenablage kopiert')

            cy.window().its('navigator.clipboard')
                .then(clip => clip.readText())
                .should('match', new RegExp('http://localhost:[0-9]+/myReaderId'))

            cy.get('#writerLinkButton').should('not.exist')
        })
    })
})