const lodash = require('lodash')

const isString = candidate => {
    return (typeof candidate === 'string' || candidate instanceof String)
}

const determineDealer = data => {
    // STOPGAP: this logic is only true as long as we have no 'deal' entries
    return lodash.findLast(data, entry => entry.kind === 'playersSet').dealerName
}

const calculatePlayerData = data => {

    const relevantPlayersSetIndex = lodash.findLastIndex(data, entry => entry.kind === 'playersSet')
    const relevantPlayersSet = data[relevantPlayersSetIndex]
    const numberOfPresentPlayers = relevantPlayersSet.playerNames.length
    const dealerName = relevantPlayersSet.dealerName
    const dealerIndex = lodash.indexOf(relevantPlayersSet.playerNames, dealerName)

    const presentPlayers = relevantPlayersSet
        .playerNames
        .map(name => { return { name, present: true, playing: true } })

    if (relevantPlayersSet.playerNames.length > 4) {
        presentPlayers[dealerIndex].playing = false

        relevantPlayersSet.sitOutScheme.forEach(element => {
            presentPlayers[(dealerIndex + element) % numberOfPresentPlayers].playing = false
        })
    }

    const absentPlayers = data
        .filter(entry => entry.kind === 'playersSet')
        .flatMap(playersSet => playersSet.playerNames)
        .filter(name => !presentPlayers.some(presentPlayer => presentPlayer.name === name))
        .map(name => { return { name, present: false, playing: false } })


    const allPlayers = [...presentPlayers, ...absentPlayers]

    return allPlayers
}

const validatePlayerSet = data => {
    if (!data || data.kind !== 'playersSet' || !data.playerNames || !data.dealerName || !data.sitOutScheme) {
        return false
    }

    if (!Array.isArray(data.playerNames) || !isString(data.dealerName) || !Array.isArray(data.sitOutScheme)) {
        return false
    }

    const numberOfPlayers = data.playerNames.length

    if (numberOfPlayers < 4 || numberOfPlayers > 7) {
        return false
    }

    if (data.playerNames.some(playerName => !isString(playerName))) {
        return false
    }

    if (data.sitOutScheme.some(member => !Number.isInteger(member))) {
        return false
    }

    // with 5 or more players, dealer always sits out
    const expectedSitOutSchemeLength = Math.max(0, numberOfPlayers - 5)

    if (data.sitOutScheme.length !== expectedSitOutSchemeLength) {
        return false
    }

    if (data.sitOutScheme.some(member => member < 0 || member >= numberOfPlayers)) {
        return false
    }

    if ([...new Set(data.sitOutScheme)].length !== data.sitOutScheme.length) {
        return false
    }

    const playerNamesSet = new Set(data.playerNames)

    if ([...playerNamesSet].length !== numberOfPlayers) {
        return false
    }

    if (!playerNamesSet.has(data.dealerName)) {
        return false
    }

    return true
}

const applyPlayersSet = (data, playersSet) => {

    if (data.length === 1) {
        return [{ previousDealerName: playersSet.dealerName, ...playersSet }]
    }

    return [...data, { previousDealerName: determineDealer(data), ...playersSet }]
}

module.exports = {
    validatePlayerSet,
    applyPlayersSet,
    determineDealer,
    calculatePlayerData,
}
