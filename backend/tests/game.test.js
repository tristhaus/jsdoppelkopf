const { calculatePlayerData, createBockPreview, constructBockHelper, determineDealer, findSoloPlayer, getMultiplier, pointDifferenceToCents, validateDeal, validateMandatorySoloTrigger, validatePlayerSet, } = require('../logic/game')

describe('validate PlayerSet', () => {

    test('valid 4 player example passes', () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }
        const result = validatePlayerSet([], candidate)
        expect(result).toBe(true)
    })

    test('null data, wrong kind or missing member fail', () => {
        {
            const result = validatePlayerSet([], null)
            expect(result).toBe(false)
        }

        {
            const result = validatePlayerSet([], { kind: 'mandatorySoloTrigger' })
            expect(result).toBe(false)
        }

        {
            const result = validatePlayerSet([], { someData: 'isThere' })
            expect(result).toBe(false)
        }
    })

    test('wrong types fail', () => {
        {
            const candidate = {
                kind: 'playersSet',
                playerNames: 1337,
                dealerName: 'A',
                sitOutScheme: [],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet([], candidate)
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
            const result = validatePlayerSet([], candidate)
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
            const result = validatePlayerSet([], candidate)
            expect(result).toBe(false)
        }
    })

    test('too few players fails', () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C'],
            dealerName: 'A',
            sitOutScheme: [],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet([], candidate)
        expect(result).toBe(false)
    })

    test('too many players fails', () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            dealerName: 'A',
            sitOutScheme: [2, 4, 6],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet([], candidate)
        expect(result).toBe(false)
    })

    test('wrong type in player names fails', () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 1337, 'G'],
            dealerName: 'A',
            sitOutScheme: [2, 4, 6],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet([], candidate)
        expect(result).toBe(false)
    })

    test('duplicate player name fails', () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'A'],
            dealerName: 'A',
            sitOutScheme: [],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet([], candidate)
        expect(result).toBe(false)
    })

    test('wrong type in sit out scheme fails', () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            dealerName: 'A',
            sitOutScheme: [2, 'fail', 6],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet([], candidate)
        expect(result).toBe(false)
    })

    test('incorrect length of sit out scheme fails', () => {
        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dealerName: 'A',
                sitOutScheme: [2, 4, 6],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet([], candidate)
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
            const result = validatePlayerSet([], candidate)
            expect(result).toBe(false)
        }
    })

    test('invalid sit out scheme fails', () => {
        {
            const candidate = {
                kind: 'playersSet',
                playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dealerName: 'A',
                sitOutScheme: [2, 7],
                previousDealerName: 'A',
            }
            const result = validatePlayerSet([], candidate)
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
            const result = validatePlayerSet([], candidate)
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
            const result = validatePlayerSet([], candidate)
            expect(result).toBe(false)
        }
    })

    test('dealer not among players fails', () => {
        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'Z',
            sitOutScheme: [],
            previousDealerName: 'A',
        }
        const result = validatePlayerSet([], candidate)
        expect(result).toBe(false)
    })

    test('during mandatory solo, playersSet fails', () => {

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: [],
        }

        const mandatorySoloTrigger = {
            kind: 'mandatorySoloTrigger',
        }

        const deal = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 3
                },
                {
                    name: 'B',
                    diff: -1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const data = [playersSet, mandatorySoloTrigger, deal]

        const candidate = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E'],
            dealerName: 'A',
            sitOutScheme: [],
        }
        const result = validatePlayerSet(data, candidate)
        expect(result).toBe(false)
    })
})

describe('determine dealer', () => {

    test('finds dealer trivially', () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const validation = validatePlayerSet([], playersSet)
        expect(validation).toBe(true)

        const dealer = determineDealer([playersSet])
        expect(dealer).toBe('B')
    })

    test('finds dealer after many deals', () => {
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const deal1 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const playersSet2 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'E'],
            dealerName: 'E',
            sitOutScheme: []
        }

        const deal2 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'E',
                    diff: -1
                }
            ]
        }

        const data = [playersSet1, deal1, deal1, deal1, playersSet2, deal2, deal2, deal2, deal2, deal2, deal2]

        const dealer = determineDealer(data)
        expect(dealer).toBe('B')
    })
})

