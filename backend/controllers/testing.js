const Game = require('../models/game')

const testingRouter = require('express').Router()

testingRouter.post('/reset', async (request, response) => {
    const result = await Game.deleteMany({ dataVersion: 1 })

    console.log('/RESET', result)

    response.status(200).json(result)
})

testingRouter.post('/setup', async (request, response) => {
    const content = request.body

    const game = new Game(content)

    game.markModified('data')
    const result = await game.save()

    console.log('/SETUP', result)

    response.status(204).end()
})

testingRouter.post('/usebock', async (request, response) => {
    const content = request.body

    process.env.USE_BOCK = content.useBock

    const result = { useBock: process.env.USE_BOCK }

    console.log('/USEBOCK', result)

    response.status(200).json(result)
})

module.exports = testingRouter
