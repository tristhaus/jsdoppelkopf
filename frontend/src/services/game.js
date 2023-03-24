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

const addDealEntryByWriterId = async (writerId, changes, events) => {

    const postWriteDeal = `${baseUrl}/write/${writerId}/deal`

    const requestData = {
        kind: 'deal',
        events,
        changes,
    }

    const response = await axios.post(postWriteDeal, requestData)

    if (response.status === 200) {
        return response.data
    }
    else {
        console.error('game service error in getGameByWriterId', response)
        return null
    }
}

const addMandatorySoloEntryByWriterId = async writerId => {

    const postWriteMandatorySolo = `${baseUrl}/write/${writerId}/mandatorysolotrigger`

    const requestData = {
        kind: 'mandatorySoloTrigger',
    }

    const response = await axios.post(postWriteMandatorySolo, requestData)

    if (response.status === 200) {
        return response.data
    }
    else {
        console.error('game service error in getGameByWriterId', response)
        return null
    }
}

const popLastEntryOnGameByWriterId = async writerId => {

    const deleteWriteEntry = `${baseUrl}/write/${writerId}/entry`

    const response = await axios.delete(deleteWriteEntry)

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

export default {
    addDealEntryByWriterId,
    addMandatorySoloEntryByWriterId,
    getGameByReaderId,
    getGameByWriterId,
    popLastEntryOnGameByWriterId,
    startGame
}
