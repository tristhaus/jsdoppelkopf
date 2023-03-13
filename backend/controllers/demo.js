const demoRouter = require('express').Router()

demoRouter.get('/', async (request, response, next) => {
    try {
        const data = { answer: 42 }
        response.json(data)
    } catch (error) {
        next(error)
    }
})

module.exports = demoRouter
