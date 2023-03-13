const logger = require('./logger')
const jwt = require('jsonwebtoken')

const userExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
        request.userId = null
    }
    else {
        const token = authorization.substring(7)

        if (process.env.NODE_ENV === 'test' && token === 'bypass') {
            request.userId = process.env.TEST_USERID
            return next()
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_LOGIN_SECRET)
            request.userId = decodedToken.id
        }
        catch (error) {
            logger.error('transforming to \'JsonWebTokenError\'', error)
            throw { name: 'JsonWebTokenError', message: 'problem was logged' }
        }

    }
    next()
}

const requestLogger = (request, response, next) => {
    logger.info('Method:       ', request.method)
    logger.info('Path:         ', request.path)
    const redactedBody = { ...request.body }
    if (redactedBody.password !== undefined) {
        redactedBody.password = '<redacted>'
    }
    logger.info('Redacted Body:', redactedBody)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'UniquenessError') {
        return response.status(409).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError' || error.name === 'AuthError') {
        return response.status(401).json({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

module.exports = {
    userExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler
}