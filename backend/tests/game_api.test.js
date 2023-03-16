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
        expect(response.body.dealerName).toBe('C')

        const playerData = response.body.playerData

        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(true)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(false)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(true)

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(false)

        expect(playerData[5].name).toBe('F')
        expect(playerData[5].present).toBe(true)
        expect(playerData[5].playing).toBe(true)

        expect(playerData[6].name).toBe('G')
        expect(playerData[6].present).toBe(true)
        expect(playerData[6].playing).toBe(false)
    }
}

beforeAll(async () => {
    await Game.deleteMany({})
})

describe('game API', () => {

    test('POST creates new game', async () => {
        const response = await api.post('/api/game').send(testData.validPlayersSet)

        expect(response.status).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body.writerId).toBeDefined()
        expect(response.body.readerId).toBeDefined()

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

        const playerData = response.body.playerData

        expect(playerData[0].name).toBe('A')
        expect(playerData[0].present).toBe(true)
        expect(playerData[0].playing).toBe(false)
        expect(playerData[0].score).toBe(1)

        expect(playerData[1].name).toBe('B')
        expect(playerData[1].present).toBe(true)
        expect(playerData[1].playing).toBe(true)
        expect(playerData[1].score).toBe(1)

        expect(playerData[2].name).toBe('C')
        expect(playerData[2].present).toBe(true)
        expect(playerData[2].playing).toBe(true)
        expect(playerData[2].score).toBe(0)

        expect(playerData[3].name).toBe('D')
        expect(playerData[3].present).toBe(true)
        expect(playerData[3].playing).toBe(false)
        expect(playerData[3].score).toBe(-1)

        expect(playerData[4].name).toBe('E')
        expect(playerData[4].present).toBe(true)
        expect(playerData[4].playing).toBe(true)
        expect(playerData[4].score).toBe(0)

        expect(playerData[5].name).toBe('F')
        expect(playerData[5].present).toBe(true)
        expect(playerData[5].playing).toBe(false)
        expect(playerData[5].score).toBe(-1)

        expect(playerData[6].name).toBe('G')
        expect(playerData[6].present).toBe(true)
        expect(playerData[6].playing).toBe(true)
        expect(playerData[6].score).toBe(0)
    })

    test('POST deal validates deal and fails', async () => {
        const creationResponse = await api.post('/api/game').send(testData.validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const writeGamePath = `/api/game/write/${writerId}/deal`

        const deal = {
            kind: 'deal',
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
