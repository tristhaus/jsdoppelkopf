const { validatePlayerSet, determineDealer, calculatePlayerData } = require('../logic/game')

describe('validate PlayerSet', () => {

    test('valid 4 player example passes', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }
        const result = validatePlayerSet(candidate)
        expect(result).toBe(true)
    })

    test('null data, wrong kind or missing member fail', async () => {
        {
            const result = validatePlayerSet(null)
            expect(result).toBe(false)
        }

        {
            const result = validatePlayerSet({ kind: 'mandatorySolo' })
            expect(result).toBe(false)
        }

        {
            const result = validatePlayerSet({ someData: 'isThere' })
            expect(result).toBe(false)
        }
    })

    test('wrong types fail', async () => {
        {
            const candidate = {
                kind: 'playersSet',
                playerNames: 1337,
                dealerName: 'A',
                sitOutScheme: [],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D'],
                dealerName: 1337,
                sitOutScheme: [],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D'],
                dealerName: 'A',
                sitOutScheme: 1337,
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }
    })

    test('too few players fails', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C'],
            dealerName: 'A',
            sitOutScheme: [],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet(candidate)
        expect(result).toBe(false)
    })

    test('too many players fails', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            dealerName: 'A',
            sitOutScheme: [2, 4, 6],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet(candidate)
        expect(result).toBe(false)
    })

    test('wrong type in player names fails', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 1337, 'G'],
            dealerName: 'A',
            sitOutScheme: [2, 4, 6],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet(candidate)
        expect(result).toBe(false)
    })

    test('duplicate player name fails', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'A'],
            dealerName: 'A',
            sitOutScheme: [],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet(candidate)
        expect(result).toBe(false)
    })

    test('wrong type in sit out scheme fails', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            dealerName: 'A',
            sitOutScheme: [2, 'fail', 6],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet(candidate)
        expect(result).toBe(false)
    })

    test('incorrect length of sit out scheme fails', async () => {
        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dealerName: 'A',
                sitOutScheme: [2, 4, 6],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dealerName: 'A',
                sitOutScheme: [2],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }
    })

    test('invalid sit out scheme fails', async () => {
        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dealerName: 'A',
                sitOutScheme: [2, 7],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dealerName: 'A',
                sitOutScheme: [-1, 2],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dealerName: 'A',
                sitOutScheme: [2, 2],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet(candidate)
            expect(result).toBe(false)
        }
    })

    test('dealer not among players fails', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'Z',
            sitOutScheme: [],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet(candidate)
        expect(result).toBe(false)
    })
})

describe('determine dealer', () => {

    test('finds dealer trivially', async () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const validation = validatePlayerSet(playersSet)
        expect(validation).toBe(true)

        const dealer = determineDealer([playersSet])
        expect(dealer).toBe('B')
    })

    test('finds dealer for more entries', async () => {
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const mandatorySoloTrigger = {
            kind: 'mandatorySoloTrigger',
        }

        const playersSet2 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }

        const validation1 = validatePlayerSet(playersSet1)
        expect(validation1).toBe(true)

        const validation2 = validatePlayerSet(playersSet1)
        expect(validation2).toBe(true)

        const dealer = determineDealer([playersSet1, mandatorySoloTrigger, playersSet2, mandatorySoloTrigger])
        expect(dealer).toBe('A')
    })

})

describe('calculate player data', () => {

    test('4: everyone plays', async () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const data = [playersSet]

        const playerData = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
    })

    test('5: dealer sits out', async () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const data = [playersSet]

        const playerData = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(false)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)
    })

    test('7: sit out scheme applied', async () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            dealerName: 'B',
            sitOutScheme: [2, 4]
        }

        const data = [playersSet]

        const playerData = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(false)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(false)

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)

        expect(playerData[5].name).toBe('F')
        expect(playerData[5].present).toBe(true)
        expect(playerData[5].playing).toBe(false)

        expect(playerData[6].name).toBe('G')
        expect(playerData[6].present).toBe(true)
        expect(playerData[6].playing).toBe(true)
    })

    test('4-6-5: one player absent', async () => {
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const playersSet2 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'D',
            sitOutScheme: []
        }

        const playersSet3 = {
            kind: 'playersSet',
            playerNames: ['B', 'C', 'D', 'E', 'F'],
            dealerName: 'E',
            sitOutScheme: [2]
        }

        const data = [playersSet1, playersSet2, playersSet3]

        const playerData = calculatePlayerData(data)
        expect(playerData[0].name).toBe('B')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(false)

        expect(playerData[1].name).toBe('C')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)

        expect(playerData[2].name).toBe('D')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)

        expect(playerData[3].name).toBe('E')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(false)

        expect(playerData[4].name).toBe('F')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)

        expect(playerData[5].name).toBe('A')
        expect(playerData[5].present).toBe(false)
        expect(playerData[5].playing).toBe(false)
    })
})