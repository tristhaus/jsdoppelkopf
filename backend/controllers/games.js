const gamesRouter = require('express').Router()
const Game = require('../models/game')
const logger = require('../utils/logger')
const config = require('../utils/config')
const { applyDeal, applyMandatorySoloTrigger, applyPlayersSet, calculatePlayerData, validateDeal, validateMandatorySoloTrigger, validatePlayerSet, } = require('../logic/game')

const dataVersion = 1

const letters = 'QWERTZUIOPASDFGHJKLYXCVBNM'

const getRandomLetter = () => {
    const index = Math.floor(Math.random() * 26)
    return letters[index]
}

const generateId = isWriter => {
    return (isWriter ? 'W' : 'R') + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter()
}

const createApiModel = game => {

    const data = calculatePlayerData(game.data)

    return {
        deploymentUrl: `${config.DEPLOYMENT_URL()}`,
        useBock: config.USE_BOCK(),
        readerId: game.readerId,
        creationDate: game.creationDate,
        poppableEntry: game.data.length > 1 ? game.data[game.data.length - 1].kind : null,
        ...data
    }
}

gamesRouter.post('/', async (request, response, next) => {
    try {
        const playersSet = request.body

        if (!validatePlayerSet([], playersSet)) {
            throw { name: 'ValidationError', message: 'invalid playersSet' }
        }

        const writerId = generateId(true)
        const readerId = generateId(false)

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
    }
    catch (error) {
        return next(error)
    }
})

// for writer
gamesRouter.get('/write/:writerId', async (request, response, next) => {
    try {
        const game = await Game.findOne({ writerId: request.params.writerId })

        if (!game) {
            logger.error(`game with writerId '${request.params.writerId}' not found`)
            response.status(404).send({ error: `writerId not found: ${request.params.writerId}` })
            return next()
        }

        const apiModel = createApiModel(game)
        apiModel.writerId = game.writerId

        response.status(200).json(apiModel)
    }
    catch (error) {
        return next(error)
    }
})

gamesRouter.post('/write/:writerId/playersset', async (request, response, next) => {
    try {

        const game = await Game.findOne({ writerId: request.params.writerId })

        if (!game) {
            logger.error(`game with writerId '${request.params.writerId}' not found`)
            response.status(404).send({ error: `writerId not found: ${request.params.writerId}` })
            return next()
        }

        const playersSet = request.body

        if (!validatePlayerSet(game.data, playersSet)) {
            throw { name: 'ValidationError', message: 'invalid playersSet' }
        }

        const newData = applyPlayersSet(game.data, playersSet)

        game.data = newData
        game.markModified('data')

        const result = await game.save()

        const apiModel = createApiModel(result)
        apiModel.writerId = game.writerId

        response.status(200).json(apiModel)
    }
    catch (error) {
        return next(error)
    }
})

gamesRouter.post('/write/:writerId/deal', async (request, response, next) => {
    try {
        const game = await Game.findOne({ writerId: request.params.writerId })

        if (!game) {
            logger.error(`game with writerId '${request.params.writerId}' not found`)
            response.status(404).send({ error: `writerId not found: ${request.params.writerId}` })
            return next()
        }

        const deal = request.body

        if (!validateDeal(game.data, deal)) {
            throw { name: 'ValidationError', message: 'invalid deal' }
        }

        const newData = applyDeal(game.data, deal)

        game.data = newData
        game.markModified('data')

        const result = await game.save()

        const apiModel = createApiModel(result)
        apiModel.writerId = game.writerId

        response.status(200).json(apiModel)
    }
    catch (error) {
        return next(error)
    }
})

gamesRouter.post('/write/:writerId/mandatorysolotrigger', async (request, response, next) => {
    try {
        const game = await Game.findOne({ writerId: request.params.writerId })

        if (!game) {
            logger.error(`game with writerId '${request.params.writerId}' not found`)
            response.status(404).send({ error: `writerId not found: ${request.params.writerId}` })
            return next()
        }

        const mandatorySoloTrigger = request.body

        if (!validateMandatorySoloTrigger(game.data, mandatorySoloTrigger)) {
            throw { name: 'ValidationError', message: 'invalid deal' }
        }

        const newData = applyMandatorySoloTrigger(game.data, mandatorySoloTrigger)

        game.data = newData
        game.markModified('data')

        const result = await game.save()

        const apiModel = createApiModel(result)
        apiModel.writerId = game.writerId

        response.status(200).json(apiModel)
    }
    catch (error) {
        return next(error)
    }
})

gamesRouter.delete('/write/:writerId/entry', async (request, response, next) => {
    try {
        const game = await Game.findOne({ writerId: request.params.writerId })

        if (!game) {
            logger.error(`game with writerId '${request.params.writerId}' not found`)
            response.status(404).send({ error: `writerId not found: ${request.params.writerId}` })
            return next()
        }

        if (game.data.length === 1) {
            logger.error(`unable to pop entry on game with writerId '${request.params.writerId}'`)
            response.status(400).send({ error: 'unable to pop entry' })
            return next()
        }

        const newData = game.data.slice(0, -1)

        game.data = newData
        game.markModified('data')

        const result = await game.save()

        const apiModel = createApiModel(result)
        apiModel.writerId = game.writerId

        response.status(200).json(apiModel)
    }
    catch (error) {
        return next(error)
    }
})

// for reader
gamesRouter.get('/:readerId', async (request, response, next) => {
    try {
        const game = await Game.findOne({ readerId: request.params.readerId })

        if (!game) {
            logger.error(`game with readerId '${request.params.readerId}' not found`)
            response.status(404).send({ error: `readerId not found: ${request.params.readerId}` })
            return next()
        }

        const apiModel = createApiModel(game)

        response.status(200).json(apiModel)
    }
    catch (error) {
        return next(error)
    }
})

module.exports = gamesRouter
