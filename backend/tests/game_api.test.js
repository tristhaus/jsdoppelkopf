const supertest = require('supertest')
const app = require('../app')
const Game = require('../models/game')

const api = supertest(app)

const testData = {
    validPlayersSet: {
        kind: 'playersSet',
        playerNames: [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G'
        ],
        dealerName: 'C',
        sitOutScheme: [
            2,
            4
        ]
    },
    validateResult: response => {

        const { playerData, dealerName, bockPreview, isMandatorySolo, } = response.body

        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)
        expect(playerData[0].lastDealDiff).toBeNull()

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].lastDealDiff).toBeNull()

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(false)
        expect(playerData[2].lastDealDiff).toBeNull()

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)
        expect(playerData[3].lastDealDiff).toBeNull()

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(false)
        expect(playerData[4].lastDealDiff).toBeNull()

        expect(playerData[5].name).toBe('F')
        expect(playerData[5].present).toBe(true)
        expect(playerData[5].playing).toBe(true)
        expect(playerData[5].lastDealDiff).toBeNull()

        expect(playerData[6].name).toBe('G')
        expect(playerData[6].present).toBe(true)
        expect(playerData[6].playing).toBe(false)
        expect(playerData[6].lastDealDiff).toBeNull()

        expect(dealerName).toBe('C')

        expect(bockPreview.single).toBe(0)
        expect(bockPreview.double).toBe(0)
        expect(bockPreview.triple).toBe(0)

        expect(isMandatorySolo).toBe(false)
    }
}

beforeAll(async () => {
    await Game.deleteMany({})
})

afterAll(async () => {
    await Game.deleteMany({})
})