describe('calculate player data', () => {

    test('4: everyone plays', () => {
        process.env.USE_BOCK = true
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const data = [playersSet]

        const { playerData } = calculatePlayerData(data)
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

    test('5: dealer sits out', () => {
        process.env.USE_BOCK = true
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const data = [playersSet]

        const { playerData } = calculatePlayerData(data)
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

    test('7: sit out scheme applied', () => {
        process.env.USE_BOCK = true
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            dealerName: 'D',
            sitOutScheme: [2, 4]
        }

        const data = [playersSet]

        const { playerData } = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(false)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)

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

    test('4-6-5: one player absent', () => {
        process.env.USE_BOCK = true
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

        const { playerData } = calculatePlayerData(data)
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

    test('4-d-5-dd: deals correctly used', () => {
        process.env.USE_BOCK = true
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const deal1 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const playersSet2 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E'],
            dealerName: 'D',
            sitOutScheme: []
        }

        const deal2 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 2
                },
                {
                    name: 'B',
                    diff: -2
                },
                {
                    name: 'C',
                    diff: 2
                },
                {
                    name: 'E',
                    diff: -2
                }
            ]
        }

        const deal3 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 3
                },
                {
                    name: 'B',
                    diff: 3
                },
                {
                    name: 'C',
                    diff: -3
                },
                {
                    name: 'D',
                    diff: -3
                }
            ]
        }

        const data = [playersSet1, deal1, playersSet2, deal2, deal3]

        const { playerData, dealerName, totalCash, absentPlayerCents, } = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(false)
        expect(playerData[0].score).toBe(6)
        expect(playerData[0].lastDealDiff).toBe(3)
        expect(playerData[0].cents).toBe(0)
        expect(playerData[0].maxWin).toBe(3)
        expect(playerData[0].maxLoss).toBe(0)
        expect(playerData[0].noBockScore).toBe(6)
        expect(playerData[0].num).toBe(3)
        expect(playerData[0].numWin).toBe(3)
        expect(playerData[0].numLoss).toBe(0)
        expect(playerData[0].soloScore).toBe(0)
        expect(playerData[0].numWonSolo).toBe(0)
        expect(playerData[0].numLostSolo).toBe(0)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].score).toBe(2)
        expect(playerData[1].lastDealDiff).toBe(3)
        expect(playerData[1].cents).toBe(2)
        expect(playerData[1].maxWin).toBe(3)
        expect(playerData[1].maxLoss).toBe(-2)
        expect(playerData[1].noBockScore).toBe(2)
        expect(playerData[1].num).toBe(3)
        expect(playerData[1].numWin).toBe(2)
        expect(playerData[1].numLoss).toBe(1)
        expect(playerData[1].soloScore).toBe(0)
        expect(playerData[1].numWonSolo).toBe(0)
        expect(playerData[1].numLostSolo).toBe(0)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(-2)
        expect(playerData[2].lastDealDiff).toBe(-3)
        expect(playerData[2].cents).toBe(4)
        expect(playerData[2].maxWin).toBe(2)
        expect(playerData[2].maxLoss).toBe(-3)
        expect(playerData[2].noBockScore).toBe(-2)
        expect(playerData[2].num).toBe(3)
        expect(playerData[2].numWin).toBe(1)
        expect(playerData[2].numLoss).toBe(2)
        expect(playerData[2].soloScore).toBe(0)
        expect(playerData[2].numWonSolo).toBe(0)
        expect(playerData[2].numLostSolo).toBe(0)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
        expect(playerData[3].score).toBe(-4)
        expect(playerData[3].lastDealDiff).toBe(-3)
        expect(playerData[3].cents).toBe(5)
        expect(playerData[3].maxWin).toBe(0)
        expect(playerData[3].maxLoss).toBe(-3)
        expect(playerData[3].noBockScore).toBe(-4)
        expect(playerData[3].num).toBe(2)
        expect(playerData[3].numWin).toBe(0)
        expect(playerData[3].numLoss).toBe(2)
        expect(playerData[3].soloScore).toBe(0)
        expect(playerData[3].numWonSolo).toBe(0)
        expect(playerData[3].numLostSolo).toBe(0)

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)
        expect(playerData[4].score).toBe(-2)
        expect(playerData[4].lastDealDiff).toBeNull()
        expect(playerData[4].cents).toBe(4)
        expect(playerData[4].maxWin).toBe(0)
        expect(playerData[4].maxLoss).toBe(-2)
        expect(playerData[4].noBockScore).toBe(-2)
        expect(playerData[4].num).toBe(1)
        expect(playerData[4].numWin).toBe(0)
        expect(playerData[4].numLoss).toBe(1)
        expect(playerData[4].soloScore).toBe(0)
        expect(playerData[4].numWonSolo).toBe(0)
        expect(playerData[4].numLostSolo).toBe(0)

        expect(dealerName).toBe('A')

        expect(totalCash).toBe(15 + 3 * 3)
        expect(absentPlayerCents).toBe(3)
    })

    test('6a-d-6b-d: no players entirely absent', () => {
        process.env.USE_BOCK = true
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }

        const deal1 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 4
                },
                {
                    name: 'B',
                    diff: 4
                },
                {
                    name: 'C',
                    diff: -4
                },
                {
                    name: 'D',
                    diff: -4
                }
            ]
        }

        const playersSet2 = {
            kind: 'playersSet',
            playerNames: ['E', 'F', 'G', 'H'],
            dealerName: 'E',
            sitOutScheme: []
        }

        const deal2 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'E',
                    diff: 6
                },
                {
                    name: 'F',
                    diff: -6
                },
                {
                    name: 'G',
                    diff: 6
                },
                {
                    name: 'H',
                    diff: -6
                }
            ]
        }

        const data = [playersSet1, deal1, playersSet2, deal2]

        const { playerData, dealerName, totalCash, absentPlayerCents, } = calculatePlayerData(data)
        expect(playerData[0].name).toBe('E')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)
        expect(playerData[0].score).toBe(6)
        expect(playerData[0].lastDealDiff).toBe(6)
        expect(playerData[0].cents).toBe(0)
        expect(playerData[0].maxWin).toBe(6)
        expect(playerData[0].maxLoss).toBe(0)
        expect(playerData[0].noBockScore).toBe(6)
        expect(playerData[0].num).toBe(1)
        expect(playerData[0].numWin).toBe(1)
        expect(playerData[0].numLoss).toBe(0)
        expect(playerData[0].soloScore).toBe(0)
        expect(playerData[0].numWonSolo).toBe(0)
        expect(playerData[0].numLostSolo).toBe(0)
        expect(playerData[0].history).toStrictEqual([0, 6])

        expect(playerData[1].name).toBe('F')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].score).toBe(-6)
        expect(playerData[1].lastDealDiff).toBe(-6)
        expect(playerData[1].cents).toBe(6)
        expect(playerData[1].maxWin).toBe(0)
        expect(playerData[1].maxLoss).toBe(-6)
        expect(playerData[1].noBockScore).toBe(-6)
        expect(playerData[1].num).toBe(1)
        expect(playerData[1].numWin).toBe(0)
        expect(playerData[1].numLoss).toBe(1)
        expect(playerData[1].soloScore).toBe(0)
        expect(playerData[1].numWonSolo).toBe(0)
        expect(playerData[1].numLostSolo).toBe(0)
        expect(playerData[1].history).toStrictEqual([0, -6])

        expect(playerData[2].name).toBe('G')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(6)
        expect(playerData[2].lastDealDiff).toBe(6)
        expect(playerData[2].cents).toBe(0)
        expect(playerData[2].maxWin).toBe(6)
        expect(playerData[2].maxLoss).toBe(0)
        expect(playerData[2].noBockScore).toBe(6)
        expect(playerData[2].num).toBe(1)
        expect(playerData[2].numWin).toBe(1)
        expect(playerData[2].numLoss).toBe(0)
        expect(playerData[2].soloScore).toBe(0)
        expect(playerData[2].numWonSolo).toBe(0)
        expect(playerData[2].numLostSolo).toBe(0)
        expect(playerData[2].history).toStrictEqual([0, 6])

        expect(playerData[3].name).toBe('H')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
        expect(playerData[3].score).toBe(-6)
        expect(playerData[3].lastDealDiff).toBe(-6)
        expect(playerData[3].cents).toBe(6)
        expect(playerData[3].maxWin).toBe(0)
        expect(playerData[3].maxLoss).toBe(-6)
        expect(playerData[3].noBockScore).toBe(-6)
        expect(playerData[3].num).toBe(1)
        expect(playerData[3].numWin).toBe(0)
        expect(playerData[3].numLoss).toBe(1)
        expect(playerData[3].soloScore).toBe(0)
        expect(playerData[3].numWonSolo).toBe(0)
        expect(playerData[3].numLostSolo).toBe(0)
        expect(playerData[3].history).toStrictEqual([0, -6])

        expect(playerData[4].name).toBe('A')
        expect(playerData[4].present).toBe(false)
        expect(playerData[4].playing).toBe(false)
        expect(playerData[4].score).toBe(4)
        expect(playerData[4].lastDealDiff).toBeNull()
        expect(playerData[4].cents).toBe(1)
        expect(playerData[4].maxWin).toBe(4)
        expect(playerData[4].maxLoss).toBe(0)
        expect(playerData[4].noBockScore).toBe(4)
        expect(playerData[4].num).toBe(1)
        expect(playerData[4].numWin).toBe(1)
        expect(playerData[4].numLoss).toBe(0)
        expect(playerData[4].soloScore).toBe(0)
        expect(playerData[4].numWonSolo).toBe(0)
        expect(playerData[4].numLostSolo).toBe(0)
        expect(playerData[4].history).toStrictEqual([4, 4])

        expect(playerData[5].name).toBe('B')
        expect(playerData[5].present).toBe(false)
        expect(playerData[5].playing).toBe(false)
        expect(playerData[5].score).toBe(4)
        expect(playerData[5].lastDealDiff).toBeNull()
        expect(playerData[5].cents).toBe(1)
        expect(playerData[5].maxWin).toBe(4)
        expect(playerData[5].maxLoss).toBe(0)
        expect(playerData[5].noBockScore).toBe(4)
        expect(playerData[5].num).toBe(1)
        expect(playerData[5].numWin).toBe(1)
        expect(playerData[5].numLoss).toBe(0)
        expect(playerData[5].soloScore).toBe(0)
        expect(playerData[5].numWonSolo).toBe(0)
        expect(playerData[5].numLostSolo).toBe(0)
        expect(playerData[5].history).toStrictEqual([4, 4])

        expect(playerData[6].name).toBe('C')
        expect(playerData[6].present).toBe(false)
        expect(playerData[6].playing).toBe(false)
        expect(playerData[6].score).toBe(-4)
        expect(playerData[6].lastDealDiff).toBeNull()
        expect(playerData[6].cents).toBe(5)
        expect(playerData[6].maxWin).toBe(0)
        expect(playerData[6].maxLoss).toBe(-4)
        expect(playerData[6].noBockScore).toBe(-4)
        expect(playerData[6].num).toBe(1)
        expect(playerData[6].numWin).toBe(0)
        expect(playerData[6].numLoss).toBe(1)
        expect(playerData[6].soloScore).toBe(0)
        expect(playerData[6].numWonSolo).toBe(0)
        expect(playerData[6].numLostSolo).toBe(0)
        expect(playerData[6].history).toStrictEqual([-4, -4])

        expect(playerData[7].name).toBe('D')
        expect(playerData[7].present).toBe(false)
        expect(playerData[7].playing).toBe(false)
        expect(playerData[7].score).toBe(-4)
        expect(playerData[7].lastDealDiff).toBeNull()
        expect(playerData[7].cents).toBe(5)
        expect(playerData[7].maxWin).toBe(0)
        expect(playerData[7].maxLoss).toBe(-4)
        expect(playerData[7].noBockScore).toBe(-4)
        expect(playerData[7].num).toBe(1)
        expect(playerData[7].numWin).toBe(0)
        expect(playerData[7].numLoss).toBe(1)
        expect(playerData[7].soloScore).toBe(0)
        expect(playerData[7].numWonSolo).toBe(0)
        expect(playerData[7].numLostSolo).toBe(0)
        expect(playerData[7].history).toStrictEqual([-4, -4])

        expect(dealerName).toBe('F')

        expect(totalCash).toBe(24)
        expect(absentPlayerCents).toBe(null)
    })

    test('7-d-6-5: handle two players leaving consecutively', () => {
        process.env.USE_BOCK = true
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            dealerName: 'A',
            sitOutScheme: [2, 4]
        }

        const deal1 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'B',
                    diff: 6
                },
                {
                    name: 'D',
                    diff: 6
                },
                {
                    name: 'F',
                    diff: -6
                },
                {
                    name: 'G',
                    diff: -6
                }
            ]
        }

        const playersSet2 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'G'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const playersSet3 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'E', 'G'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const data = [playersSet1, deal1, playersSet2, playersSet3]

        const { playerData, dealerName, totalCash, absentPlayerCents, } = calculatePlayerData(data)

        expect(playerData.length).toBe(7)

        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)
        expect(playerData[0].score).toBe(0)
        expect(playerData[0].lastDealDiff).toBeNull()
        expect(playerData[0].cents).toBe(3)
        expect(playerData[0].maxWin).toBe(0)
        expect(playerData[0].maxLoss).toBe(0)
        expect(playerData[0].noBockScore).toBe(0)
        expect(playerData[0].num).toBe(0)
        expect(playerData[0].numWin).toBe(0)
        expect(playerData[0].numLoss).toBe(0)
        expect(playerData[0].soloScore).toBe(0)
        expect(playerData[0].numWonSolo).toBe(0)
        expect(playerData[0].numLostSolo).toBe(0)
        expect(playerData[0].history).toStrictEqual([0])

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(false)
        expect(playerData[1].score).toBe(6)
        expect(playerData[1].lastDealDiff).toBe(6)
        expect(playerData[1].cents).toBe(0)
        expect(playerData[1].maxWin).toBe(6)
        expect(playerData[1].maxLoss).toBe(0)
        expect(playerData[1].noBockScore).toBe(6)
        expect(playerData[1].num).toBe(1)
        expect(playerData[1].numWin).toBe(1)
        expect(playerData[1].numLoss).toBe(0)
        expect(playerData[1].soloScore).toBe(0)
        expect(playerData[1].numWonSolo).toBe(0)
        expect(playerData[1].numLostSolo).toBe(0)
        expect(playerData[1].history).toStrictEqual([6])

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(0)
        expect(playerData[2].lastDealDiff).toBeNull()
        expect(playerData[2].cents).toBe(3)
        expect(playerData[2].maxWin).toBe(0)
        expect(playerData[2].maxLoss).toBe(0)
        expect(playerData[2].noBockScore).toBe(0)
        expect(playerData[2].num).toBe(0)
        expect(playerData[2].numWin).toBe(0)
        expect(playerData[2].numLoss).toBe(0)
        expect(playerData[2].soloScore).toBe(0)
        expect(playerData[2].numWonSolo).toBe(0)
        expect(playerData[2].numLostSolo).toBe(0)
        expect(playerData[2].history).toStrictEqual([0])

        expect(playerData[3].name).toBe('E')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
        expect(playerData[3].score).toBe(0)
        expect(playerData[3].lastDealDiff).toBeNull()
        expect(playerData[3].cents).toBe(3)
        expect(playerData[3].maxWin).toBe(0)
        expect(playerData[3].maxLoss).toBe(0)
        expect(playerData[3].noBockScore).toBe(0)
        expect(playerData[3].num).toBe(0)
        expect(playerData[3].numWin).toBe(0)
        expect(playerData[3].numLoss).toBe(0)
        expect(playerData[3].soloScore).toBe(0)
        expect(playerData[3].numWonSolo).toBe(0)
        expect(playerData[3].numLostSolo).toBe(0)
        expect(playerData[3].history).toStrictEqual([0])

        expect(playerData[4].name).toBe('G')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)
        expect(playerData[4].score).toBe(-6)
        expect(playerData[4].lastDealDiff).toBe(-6)
        expect(playerData[4].cents).toBe(6)
        expect(playerData[4].maxWin).toBe(0)
        expect(playerData[4].maxLoss).toBe(-6)
        expect(playerData[4].noBockScore).toBe(-6)
        expect(playerData[4].num).toBe(1)
        expect(playerData[4].numWin).toBe(0)
        expect(playerData[4].numLoss).toBe(1)
        expect(playerData[4].soloScore).toBe(0)
        expect(playerData[4].numWonSolo).toBe(0)
        expect(playerData[4].numLostSolo).toBe(0)
        expect(playerData[4].history).toStrictEqual([-6])

        expect(playerData[5].name).toBe('D')
        expect(playerData[5].present).toBe(false)
        expect(playerData[5].playing).toBe(false)
        expect(playerData[5].score).toBe(6)
        expect(playerData[5].lastDealDiff).toBe(6)
        expect(playerData[5].cents).toBe(0)
        expect(playerData[5].maxWin).toBe(6)
        expect(playerData[5].maxLoss).toBe(0)
        expect(playerData[5].noBockScore).toBe(6)
        expect(playerData[5].num).toBe(1)
        expect(playerData[5].numWin).toBe(1)
        expect(playerData[5].numLoss).toBe(0)
        expect(playerData[5].soloScore).toBe(0)
        expect(playerData[5].numWonSolo).toBe(0)
        expect(playerData[5].numLostSolo).toBe(0)
        expect(playerData[5].history).toStrictEqual([6])

        expect(playerData[6].name).toBe('F')
        expect(playerData[6].present).toBe(false)
        expect(playerData[6].playing).toBe(false)
        expect(playerData[6].score).toBe(-6)
        expect(playerData[6].lastDealDiff).toBe(-6)
        expect(playerData[6].cents).toBe(6)
        expect(playerData[6].maxWin).toBe(0)
        expect(playerData[6].maxLoss).toBe(-6)
        expect(playerData[6].noBockScore).toBe(-6)
        expect(playerData[6].num).toBe(1)
        expect(playerData[6].numWin).toBe(0)
        expect(playerData[6].numLoss).toBe(1)
        expect(playerData[6].soloScore).toBe(0)
        expect(playerData[6].numWonSolo).toBe(0)
        expect(playerData[6].numLostSolo).toBe(0)
        expect(playerData[6].history).toStrictEqual([-6])

        expect(dealerName).toBe('B')

        expect(totalCash).toBe(21 + 1 * 3)
        expect(absentPlayerCents).toBe(3)
    })

    test('4-d-solo: solo and Bock', () => {
        process.env.USE_BOCK = true
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const deal1 = {
            kind: 'deal',
            events: 2,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const deal2 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 6
                },
                {
                    name: 'B',
                    diff: -2
                },
                {
                    name: 'C',
                    diff: -2
                },
                {
                    name: 'D',
                    diff: -2
                }
            ]
        }

        const data = [playersSet1, deal1, deal2]

        const { playerData, dealerName, totalCash, absentPlayerCents, } = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)
        expect(playerData[0].score).toBe(25)
        expect(playerData[0].lastDealDiff).toBe(6)
        expect(playerData[0].cents).toBe(0)
        expect(playerData[0].maxWin).toBe(24)
        expect(playerData[0].maxLoss).toBe(0)
        expect(playerData[0].noBockScore).toBe(7)
        expect(playerData[0].num).toBe(2)
        expect(playerData[0].numWin).toBe(2)
        expect(playerData[0].numLoss).toBe(0)
        expect(playerData[0].soloScore).toBe(24)
        expect(playerData[0].numWonSolo).toBe(1)
        expect(playerData[0].numLostSolo).toBe(0)
        expect(playerData[0].history).toStrictEqual([1, 25])

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].score).toBe(-7)
        expect(playerData[1].lastDealDiff).toBe(-2)
        expect(playerData[1].cents).toBe(16)
        expect(playerData[1].maxWin).toBe(1)
        expect(playerData[1].maxLoss).toBe(-8)
        expect(playerData[1].noBockScore).toBe(-1)
        expect(playerData[1].num).toBe(2)
        expect(playerData[1].numWin).toBe(1)
        expect(playerData[1].numLoss).toBe(1)
        expect(playerData[1].soloScore).toBe(0)
        expect(playerData[1].numWonSolo).toBe(0)
        expect(playerData[1].numLostSolo).toBe(0)
        expect(playerData[1].history).toStrictEqual([1, -7])

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(-9)
        expect(playerData[2].lastDealDiff).toBe(-2)
        expect(playerData[2].cents).toBe(17)
        expect(playerData[2].maxWin).toBe(0)
        expect(playerData[2].maxLoss).toBe(-8)
        expect(playerData[2].noBockScore).toBe(-3)
        expect(playerData[2].num).toBe(2)
        expect(playerData[2].numWin).toBe(0)
        expect(playerData[2].numLoss).toBe(2)
        expect(playerData[2].soloScore).toBe(0)
        expect(playerData[2].numWonSolo).toBe(0)
        expect(playerData[2].numLostSolo).toBe(0)
        expect(playerData[2].history).toStrictEqual([-1, -9])

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
        expect(playerData[3].score).toBe(-9)
        expect(playerData[3].lastDealDiff).toBe(-2)
        expect(playerData[3].cents).toBe(17)
        expect(playerData[3].maxWin).toBe(0)
        expect(playerData[3].maxLoss).toBe(-8)
        expect(playerData[3].noBockScore).toBe(-3)
        expect(playerData[3].num).toBe(2)
        expect(playerData[3].numWin).toBe(0)
        expect(playerData[3].numLoss).toBe(2)
        expect(playerData[3].soloScore).toBe(0)
        expect(playerData[3].numWonSolo).toBe(0)
        expect(playerData[3].numLostSolo).toBe(0)
        expect(playerData[3].history).toStrictEqual([-1, -9])

        expect(dealerName).toBe('D')

        expect(totalCash).toBe(50 + 4 * 12)
        expect(absentPlayerCents).toBe(12)
    })

    test('4-d-solo: solo (useBock: false)', () => {
        process.env.USE_BOCK = false
        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'B',
            sitOutScheme: []
        }

        const deal1 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const deal2 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 6
                },
                {
                    name: 'B',
                    diff: -2
                },
                {
                    name: 'C',
                    diff: -2
                },
                {
                    name: 'D',
                    diff: -2
                }
            ]
        }

        const data = [playersSet1, deal1, deal2]

        const { playerData, dealerName, totalCash, absentPlayerCents, } = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)
        expect(playerData[0].score).toBe(7)
        expect(playerData[0].lastDealDiff).toBe(6)
        expect(playerData[0].cents).toBe(0)
        expect(playerData[0].maxWin).toBe(6)
        expect(playerData[0].maxLoss).toBe(0)
        expect(playerData[0].noBockScore).toBe(7)
        expect(playerData[0].num).toBe(2)
        expect(playerData[0].numWin).toBe(2)
        expect(playerData[0].numLoss).toBe(0)
        expect(playerData[0].soloScore).toBe(6)
        expect(playerData[0].numWonSolo).toBe(1)
        expect(playerData[0].numLostSolo).toBe(0)
        expect(playerData[0].history).toStrictEqual([1, 7])

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].score).toBe(-1)
        expect(playerData[1].lastDealDiff).toBe(-2)
        expect(playerData[1].cents).toBe(4)
        expect(playerData[1].maxWin).toBe(1)
        expect(playerData[1].maxLoss).toBe(-2)
        expect(playerData[1].noBockScore).toBe(-1)
        expect(playerData[1].num).toBe(2)
        expect(playerData[1].numWin).toBe(1)
        expect(playerData[1].numLoss).toBe(1)
        expect(playerData[1].soloScore).toBe(0)
        expect(playerData[1].numWonSolo).toBe(0)
        expect(playerData[1].numLostSolo).toBe(0)
        expect(playerData[1].history).toStrictEqual([1, -1])

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(-3)
        expect(playerData[2].lastDealDiff).toBe(-2)
        expect(playerData[2].cents).toBe(5)
        expect(playerData[2].maxWin).toBe(0)
        expect(playerData[2].maxLoss).toBe(-2)
        expect(playerData[2].noBockScore).toBe(-3)
        expect(playerData[2].num).toBe(2)
        expect(playerData[2].numWin).toBe(0)
        expect(playerData[2].numLoss).toBe(2)
        expect(playerData[2].soloScore).toBe(0)
        expect(playerData[2].numWonSolo).toBe(0)
        expect(playerData[2].numLostSolo).toBe(0)
        expect(playerData[2].history).toStrictEqual([-1, -3])

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
        expect(playerData[3].score).toBe(-3)
        expect(playerData[3].lastDealDiff).toBe(-2)
        expect(playerData[3].cents).toBe(5)
        expect(playerData[3].maxWin).toBe(0)
        expect(playerData[3].maxLoss).toBe(-2)
        expect(playerData[3].noBockScore).toBe(-3)
        expect(playerData[3].num).toBe(2)
        expect(playerData[3].numWin).toBe(0)
        expect(playerData[3].numLoss).toBe(2)
        expect(playerData[3].soloScore).toBe(0)
        expect(playerData[3].numWonSolo).toBe(0)
        expect(playerData[3].numLostSolo).toBe(0)
        expect(playerData[3].history).toStrictEqual([-1, -3])

        expect(dealerName).toBe('D')

        expect(totalCash).toBe(14 + 4 * 3)
        expect(absentPlayerCents).toBe(3)
    })
})

