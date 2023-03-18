require('dotenv').config()

const PORT = process.env.PORT || 3001

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const POINT_TO_CENT_NUMERATOR = process.env.POINT_TO_CENT_NUMERATOR || 1
const POINT_TO_CENT_DENOMINATOR = process.env.POINT_TO_CENT_DENOMINATOR || 2

module.exports = {
    PORT,
    MONGODB_URI,
    POINT_TO_CENT_NUMERATOR,
    POINT_TO_CENT_DENOMINATOR,
}
