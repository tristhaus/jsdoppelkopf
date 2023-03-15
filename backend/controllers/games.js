const gamesRouter = require('express').Router()
const Game = require('../models/game')
const logger = require('../utils/logger')
const { validatePlayerSet, applyPlayersSet, determineDealer, calculatePlayerData } = require('../logic/game')

const dataVersion = 1

const letters = 'qwertzuiopasdfghjklyxcvbnm'

const getRandomLetter = () => {
    const index = Math.floor(Math.random() * 26)
    return letters[index]
}

const generateId = () => {
    return getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter()
}

const createApiModel = game => {
    return {
        readerId: game.readerId,
        creationDate: game.creationDate,
        dealerName: determineDealer(game.data),
        playerData: calculatePlayerData(game.data),
    }
}

gamesRouter.post('/', async (request, response, next) => {
    try {
        const playersSet = request.body

        if (!validatePlayerSet(playersSet)) {
            throw { name: 'ValidationError', message: 'invalid playersSet' }
        }

        const readerId = generateId()
        const writerId = generateId()

        const game = new Game(
            {
                readerId,
                writerId,
                dataVersion,
                creationDate: Date.now(),
                data: [playersSet],
            })

        const result = await game.save()

        const apiModel = createApiModel(result)
        apiModel.writerId = result.writerId

        response.status(201).json(apiModel)
    } catch (error) {
        next(error)
    }
})

// for writer
gamesRouter.get('/write/:writerId', async (request, response, next) => {
    try {
        const game = await Game.findOne({ writerId: request.params.writerId })

        if (!game) {
            logger.error(`game with writerId '${request.params.writerId}' not found`)
            response.status(404).send({ error: `writerId not found: ${request.params.writerId}` })
        }

        const apiModel = createApiModel(game)
        apiModel.writerId = game.writerId

        response.status(200).json(apiModel)
    } catch (error) {
        next(error)
    }
})

gamesRouter.post('/write/:writerId/playersset', async (request, response, next) => {
    try {
        const playersSet = request.body

        if (!validatePlayerSet(playersSet)) {
            throw { name: 'ValidationError', message: 'invalid playersSet' }
        }

        const game = await Game.findOne({ writerId: request.params.writerId })

        if (!game) {
            logger.error(`game with writerId '${request.params.writerId}' not found`)
            response.status(404).send({ error: `writerId not found: ${request.params.writerId}` })
        }

        const newData = applyPlayersSet(game.data, playersSet)

        game.data = newData
        game.markModified('data')

        const result = await game.save()

        const apiModel = createApiModel(result)
        apiModel.writerId = game.writerId

        response.status(200).json(apiModel)
    } catch (error) {
        next(error)
    }
})

// for reader
gamesRouter.get('/:readerId', async (request, response, next) => {
    try {
        const game = await Game.findOne({ readerId: request.params.readerId })

        if (!game) {
            logger.error(`game with readerId '${request.params.readerId}' not found`)
            response.status(404).send({ error: `readerId not found: ${request.params.readerId}` })
        }

        const apiModel = createApiModel(game)

        response.status(200).json(apiModel)
    } catch (error) {
        next(error)
    }
})

module.exports = gamesRouter