describe('validate deal', () => {

    test('correct deal is validated (useBock: true)', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const data = [playersSet]

        {
            const candidate = {
                kind: 'deal',
                events: 1,
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(true)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 6
                    },
                    {
                        name: 'C',
                        diff: -2
                    },
                    {
                        name: 'D',
                        diff: -2
                    },
                    {
                        name: 'F',
                        diff: -2
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(true)
        }
    })

    test('correct deal is validated (useBock: false)', () => {
        process.env.USE_BOCK = false

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const data = [playersSet]

        {
            const candidate = {
                kind: 'deal',
                events: 1,
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 6
                    },
                    {
                        name: 'C',
                        diff: -2
                    },
                    {
                        name: 'D',
                        diff: -2
                    },
                    {
                        name: 'F',
                        diff: -2
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(true)
        }
    })

    test('standalone validations work without data', () => {
        process.env.USE_BOCK = true

        const data = null

        {
            const candidate = {
                kind: 'not a deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 'so many',
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: 1337
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 1337,
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: '1337'
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1.5
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }
    })

    test('standalone validation of zero-sum condition works', () => {
        process.env.USE_BOCK = true

        const data = null

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 100000
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }
    })

    test('standalone validation of diffs consistent within parties works', () => {
        process.env.USE_BOCK = true

        const data = null

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: -2
                    },
                    {
                        name: 'C',
                        diff: 2
                    },
                    {
                        name: 'D',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: 1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: -6
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'D',
                        diff: 2
                    },
                    {
                        name: 'F',
                        diff: 3
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }
    })

    test('all-zero deal is validated', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const data = [playersSet]

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 0
                    },
                    {
                        name: 'C',
                        diff: 0
                    },
                    {
                        name: 'D',
                        diff: 0
                    },
                    {
                        name: 'F',
                        diff: 0
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(true)
        }
    })

    test('duplicate player fails', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const data = [playersSet]

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'A',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }
    })

    test('non-active player fails', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const data = [playersSet]

        {
            const candidate = {
                kind: 'deal',
                events: 0,
                changes: [
                    {
                        name: 'A',
                        diff: 1
                    },
                    {
                        name: 'C',
                        diff: 1
                    },
                    {
                        name: 'E',
                        diff: -1
                    },
                    {
                        name: 'F',
                        diff: -1
                    }
                ]
            }

            const result = validateDeal(data, candidate)
            expect(result).toBe(false)
        }
    })
})

