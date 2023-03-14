const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('game API', () => {

    test('POST creates new game', async () => {
        const response = await api.post('/api/game')

        expect(response.body).toBeDefined()
        expect(response.body.writerId).toBeDefined()
        expect(response.body.readerId).toBeDefined()
    })

})
