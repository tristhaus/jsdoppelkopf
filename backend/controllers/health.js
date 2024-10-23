const healthRouter = require('express').Router()

const responseData = {
    healthy: 'yes'
}

healthRouter.get('/', (request, response) => {
    response.status(200).json(responseData)
})

module.exports = healthRouter