describe('calculate bock', () => {

    test('getMultiplier can handle sparse array bockHelper', () => {
        process.env.USE_BOCK = true

        const bockHelper = []

        bockHelper[1] = 0
        bockHelper[2] = 1
        bockHelper[3] = 2
        bockHelper[4] = 3

        expect(getMultiplier(bockHelper, 0)).toBe(1)
        expect(getMultiplier(bockHelper, 1)).toBe(1)
        expect(getMultiplier(bockHelper, 2)).toBe(2)
        expect(getMultiplier(bockHelper, 3)).toBe(4)
        expect(getMultiplier(bockHelper, 4)).toBe(8)
    })

    test('getMultiplier returns 1 if bock is disabled', () => {
        process.env.USE_BOCK = false

        const bockHelper = []

        bockHelper[1] = 0
        bockHelper[2] = 1
        bockHelper[3] = 2
        bockHelper[4] = 3

        expect(getMultiplier(bockHelper, 0)).toBe(1)
        expect(getMultiplier(bockHelper, 1)).toBe(1)
        expect(getMultiplier(bockHelper, 2)).toBe(1)
        expect(getMultiplier(bockHelper, 3)).toBe(1)
        expect(getMultiplier(bockHelper, 4)).toBe(1)
    })

    test('bockHelper, bockPreview logic correct: simple', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }

        const dealNoEvent = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const dealTwoEvents = {
            kind: 'deal',
            events: 2,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const data = [playersSet, dealNoEvent, dealNoEvent, dealTwoEvents, dealNoEvent]

        const bockHelper = constructBockHelper(data)

        expect(getMultiplier(bockHelper, 0)).toBe(1)
        expect(getMultiplier(bockHelper, 1)).toBe(1)
        expect(getMultiplier(bockHelper, 2)).toBe(1)
        expect(getMultiplier(bockHelper, 3)).toBe(4)
        expect(getMultiplier(bockHelper, 4)).toBe(4)
        expect(getMultiplier(bockHelper, 5)).toBe(4)
        expect(getMultiplier(bockHelper, 6)).toBe(4)
        expect(getMultiplier(bockHelper, 7)).toBe(1)
        expect(getMultiplier(bockHelper, 8)).toBe(1)

        const preview3 = createBockPreview(bockHelper, 3)

        expect(preview3.single).toBe(0)
        expect(preview3.double).toBe(4)
        expect(preview3.triple).toBe(0)

        const preview4 = createBockPreview(bockHelper, 4)

        expect(preview4.single).toBe(0)
        expect(preview4.double).toBe(3)
        expect(preview4.triple).toBe(0)
    })

    test('bockHelper, bockPreview logic correct: change players', () => {
        process.env.USE_BOCK = true

        const playersSet1 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }

        const dealTwoEvents = {
            kind: 'deal',
            events: 2,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const playersSet2 = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [2]
        }

        const dealOneEvent = {
            kind: 'deal',
            events: 1,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: 1
                },
                {
                    name: 'D',
                    diff: -1
                },
                {
                    name: 'F',
                    diff: -1
                }
            ]
        }

        const data = [playersSet1, dealTwoEvents, playersSet2, dealOneEvent]

        const bockHelper = constructBockHelper(data)

        expect(getMultiplier(bockHelper, 0)).toBe(1)
        expect(getMultiplier(bockHelper, 1)).toBe(4)
        expect(getMultiplier(bockHelper, 2)).toBe(4 * 2)
        expect(getMultiplier(bockHelper, 3)).toBe(4 * 2)
        expect(getMultiplier(bockHelper, 4)).toBe(4 * 2)
        expect(getMultiplier(bockHelper, 5)).toBe(1 * 2)
        expect(getMultiplier(bockHelper, 6)).toBe(1 * 2)
        expect(getMultiplier(bockHelper, 7)).toBe(1 * 2)
        expect(getMultiplier(bockHelper, 8)).toBe(1)

        const preview3 = createBockPreview(bockHelper, 3)

        expect(preview3.single).toBe(3)
        expect(preview3.double).toBe(0)
        expect(preview3.triple).toBe(2)

        const preview7 = createBockPreview(bockHelper, 7)

        expect(preview7.single).toBe(1)
        expect(preview7.double).toBe(0)
        expect(preview7.triple).toBe(0)

        const preview8 = createBockPreview(bockHelper, 8)

        expect(preview8.single).toBe(0)
        expect(preview8.double).toBe(0)
        expect(preview8.triple).toBe(0)
    })

    test('bockHelper, bockPreview logic correct: overload', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }

        const dealNoEvent = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const dealTwoEvents = {
            kind: 'deal',
            events: 2,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const data = [playersSet, dealTwoEvents, dealNoEvent, dealTwoEvents]

        const bockHelper = constructBockHelper(data)

        expect(getMultiplier(bockHelper, 0)).toBe(1)
        expect(getMultiplier(bockHelper, 1)).toBe(4)
        expect(getMultiplier(bockHelper, 2)).toBe(4)
        expect(getMultiplier(bockHelper, 3)).toBe(4 * 2)
        expect(getMultiplier(bockHelper, 4)).toBe(4 * 2)
        expect(getMultiplier(bockHelper, 5)).toBe(1 * 2 * 2)
        expect(getMultiplier(bockHelper, 6)).toBe(1 * 2 * 2)
        expect(getMultiplier(bockHelper, 7)).toBe(1 * 1 * 2)
        expect(getMultiplier(bockHelper, 8)).toBe(1 * 1 * 2)
        expect(getMultiplier(bockHelper, 9)).toBe(1)

        const preview3 = createBockPreview(bockHelper, 3)

        expect(preview3.single).toBe(2)
        expect(preview3.double).toBe(2)
        expect(preview3.triple).toBe(2)

        const preview6 = createBockPreview(bockHelper, 6)

        expect(preview6.single).toBe(2)
        expect(preview6.double).toBe(1)
        expect(preview6.triple).toBe(0)
    })

    test('bockHelper, bockPreview logic correct: mandatory solo trigger', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }

        const dealNoEvent = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const dealTwoEvents = {
            kind: 'deal',
            events: 2,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const mandatorySoloTrigger = {
            kind: 'mandatorySoloTrigger',
        }

        const data = [playersSet, dealTwoEvents, dealNoEvent, dealTwoEvents, dealNoEvent, mandatorySoloTrigger]

        const bockHelper = constructBockHelper(data)

        expect(getMultiplier(bockHelper, 0)).toBe(1)
        expect(getMultiplier(bockHelper, 1)).toBe(4)
        expect(getMultiplier(bockHelper, 2)).toBe(4)
        expect(getMultiplier(bockHelper, 3)).toBe(4 * 2)

        // the mandatory solo round
        expect(getMultiplier(bockHelper, 4)).toBe(1)
        expect(getMultiplier(bockHelper, 5)).toBe(1)
        expect(getMultiplier(bockHelper, 6)).toBe(1)
        expect(getMultiplier(bockHelper, 7)).toBe(1)

        // back to normal games
        expect(getMultiplier(bockHelper, 8)).toBe(4 * 2)
        expect(getMultiplier(bockHelper, 9)).toBe(1 * 2 * 2)
        expect(getMultiplier(bockHelper, 10)).toBe(1 * 2 * 2)
        expect(getMultiplier(bockHelper, 11)).toBe(1 * 1 * 2)
        expect(getMultiplier(bockHelper, 12)).toBe(1 * 1 * 2)
        expect(getMultiplier(bockHelper, 13)).toBe(1)

        const preview4 = createBockPreview(bockHelper, 4)

        expect(preview4.single).toBe(2)
        expect(preview4.double).toBe(2)
        expect(preview4.triple).toBe(1)
    })
})

