import axios from 'axios'
const baseUrl = '/api/game'

const startGame = async playerInformation => {

    const playersSet = {
        kind: 'playersSet',
        ...playerInformation,
    }

    const response = await axios.post(baseUrl, playersSet)

    if (response.status === 201) {
        return response.data
    }
    else {
        console.error('game service error in startGame', response)
        return null
    }
}

const getGameByWriterId = async writerId => {

    const getWrite = `${baseUrl}/write/${writerId}`

    const response = await axios.get(getWrite)

    if (response.status === 200) {
        return response.data
    }
    else {
        console.error('game service error in getGameByWriterId', response)
        return null
    }
}

const getGameByReaderId = async readerId => {

    const getRead = `${baseUrl}/${readerId}`

    const response = await axios.get(getRead)

    if (response.status === 200) {
        return response.data
    }
    else {
        console.error('game service error in getGameByReaderId', response)
        return null
    }
}

export default { getGameByReaderId, getGameByWriterId, startGame }
