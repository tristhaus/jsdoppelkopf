const Game = require('../models/game')

const testingRouter = require('express').Router()

testingRouter.post('/reset', async (request, response) => {
    Game.deleteMany({})

    response.status(204).end()
})

module.exports = testingRouter