describe('validate mandatorySoloTrigger', () => {

    test('correct mandatorySoloTrigger is validated (useBock: true)', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const data = [playersSet]

        const candidate = {
            kind: 'mandatorySoloTrigger',
        }

        const result = validateMandatorySoloTrigger(data, candidate)
        expect(result).toBe(true)
    })

    test('mandatorySoloTrigger fails validation (useBock: false)', () => {
        process.env.USE_BOCK = false

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F'],
            dealerName: 'B',
            sitOutScheme: [3]
        }

        const data = [playersSet]

        const candidate = {
            kind: 'mandatorySoloTrigger',
        }

        const result = validateMandatorySoloTrigger(data, candidate)
        expect(result).toBe(false)
    })

    test('standalone validation works without data (useBock: true)', () => {
        process.env.USE_BOCK = true

        const data = null

        {
            const candidate = {
                kind: 'deal',
            }

            const result = validateMandatorySoloTrigger(data, candidate)
            expect(result).toBe(false)
        }
    })

    test('standalone validation without data fails (useBock: false)', () => {
        process.env.USE_BOCK = false

        const data = null

        {
            const candidate = {
                kind: 'deal',
            }

            const result = validateMandatorySoloTrigger(data, candidate)
            expect(result).toBe(false)
        }
    })

    test('too early trigger is handled (useBock: true)', () => {
        process.env.USE_BOCK = true

        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D'],
            dealerName: 'A',
            sitOutScheme: []
        }

        const mandatorySoloTrigger = {
            kind: 'mandatorySoloTrigger',
        }

        const deal = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: 1
                },
                {
                    name: 'B',
                    diff: 1
                },
                {
                    name: 'C',
                    diff: -1
                },
                {
                    name: 'D',
                    diff: -1
                }
            ]
        }

        const data = [playersSet, mandatorySoloTrigger, deal, deal]

        const result = validateMandatorySoloTrigger(data, mandatorySoloTrigger)
        expect(result).toBe(false)
    })
})

