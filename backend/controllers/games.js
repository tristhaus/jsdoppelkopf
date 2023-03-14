const gamesRouter = require('express').Router()
const Game = require('../models/game')

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

module.exports = gamesRouter
