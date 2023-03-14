const gamesRouter = require('express').Router()
const Game = require('../models/game')
const logger = require('../utils/logger')

const dataVersion = 1

const letters = 'qwertzuiopasdfghjklyxcvbnm'

const getRandomLetter = () => {
    const index = Math.floor(Math.random() * 26)
    return letters[index]
}

const generateId = () => {
    return getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter()
}

gamesRouter.post('/', async (request, response, next) => {
    try {
        const readerId = generateId()
        const writerId = generateId()

        const game = new Game(
            {
                readerId,
                writerId,
                dataVersion,
                creationDate: Date.now()
            })

        const result = await game.save()

        const apiModel = {
            'readerId': result.readerId,
            'writerId': result.writerId,
        }

        response.status(201).json(apiModel)
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

        const apiModel = {
            'readerId': game.readerId,
        }

        response.status(200).json(apiModel)
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

        const apiModel = {
            'readerId': game.readerId,
            'writerId': game.writerId,
        }

        response.status(200).json(apiModel)
    } catch (error) {
        next(error)
    }
})

module.exports = gamesRouter
