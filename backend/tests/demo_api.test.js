const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('demo API', () => {

    test('GET yields expected object', async () => {
        const response = await api.get('/api/demo')

        expect(response.body).toBeDefined()
        expect(response.body.answer).toEqual(42)
    })

})
