const path = require('node:path')
const config = require('./utils/config')
const logger = require('./utils/logger')
const healthRouter = require('./controllers/health')
const gamesRouter = require('./controllers/games')
const middleware = require('./utils/middleware')

const express = require('express')
const app = express()
const cors = require('cors')

app.set('etag', false)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/health', healthRouter)
app.use('/api/game', gamesRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use('/assets', express.static(path.join(__dirname, './build/assets')))
app.use('/banners', express.static(path.join(__dirname, './build/banners')))

const resources = [
    'datenschutz.html',
    'robots.txt',
    'favicon.ico',
    'logo192.png',
    'index.html',
    'logo512.png',
    'manifest.json',
]

resources.forEach(resource => {
    app.get(`/${resource}`, (req, res) => {
        res.sendFile(resource, { root: path.join(__dirname, './build') })
    })
})

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, './build') })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(config.MONGODB_URI())
    .then(() => { logger.info('connected to MongoDB') })
    .catch(error => { logger.error('error connecting to MongoDB:', error.message) })

module.exports = app