describe('convert point difference to cents', () => {

    test('calculation works as expected', () => {

        const result = pointDifferenceToCents(4)
        expect(result).toBe(2)
    })

    test('calculation uses truncation', () => {

        const result = pointDifferenceToCents(7)
        expect(result).toBe(3)
    })
})

describe('find solo player', () => {

    test('normal game has no solo player', () => {

        const changes = [
            {
                name: 'A',
                diff: 6
            },
            {
                name: 'B',
                diff: 6
            },
            {
                name: 'C',
                diff: -6
            },
            {
                name: 'D',
                diff: -6
            }
        ]

        const result = findSoloPlayer(changes)
        expect(result).toBeNull()
    })

    test('zero game has no solo player', () => {

        const changes = [
            {
                name: 'A',
                diff: 0
            },
            {
                name: 'B',
                diff: 0
            },
            {
                name: 'C',
                diff: 0
            },
            {
                name: 'D',
                diff: 0
            }
        ]

        const result = findSoloPlayer(changes)
        expect(result).toBeNull()
    })

    test('won solo has a solo player', () => {

        const changes = [
            {
                name: 'A',
                diff: 3
            },
            {
                name: 'B',
                diff: -1
            },
            {
                name: 'C',
                diff: -1
            },
            {
                name: 'D',
                diff: -1
            }
        ]

        const result = findSoloPlayer(changes)
        expect(result).toBe('A')
    })

    test('lost solo has a solo player', () => {

        const changes = [
            {
                name: 'A',
                diff: 1
            },
            {
                name: 'B',
                diff: 1
            },
            {
                name: 'C',
                diff: -3
            },
            {
                name: 'D',
                diff: 1
            }
        ]

        const result = findSoloPlayer(changes)
        expect(result).toBe('C')
    })
})
