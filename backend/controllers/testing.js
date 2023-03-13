const testingRouter = require('express').Router()

testingRouter.post('/reset', async (request, response) => {

    response.status(204).end()
})

module.exports = testingRouter
