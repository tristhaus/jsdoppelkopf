require('dotenv').config()

const PORT = () => Number.parseInt(process.env.PORT || 3001)

const MONGODB_URI = () => (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI)

const DEPLOYMENT_URL = () => process.env.DEPLOYMENT_URL

const POINT_TO_CENT_NUMERATOR = () => Number.parseInt(process.env.POINT_TO_CENT_NUMERATOR || 1)
const POINT_TO_CENT_DENOMINATOR = () => Number.parseInt(process.env.POINT_TO_CENT_DENOMINATOR || 2)
const TOTAL_NUMBER_OF_PLAYERS = () => Number.parseInt(process.env.TOTAL_NUMBER_OF_PLAYERS || 8)
const USE_BOCK = () => ((process.env.USE_BOCK ?? 'false') === 'true')

module.exports = {
    PORT,
    MONGODB_URI,
    DEPLOYMENT_URL,
    POINT_TO_CENT_NUMERATOR,
    POINT_TO_CENT_DENOMINATOR,
    TOTAL_NUMBER_OF_PLAYERS,
    USE_BOCK,
}
