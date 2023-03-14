const path = require('node:path')
const config = require('./utils/config')
const logger = require('./utils/logger')
const gamesRouter = require('./controllers/games')
const middleware = require('./utils/middleware')

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/game', gamesRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use('/static', express.static(path.join(__dirname, './build/static')))
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, './build') })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const mongoose = require('mongoose')
mongoose.connect(config.MONGODB_URI)
    .then(() => { logger.info('connected to MongoDB') })
    .catch(error => { logger.error('error connecting to MongoDB:', error.message) })

module.exports = app
