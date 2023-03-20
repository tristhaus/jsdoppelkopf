import axios from 'axios'
const baseUrl = '/api/game'

const startGame = async () => {

    const playersSet = {
        kind: 'playersSet',
        playerNames: [
            'Player A',
            'Player B',
            'Player C',
            'Player D',
            'Player E',
            'Player F',
            'Player G'
        ],
        dealerName: 'Player C',
        sitOutScheme: [
            2,
            4
        ]
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
