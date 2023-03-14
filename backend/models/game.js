const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    readerId: String,
    writerId: String,
    dataVersion: Number,
    creationDate: Number,
    data: [mongoose.Mixed],
})

gameSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
