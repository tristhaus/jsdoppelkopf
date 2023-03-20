const Game = require('../models/game')

const testingRouter = require('express').Router()

testingRouter.post('/reset', async (request, response) => {
    Game.deleteMany({})

    response.status(204).end()
})

testingRouter.post('/setup', async (request, response) => {
    const content = request.body

    const game = new Game(content)

    await game.save()

    response.status(204).end()
})

module.exports = testingRouter