describe('game API', () => {

    test('POST creates new game', async () => {
        const response = await api.post('/api/game').send(testData.validPlayersSet)

        expect(response.status).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body.deploymentUrl).toBeDefined()
        expect(response.body.writerId).toMatch(/W[A-Z]{6}/)
        expect(response.body.readerId).toMatch(/R[A-Z]{6}/)

        testData.validateResult(response)
    })

    test('POST does not create new game when playersSet is invalid', async () => {
        const response = await api.post('/api/game').send({
            kind: 'playersSet',
            playerNames: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G'
            ],
            dealerName: 'Invalid Dealer Name',
            sitOutScheme: [
                2,
                4
            ]
        })

        expect(response.status).toBe(400)
        expect(response.body).toBeDefined()
    })

    test('Game is accessible to writers by writer ID', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const writeGamePath = `/api/game/write/${writerId}`

        const response = await api.get(writeGamePath)

        expect(response.status).toBe(200)
        expect(response.body.writerId).toBeDefined()
        expect(response.body.readerId).toBeDefined()

        testData.validateResult(response)
    })

    test('Game is not accessible to writers by reader ID', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const readerId = creationResponse.body.readerId
        const writeGamePath = `/api/game/write/${readerId}`

        const response = await api.get(writeGamePath)

        expect(response.status).toBe(404)
    })

    test('POST playersset sets new players', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const writeGamePath = `/api/game/write/${writerId}/playersset`

        const playersSet = {
            kind: 'playersSet',
            playerNames: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G'
            ],
            dealerName: 'G',
            sitOutScheme: [
                2,
                4
            ]
        }

        const response = await api.post(writeGamePath).send(playersSet)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.writerId).toBeDefined()
        expect(response.body.readerId).toBeDefined()

        expect(response.body.dealerName).toBe('G')

        const playerData = response.body.playerData

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
        expect(playerData[5].playing).toBe(true)

        expect(playerData[6].name).toBe('G')
        expect(playerData[6].present).toBe(true)
        expect(playerData[6].playing).toBe(false)
    })

    test('POST playersset validates playersSet and fails', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const writeGamePath = `/api/game/write/${writerId}/playersset`

        const playersSet = {
            kind: 'playersSet',
            playerNames: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G'
            ],
            dealerName: 'Invalid Dealer Name',
            sitOutScheme: [
                2,
                4
            ]
        }

        const response = await api.post(writeGamePath).send(playersSet)

        expect(response.status).toBe(400)
        expect(response.body).toBeDefined()
    })

    test('POST deal is applied', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const writeGamePath = `/api/game/write/${writerId}/deal`

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
                    name: 'D',
                    diff: -1
                },
                {
                    name: 'F',
                    diff: -1
                }
            ],
        }

        const response = await api.post(writeGamePath).send(deal)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.writerId).toBeDefined()
        expect(response.body.readerId).toBeDefined()

        expect(response.body.dealerName).toBe('D')

        const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents } = response.body

        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(false)
        expect(playerData[0].score).toBe(1)
        expect(playerData[0].lastDealDiff).toBe(1)
        expect(playerData[0].cents).toBe(0)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].score).toBe(1)
        expect(playerData[1].lastDealDiff).toBe(1)
        expect(playerData[1].cents).toBe(0)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(0)
        expect(playerData[2].lastDealDiff).toBeNull()
        expect(playerData[2].cents).toBe(0)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(false)
        expect(playerData[3].score).toBe(-1)
        expect(playerData[3].lastDealDiff).toBe(-1)
        expect(playerData[3].cents).toBe(1)

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)
        expect(playerData[4].score).toBe(0)
        expect(playerData[4].lastDealDiff).toBeNull()
        expect(playerData[4].cents).toBe(0)

        expect(playerData[5].name).toBe('F')
        expect(playerData[5].present).toBe(true)
        expect(playerData[5].playing).toBe(false)
        expect(playerData[5].score).toBe(-1)
        expect(playerData[5].lastDealDiff).toBe(-1)
        expect(playerData[5].cents).toBe(1)

        expect(playerData[6].name).toBe('G')
        expect(playerData[6].present).toBe(true)
        expect(playerData[6].playing).toBe(true)
        expect(playerData[6].score).toBe(0)
        expect(playerData[6].lastDealDiff).toBeNull()
        expect(playerData[6].cents).toBe(0)

        expect(dealerName).toBe('D')

        expect(bockPreview.single).toBe(0)
        expect(bockPreview.double).toBe(0)
        expect(bockPreview.triple).toBe(0)

        expect(isMandatorySolo).toBe(false)

        expect(totalCash).toBe(2)
        expect(absentPlayerCents).toBe(0)
    })

    test('POST deal validates deal and fails', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const writeGamePath = `/api/game/write/${writerId}/deal`

        const deal = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'Unknown Player',
                    diff: 1
                },
                {
                    name: 'B',
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
            ],
        }

        const response = await api.post(writeGamePath).send(deal)

        expect(response.status).toBe(400)
    })

    test('POST several deals are applied', async () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: [
                'A',
                'B',
                'C',
                'D',
                'E',
            ],
            dealerName: 'A',
            sitOutScheme: []
        }

        const creationResponse = await api.post('/api/game').send(playersSet)

        expect(creationResponse.status).toBe(201)

        const writerId = creationResponse.body.writerId

        const dealPath = `/api/game/write/${writerId}/deal`
        const mandatorySoloTriggerPath = `/api/game/write/${writerId}/mandatorysolotrigger`

        const deal1 = {
            kind: 'deal',
            events: 2,
            changes: [
                {
                    name: 'B',
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
                    name: 'E',
                    diff: -1
                }
            ],
        }

        const responseDeal1 = await api.post(dealPath).send(deal1)

        expect(responseDeal1.status).toBe(200)
        expect(responseDeal1.body).toBeDefined()

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeal1.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(0)
            expect(playerData[0].lastDealDiff).toBeNull()
            expect(playerData[0].cents).toBe(0)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(0)
            expect(playerData[0].noBockScore).toBe(0)
            expect(playerData[0].num).toBe(0)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(0)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(1)
            expect(playerData[1].lastDealDiff).toBe(1)
            expect(playerData[1].cents).toBe(0)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(0)
            expect(playerData[1].noBockScore).toBe(1)
            expect(playerData[1].num).toBe(1)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(0)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(1)
            expect(playerData[2].lastDealDiff).toBe(1)
            expect(playerData[2].cents).toBe(0)
            expect(playerData[2].maxWin).toBe(1)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(1)
            expect(playerData[2].num).toBe(1)
            expect(playerData[2].numWin).toBe(1)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(-1)
            expect(playerData[3].lastDealDiff).toBe(-1)
            expect(playerData[3].cents).toBe(1)
            expect(playerData[3].maxWin).toBe(0)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(-1)
            expect(playerData[3].num).toBe(1)
            expect(playerData[3].numWin).toBe(0)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(0)
            expect(playerData[3].numWonSolo).toBe(0)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-1)
            expect(playerData[4].lastDealDiff).toBe(-1)
            expect(playerData[4].cents).toBe(1)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-1)
            expect(playerData[4].noBockScore).toBe(-1)
            expect(playerData[4].num).toBe(1)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(1)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('B')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(5)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(false)

            expect(totalCash).toBe(2)
            expect(absentPlayerCents).toBe(0)
        }

        const deal2 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: -3
                },
                {
                    name: 'C',
                    diff: 3
                },
                {
                    name: 'D',
                    diff: 3
                },
                {
                    name: 'E',
                    diff: -3
                }
            ],
        }

        const responseDeal2 = await api.post(dealPath).send(deal2)

        expect(responseDeal2.status).toBe(200)
        expect(responseDeal2.body).toBeDefined()

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeal2.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(-12)
            expect(playerData[0].lastDealDiff).toBe(-3)
            expect(playerData[0].cents).toBe(12)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(-12)
            expect(playerData[0].noBockScore).toBe(-3)
            expect(playerData[0].num).toBe(1)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(1)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(1)
            expect(playerData[1].lastDealDiff).toBeNull()
            expect(playerData[1].cents).toBe(6)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(0)
            expect(playerData[1].noBockScore).toBe(1)
            expect(playerData[1].num).toBe(1)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(0)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(13)
            expect(playerData[2].lastDealDiff).toBe(3)
            expect(playerData[2].cents).toBe(0)
            expect(playerData[2].maxWin).toBe(12)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(4)
            expect(playerData[2].num).toBe(2)
            expect(playerData[2].numWin).toBe(2)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(11)
            expect(playerData[3].lastDealDiff).toBe(3)
            expect(playerData[3].cents).toBe(1)
            expect(playerData[3].maxWin).toBe(12)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(2)
            expect(playerData[3].num).toBe(2)
            expect(playerData[3].numWin).toBe(1)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(0)
            expect(playerData[3].numWonSolo).toBe(0)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-13)
            expect(playerData[4].lastDealDiff).toBe(-3)
            expect(playerData[4].cents).toBe(13)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-12)
            expect(playerData[4].noBockScore).toBe(-4)
            expect(playerData[4].num).toBe(2)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(2)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('C')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(4)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(false)

            expect(totalCash).toBe(32 + 3 * 6)
            expect(absentPlayerCents).toBe(6)
        }

        const mandatorySoloTrigger = {
            kind: 'mandatorySoloTrigger',
        }

        const responseMandatorySoloTrigger = await api.post(mandatorySoloTriggerPath).send(mandatorySoloTrigger)

        expect(responseMandatorySoloTrigger.status).toBe(200)
        expect(responseMandatorySoloTrigger.body).toBeDefined()

        expect(responseMandatorySoloTrigger.body.dealerName).toBe('C')
        expect(responseMandatorySoloTrigger.body.isMandatorySolo).toBe(true)

        {
            const { playerData, } = responseDeal2.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(-12)
            expect(playerData[0].lastDealDiff).toBe(-3)
            expect(playerData[0].cents).toBe(12)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(-12)
            expect(playerData[0].noBockScore).toBe(-3)
            expect(playerData[0].num).toBe(1)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(1)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(1)
            expect(playerData[1].lastDealDiff).toBeNull()
            expect(playerData[1].cents).toBe(6)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(0)
            expect(playerData[1].noBockScore).toBe(1)
            expect(playerData[1].num).toBe(1)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(0)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(13)
            expect(playerData[2].lastDealDiff).toBe(3)
            expect(playerData[2].cents).toBe(0)
            expect(playerData[2].maxWin).toBe(12)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(4)
            expect(playerData[2].num).toBe(2)
            expect(playerData[2].numWin).toBe(2)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(11)
            expect(playerData[3].lastDealDiff).toBe(3)
            expect(playerData[3].cents).toBe(1)
            expect(playerData[3].maxWin).toBe(12)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(2)
            expect(playerData[3].num).toBe(2)
            expect(playerData[3].numWin).toBe(1)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(0)
            expect(playerData[3].numWonSolo).toBe(0)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-13)
            expect(playerData[4].lastDealDiff).toBe(-3)
            expect(playerData[4].cents).toBe(13)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-12)
            expect(playerData[4].noBockScore).toBe(-4)
            expect(playerData[4].num).toBe(2)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(2)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)
        }

        const deal3 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: -5
                },
                {
                    name: 'B',
                    diff: -5
                },
                {
                    name: 'D',
                    diff: 15
                },
                {
                    name: 'E',
                    diff: -5
                }
            ],
        }

        const responseDeal3 = await api.post(dealPath).send(deal3)

        expect(responseDeal3.status).toBe(200)
        expect(responseDeal3.body).toBeDefined()

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeal3.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(-17)
            expect(playerData[0].lastDealDiff).toBe(-5)
            expect(playerData[0].cents).toBe(21)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(-12)
            expect(playerData[0].noBockScore).toBe(-8)
            expect(playerData[0].num).toBe(2)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(2)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(-4)
            expect(playerData[1].lastDealDiff).toBe(-5)
            expect(playerData[1].cents).toBe(15)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(-5)
            expect(playerData[1].noBockScore).toBe(-4)
            expect(playerData[1].num).toBe(2)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(1)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(13)
            expect(playerData[2].lastDealDiff).toBeNull()
            expect(playerData[2].cents).toBe(6)
            expect(playerData[2].maxWin).toBe(12)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(4)
            expect(playerData[2].num).toBe(2)
            expect(playerData[2].numWin).toBe(2)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(26)
            expect(playerData[3].lastDealDiff).toBe(15)
            expect(playerData[3].cents).toBe(0)
            expect(playerData[3].maxWin).toBe(15)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(17)
            expect(playerData[3].num).toBe(3)
            expect(playerData[3].numWin).toBe(2)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(15)
            expect(playerData[3].numWonSolo).toBe(1)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-18)
            expect(playerData[4].lastDealDiff).toBe(-5)
            expect(playerData[4].cents).toBe(22)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-12)
            expect(playerData[4].noBockScore).toBe(-9)
            expect(playerData[4].num).toBe(3)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(3)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('D')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(4)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(true)

            expect(totalCash).toBe(64 + 3 * 13)
            expect(absentPlayerCents).toBe(13)
        }
    })

    test('DELETE of entries is possible', async () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: [
                'A',
                'B',
                'C',
                'D',
                'E',
            ],
            dealerName: 'A',
            sitOutScheme: []
        }

        const creationResponse = await api.post('/api/game').send(playersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        expect(creationResponse.body.poppableEntry).toBe(null)

        const writerId = creationResponse.body.writerId

        const dealPath = `/api/game/write/${writerId}/deal`
        const mandatorySoloTriggerPath = `/api/game/write/${writerId}/mandatorysolotrigger`
        const popEntryPath = `/api/game/write/${writerId}/entry`

        const deal1 = {
            kind: 'deal',
            events: 2,
            changes: [
                {
                    name: 'B',
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
                    name: 'E',
                    diff: -1
                }
            ],
        }

        const responseDeal1 = await api.post(dealPath).send(deal1)

        expect(responseDeal1.status).toBe(200)
        expect(responseDeal1.body).toBeDefined()

        expect(responseDeal1.body.poppableEntry).toBe('deal')

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeal1.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(0)
            expect(playerData[0].lastDealDiff).toBeNull()
            expect(playerData[0].cents).toBe(0)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(0)
            expect(playerData[0].noBockScore).toBe(0)
            expect(playerData[0].num).toBe(0)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(0)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(1)
            expect(playerData[1].lastDealDiff).toBe(1)
            expect(playerData[1].cents).toBe(0)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(0)
            expect(playerData[1].noBockScore).toBe(1)
            expect(playerData[1].num).toBe(1)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(0)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(1)
            expect(playerData[2].lastDealDiff).toBe(1)
            expect(playerData[2].cents).toBe(0)
            expect(playerData[2].maxWin).toBe(1)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(1)
            expect(playerData[2].num).toBe(1)
            expect(playerData[2].numWin).toBe(1)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(-1)
            expect(playerData[3].lastDealDiff).toBe(-1)
            expect(playerData[3].cents).toBe(1)
            expect(playerData[3].maxWin).toBe(0)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(-1)
            expect(playerData[3].num).toBe(1)
            expect(playerData[3].numWin).toBe(0)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(0)
            expect(playerData[3].numWonSolo).toBe(0)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-1)
            expect(playerData[4].lastDealDiff).toBe(-1)
            expect(playerData[4].cents).toBe(1)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-1)
            expect(playerData[4].noBockScore).toBe(-1)
            expect(playerData[4].num).toBe(1)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(1)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('B')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(5)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(false)

            expect(totalCash).toBe(2)
            expect(absentPlayerCents).toBe(0)
        }

        const deal2 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: -3
                },
                {
                    name: 'C',
                    diff: 3
                },
                {
                    name: 'D',
                    diff: 3
                },
                {
                    name: 'E',
                    diff: -3
                }
            ],
        }

        const responseDeal2 = await api.post(dealPath).send(deal2)

        expect(responseDeal2.status).toBe(200)
        expect(responseDeal2.body).toBeDefined()

        expect(responseDeal2.body.poppableEntry).toBe('deal')

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeal2.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(-12)
            expect(playerData[0].lastDealDiff).toBe(-3)
            expect(playerData[0].cents).toBe(12)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(-12)
            expect(playerData[0].noBockScore).toBe(-3)
            expect(playerData[0].num).toBe(1)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(1)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(1)
            expect(playerData[1].lastDealDiff).toBeNull()
            expect(playerData[1].cents).toBe(6)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(0)
            expect(playerData[1].noBockScore).toBe(1)
            expect(playerData[1].num).toBe(1)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(0)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(13)
            expect(playerData[2].lastDealDiff).toBe(3)
            expect(playerData[2].cents).toBe(0)
            expect(playerData[2].maxWin).toBe(12)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(4)
            expect(playerData[2].num).toBe(2)
            expect(playerData[2].numWin).toBe(2)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(11)
            expect(playerData[3].lastDealDiff).toBe(3)
            expect(playerData[3].cents).toBe(1)
            expect(playerData[3].maxWin).toBe(12)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(2)
            expect(playerData[3].num).toBe(2)
            expect(playerData[3].numWin).toBe(1)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(0)
            expect(playerData[3].numWonSolo).toBe(0)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-13)
            expect(playerData[4].lastDealDiff).toBe(-3)
            expect(playerData[4].cents).toBe(13)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-12)
            expect(playerData[4].noBockScore).toBe(-4)
            expect(playerData[4].num).toBe(2)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(2)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('C')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(4)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(false)

            expect(totalCash).toBe(32 + 3 * 6)
            expect(absentPlayerCents).toBe(6)
        }

        const mandatorySoloTrigger = {
            kind: 'mandatorySoloTrigger',
        }

        const responseMandatorySoloTrigger = await api.post(mandatorySoloTriggerPath).send(mandatorySoloTrigger)

        expect(responseMandatorySoloTrigger.status).toBe(200)
        expect(responseMandatorySoloTrigger.body).toBeDefined()

        expect(responseMandatorySoloTrigger.body.dealerName).toBe('C')
        expect(responseMandatorySoloTrigger.body.poppableEntry).toBe('mandatorySoloTrigger')
        expect(responseMandatorySoloTrigger.body.isMandatorySolo).toBe(true)

        const deal3 = {
            kind: 'deal',
            events: 0,
            changes: [
                {
                    name: 'A',
                    diff: -5
                },
                {
                    name: 'B',
                    diff: -5
                },
                {
                    name: 'D',
                    diff: 15
                },
                {
                    name: 'E',
                    diff: -5
                }
            ],
        }

        const responseDeal3 = await api.post(dealPath).send(deal3)

        expect(responseDeal3.status).toBe(200)
        expect(responseDeal3.body).toBeDefined()

        expect(responseDeal3.body.poppableEntry).toBe('deal')

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeal3.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(-17)
            expect(playerData[0].lastDealDiff).toBe(-5)
            expect(playerData[0].cents).toBe(21)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(-12)
            expect(playerData[0].noBockScore).toBe(-8)
            expect(playerData[0].num).toBe(2)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(2)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(-4)
            expect(playerData[1].lastDealDiff).toBe(-5)
            expect(playerData[1].cents).toBe(15)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(-5)
            expect(playerData[1].noBockScore).toBe(-4)
            expect(playerData[1].num).toBe(2)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(1)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(13)
            expect(playerData[2].lastDealDiff).toBeNull()
            expect(playerData[2].cents).toBe(6)
            expect(playerData[2].maxWin).toBe(12)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(4)
            expect(playerData[2].num).toBe(2)
            expect(playerData[2].numWin).toBe(2)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(26)
            expect(playerData[3].lastDealDiff).toBe(15)
            expect(playerData[3].cents).toBe(0)
            expect(playerData[3].maxWin).toBe(15)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(17)
            expect(playerData[3].num).toBe(3)
            expect(playerData[3].numWin).toBe(2)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(15)
            expect(playerData[3].numWonSolo).toBe(1)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-18)
            expect(playerData[4].lastDealDiff).toBe(-5)
            expect(playerData[4].cents).toBe(22)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-12)
            expect(playerData[4].noBockScore).toBe(-9)
            expect(playerData[4].num).toBe(3)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(3)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('D')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(4)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(true)

            expect(totalCash).toBe(64 + 3 * 13)
            expect(absentPlayerCents).toBe(13)
        }

        const responseDeleteToDeal2 = await api.delete(popEntryPath)

        expect(responseDeleteToDeal2.status).toBe(200)
        expect(responseDeleteToDeal2.body).toBeDefined()

        expect(responseDeleteToDeal2.body.poppableEntry).toBe('mandatorySoloTrigger')

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeleteToDeal2.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(-12)
            expect(playerData[0].lastDealDiff).toBe(-3)
            expect(playerData[0].cents).toBe(12)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(-12)
            expect(playerData[0].noBockScore).toBe(-3)
            expect(playerData[0].num).toBe(1)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(1)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(1)
            expect(playerData[1].lastDealDiff).toBeNull()
            expect(playerData[1].cents).toBe(6)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(0)
            expect(playerData[1].noBockScore).toBe(1)
            expect(playerData[1].num).toBe(1)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(0)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(13)
            expect(playerData[2].lastDealDiff).toBe(3)
            expect(playerData[2].cents).toBe(0)
            expect(playerData[2].maxWin).toBe(12)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(4)
            expect(playerData[2].num).toBe(2)
            expect(playerData[2].numWin).toBe(2)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(11)
            expect(playerData[3].lastDealDiff).toBe(3)
            expect(playerData[3].cents).toBe(1)
            expect(playerData[3].maxWin).toBe(12)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(2)
            expect(playerData[3].num).toBe(2)
            expect(playerData[3].numWin).toBe(1)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(0)
            expect(playerData[3].numWonSolo).toBe(0)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-13)
            expect(playerData[4].lastDealDiff).toBe(-3)
            expect(playerData[4].cents).toBe(13)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-12)
            expect(playerData[4].noBockScore).toBe(-4)
            expect(playerData[4].num).toBe(2)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(2)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('C')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(4)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(true)

            expect(totalCash).toBe(32 + 3 * 6)
            expect(absentPlayerCents).toBe(6)
        }

        const responseDeleteMandatorySolo = await api.delete(popEntryPath)

        expect(responseDeleteMandatorySolo.status).toBe(200)
        expect(responseDeleteMandatorySolo.body).toBeDefined()

        expect(responseDeleteMandatorySolo.body.dealerName).toBe('C')
        expect(responseDeleteMandatorySolo.body.poppableEntry).toBe('deal')

        const responseDeleteToDeal1 = await api.delete(popEntryPath)

        expect(responseDeleteToDeal1.status).toBe(200)
        expect(responseDeleteToDeal1.body).toBeDefined()

        expect(responseDeleteToDeal1.body.poppableEntry).toBe('deal')

        {
            const { playerData, dealerName, bockPreview, isMandatorySolo, totalCash, absentPlayerCents, } = responseDeleteToDeal1.body

            expect(playerData[0].name).toBe('A')
            expect(playerData[0].score).toBe(0)
            expect(playerData[0].lastDealDiff).toBeNull()
            expect(playerData[0].cents).toBe(0)
            expect(playerData[0].maxWin).toBe(0)
            expect(playerData[0].maxLoss).toBe(0)
            expect(playerData[0].noBockScore).toBe(0)
            expect(playerData[0].num).toBe(0)
            expect(playerData[0].numWin).toBe(0)
            expect(playerData[0].numLoss).toBe(0)
            expect(playerData[0].soloScore).toBe(0)
            expect(playerData[0].numWonSolo).toBe(0)
            expect(playerData[0].numLostSolo).toBe(0)

            expect(playerData[1].name).toBe('B')
            expect(playerData[1].score).toBe(1)
            expect(playerData[1].lastDealDiff).toBe(1)
            expect(playerData[1].cents).toBe(0)
            expect(playerData[1].maxWin).toBe(1)
            expect(playerData[1].maxLoss).toBe(0)
            expect(playerData[1].noBockScore).toBe(1)
            expect(playerData[1].num).toBe(1)
            expect(playerData[1].numWin).toBe(1)
            expect(playerData[1].numLoss).toBe(0)
            expect(playerData[1].soloScore).toBe(0)
            expect(playerData[1].numWonSolo).toBe(0)
            expect(playerData[1].numLostSolo).toBe(0)

            expect(playerData[2].name).toBe('C')
            expect(playerData[2].score).toBe(1)
            expect(playerData[2].lastDealDiff).toBe(1)
            expect(playerData[2].cents).toBe(0)
            expect(playerData[2].maxWin).toBe(1)
            expect(playerData[2].maxLoss).toBe(0)
            expect(playerData[2].noBockScore).toBe(1)
            expect(playerData[2].num).toBe(1)
            expect(playerData[2].numWin).toBe(1)
            expect(playerData[2].numLoss).toBe(0)
            expect(playerData[2].soloScore).toBe(0)
            expect(playerData[2].numWonSolo).toBe(0)
            expect(playerData[2].numLostSolo).toBe(0)

            expect(playerData[3].name).toBe('D')
            expect(playerData[3].score).toBe(-1)
            expect(playerData[3].lastDealDiff).toBe(-1)
            expect(playerData[3].cents).toBe(1)
            expect(playerData[3].maxWin).toBe(0)
            expect(playerData[3].maxLoss).toBe(-1)
            expect(playerData[3].noBockScore).toBe(-1)
            expect(playerData[3].num).toBe(1)
            expect(playerData[3].numWin).toBe(0)
            expect(playerData[3].numLoss).toBe(1)
            expect(playerData[3].soloScore).toBe(0)
            expect(playerData[3].numWonSolo).toBe(0)
            expect(playerData[3].numLostSolo).toBe(0)

            expect(playerData[4].name).toBe('E')
            expect(playerData[4].score).toBe(-1)
            expect(playerData[4].lastDealDiff).toBe(-1)
            expect(playerData[4].cents).toBe(1)
            expect(playerData[4].maxWin).toBe(0)
            expect(playerData[4].maxLoss).toBe(-1)
            expect(playerData[4].noBockScore).toBe(-1)
            expect(playerData[4].num).toBe(1)
            expect(playerData[4].numWin).toBe(0)
            expect(playerData[4].numLoss).toBe(1)
            expect(playerData[4].soloScore).toBe(0)
            expect(playerData[4].numWonSolo).toBe(0)
            expect(playerData[4].numLostSolo).toBe(0)

            expect(dealerName).toBe('B')

            expect(bockPreview.single).toBe(0)
            expect(bockPreview.double).toBe(5)
            expect(bockPreview.triple).toBe(0)

            expect(isMandatorySolo).toBe(false)

            expect(totalCash).toBe(2)
            expect(absentPlayerCents).toBe(0)
        }

        const responseDeleteToInitialPlayersSet = await api.delete(popEntryPath)

        expect(responseDeleteToInitialPlayersSet.status).toBe(200)
        expect(responseDeleteToInitialPlayersSet.body).toBeDefined()

        expect(responseDeleteToInitialPlayersSet.body.poppableEntry).toBe(null)
    })

    test('DELETE of first entry is not possible, game remains valid', async () => {
        const playersSet = {
            kind: 'playersSet',
            playerNames: [
                'A',
                'B',
                'C',
                'D',
                'E',
            ],
            dealerName: 'A',
            sitOutScheme: []
        }

        const creationResponse = await api.post('/api/game').send(playersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        expect(creationResponse.body.poppableEntry).toBe(null)

        const writerId = creationResponse.body.writerId

        const popEntryPath = `/api/game/write/${writerId}/entry`

        const response = await api.delete(popEntryPath)
        expect(response.status).toBe(400)

        const getPath = `/api/game/write/${writerId}`

        const getResponse = await api.get(getPath)
        expect(getResponse.status).toBe(200)
    })

    test('Game is accessible to readers by reader ID', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const readerId = creationResponse.body.readerId
        const readGamePath = `/api/game/${readerId}`

        const response = await api.get(readGamePath)

        expect(response.status).toBe(200)
        expect(response.body.writerId).not.toBeDefined()
        expect(response.body.readerId).toBeDefined()

        testData.validateResult(response)
    })

    test('Game is not accessible to readers by writer ID', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const readGamePath = `/api/game/${writerId}`

        const response = await api.get(readGamePath)

        expect(response.status).toBe(404)
    })
})
