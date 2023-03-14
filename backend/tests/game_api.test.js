const supertest = require('supertest')
const app = require('../app')
const Game = require('../models/game')

const api = supertest(app)

const validPlayersSet = {
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
    ],
    previousDealerName: 'C'
}

beforeAll(async () => {
    await Game.deleteMany({})
})

describe('game API', () => {

    test('POST creates new game', async () => {
        const response = await api.post('/api/game').send(validPlayersSet)

        expect(response.status).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body.writerId).toBeDefined()
        expect(response.body.readerId).toBeDefined()
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
            ],
            previousDealerName: 'C'
        })

        expect(response.status).toBe(400)
        expect(response.body).toBeDefined()
    })

    test('Game is accessible to readers by reader ID', async () => {
        const creationResponse = await api.post('/api/game').send(validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const readerId = creationResponse.body.readerId
        const readGamePath = `/api/game/${readerId}`

        const response = await api.get(readGamePath)

        expect(response.status).toBe(200)
        expect(response.body.writerId).not.toBeDefined()
        expect(response.body.readerId).toBeDefined()
    })

    test('Game is not accessible to readers by writer ID', async () => {
        const creationResponse = await api.post('/api/game').send(validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const readGamePath = `/api/game/${writerId}`

        const response = await api.get(readGamePath)

        expect(response.status).toBe(404)
    })

    test('Game is accessible to writers by writer ID', async () => {
        const creationResponse = await api.post('/api/game').send(validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const writerId = creationResponse.body.writerId
        const writeGamePath = `/api/game/write/${writerId}`

        const response = await api.get(writeGamePath)

        expect(response.status).toBe(200)
        expect(response.body.writerId).toBeDefined()
        expect(response.body.readerId).toBeDefined()
    })

    test('Game is not accessible to writers by reader ID', async () => {
        const creationResponse = await api.post('/api/game').send(validPlayersSet)

        expect(creationResponse.status).toBe(201)
        expect(creationResponse.body).toBeDefined()

        const readerId = creationResponse.body.readerId
        const writeGamePath = `/api/game/write/${readerId}`

        const response = await api.get(writeGamePath)

        expect(response.status).toBe(404)
    })

})
