const { calculatePlayerData, constructBockHelper, determineDealer, getMultiplier, pointDifferenceToCents, validateDeal, validateMandatorySoloTrigger, validatePlayerSet, } = require('../logic/game')

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

    test('5: dealer sits out', () => {
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

    test('7: sit out scheme applied', () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            dealerName: 'D',
            sitOutScheme: [2, 4]
        }

        const data = [playersSet]

        const playerData = calculatePlayerData(data)
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

    test('4-d-5-dd: deals correctly used', () => {
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

        const dealer = determineDealer(data)
        expect(dealer).toBe('A')

        const playerData = calculatePlayerData(data)
        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(false)
        expect(playerData[0].score).toBe(6)
        expect(playerData[0].cents).toBe(0)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].score).toBe(2)
        expect(playerData[1].cents).toBe(2)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(-2)
        expect(playerData[2].cents).toBe(4)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
        expect(playerData[3].score).toBe(-4)
        expect(playerData[3].cents).toBe(5)

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)
        expect(playerData[4].score).toBe(-2)
        expect(playerData[4].cents).toBe(4)
    })
})

describe('validate deal', () => {

    test('correct deal is validated', () => {

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
    })

    test('standalone validations work without data', () => {

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

    test('duplicate player fails', () => {

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

    test('bockHelper is constructed correctly: simple', () => {

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
    })

    test('bockHelper is constructed correctly: change players', () => {

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
    })

    test('bockHelper is constructed correctly: overload', () => {

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
    })

    test('bockHelper is constructed correctly: mandatory solo trigger', () => {

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
    })
})

describe('validate mandatorySoloTrigger', () => {

    test('correct mandatorySoloTrigger is validated', () => {

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

    test('standalone validation works without data', () => {

        const data = null

        {
            const candidate = {
                kind: 'deal',
            }

            const result = validateMandatorySoloTrigger(data, candidate)
            expect(result).toBe(false)
        }
    })

    test('too early trigger is handled', () => {

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