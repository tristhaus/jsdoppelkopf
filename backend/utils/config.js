require('dotenv').config()

const PORT = process.env.PORT || 3001

const MONGODB_URI = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL

const POINT_TO_CENT_NUMERATOR = process.env.POINT_TO_CENT_NUMERATOR || 1
const POINT_TO_CENT_DENOMINATOR = process.env.POINT_TO_CENT_DENOMINATOR || 2
const TOTAL_NUMBER_OF_PLAYERS = process.env.TOTAL_NUMBER_OF_PLAYERS || 8

module.exports = {
    PORT,
    MONGODB_URI,
    DEPLOYMENT_URL,
    POINT_TO_CENT_NUMERATOR,
    POINT_TO_CENT_DENOMINATOR,
    TOTAL_NUMBER_OF_PLAYERS,
}
