import axios from 'axios'
const baseUrl = import.meta.env.VITE_BACKEND_URL + '/api/game'

const getHealth = async () => {
    try {
        const getHealth = '/api/health/'

        await axios.get(getHealth)

    } catch (error) {
        console.error('error in getHealth', error)
    }
}

const startGame = async playerInformation => {
    try {
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
    catch (error) {
        console.error('error in startGame', error)
        return null
    }
}

const getGameByWriterId = async writerId => {
    try {
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
    catch (error) {
        console.error('error in getGameByWriterId', error)
        return null
    }
}

const addDealEntryByWriterId = async (writerId, changes, events) => {
    try {
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
            console.error('game service error in addDealEntryByWriterId', response)
            return null
        }
    }
    catch (error) {
        console.error('error in addDealEntryByWriterId', error)
        return null
    }
}

const addMandatorySoloEntryByWriterId = async writerId => {
    try {
        const postWriteMandatorySolo = `${baseUrl}/write/${writerId}/mandatorysolotrigger`

        const requestData = {
            kind: 'mandatorySoloTrigger',
        }

        const response = await axios.post(postWriteMandatorySolo, requestData)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.error('game service error in addMandatorySoloEntryByWriterId', response)
            return null
        }
    }
    catch (error) {
        console.error('error in addMandatorySoloEntryByWriterId', error)
        return null
    }
}

const addPlayersSetEntryByWriterId = async (writerId, playerInformation) => {
    try {
        const postWritePlayersSet = `${baseUrl}/write/${writerId}/playersset`

        const requestData = {
            kind: 'playersSet',
            ...playerInformation,
        }

        const response = await axios.post(postWritePlayersSet, requestData)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.error('game service error in addNewPlayersSetByWriterId', response)
            return null
        }
    }
    catch (error) {
        console.error('error in addPlayersSetEntryByWriterId', error)
        return null
    }
}

const popLastEntryOnGameByWriterId = async writerId => {
    try {
        const deleteWriteEntry = `${baseUrl}/write/${writerId}/entry`

        const response = await axios.delete(deleteWriteEntry)

        if (response.status === 200) {
            return response.data
        }
        else {
            console.error('game service error in popLastEntryOnGameByWriterId', response)
            return null
        }
    }
    catch (error) {
        console.error('error in popLastEntryOnGameByWriterId', error)
        return null
    }
}

const getGameByReaderId = async readerId => {
    try {
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
    catch (error) {
        console.error('error in getGameByReaderId', error)
        return null
    }
}

export default {
    addDealEntryByWriterId,
    addMandatorySoloEntryByWriterId,
    addPlayersSetEntryByWriterId,
    getGameByReaderId,
    getGameByWriterId,
    getHealth,
    popLastEntryOnGameByWriterId,
    startGame
}
