const { validatePlayerSet } = require('../logic/game')

describe.only('validate PlayerSet', () => {

    test('valid 4 player example passes', async () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: [],
            previousDealerName: 'A',
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

        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D'],
                dealerName: 'A',
                sitOutScheme: [],
                previousDealerName: 1337,
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
