const lodash = require('lodash')

const isString = candidate => {
    return (typeof candidate === 'string' || candidate instanceof String)
}

const determineDealer = data => {
    const relevantPlayersSetIndex = lodash.findLastIndex(data, entry => entry.kind === 'playersSet')
    const relevantPlayersSet = data[relevantPlayersSetIndex]
    const firstDealerName = relevantPlayersSet.dealerName
    const firstDealerIndex = relevantPlayersSet.playerNames.indexOf(firstDealerName)

    const dealsSinceThen = data.slice(relevantPlayersSetIndex).filter(entry => entry.kind === 'deal').length
    const numberOfPresentPlayers = relevantPlayersSet.playerNames.length

    const currentDealerIndex = (firstDealerIndex + dealsSinceThen) % numberOfPresentPlayers

    return relevantPlayersSet.playerNames[currentDealerIndex]
}

const calculatePlayerData = data => {

    const relevantPlayersSetIndex = lodash.findLastIndex(data, entry => entry.kind === 'playersSet')
    const relevantPlayersSet = data[relevantPlayersSetIndex]
    const numberOfPresentPlayers = relevantPlayersSet.playerNames.length
    const dealerName = determineDealer(data)
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

    allPlayers.forEach(player => player.score = 0)

    data.forEach(entry => {
        if (entry.kind === 'deal') {
            entry.changes.forEach(change => {
                allPlayers.find(player => player.name === change.name).score += change.diff
            })
        }
    })

    return allPlayers
}

const validatePlayerSet = playersSet => {
    if (!playersSet || playersSet.kind !== 'playersSet' || !playersSet.playerNames || !playersSet.dealerName || !playersSet.sitOutScheme) {
        return false
    }

    if (!Array.isArray(playersSet.playerNames) || !isString(playersSet.dealerName) || !Array.isArray(playersSet.sitOutScheme)) {
        return false
    }

    const numberOfPlayers = playersSet.playerNames.length

    if (numberOfPlayers < 4 || numberOfPlayers > 7) {
        return false
    }

    if (playersSet.playerNames.some(playerName => !isString(playerName))) {
        return false
    }

    if (playersSet.sitOutScheme.some(member => !Number.isInteger(member))) {
        return false
    }

    // with 5 or more players, dealer always sits out
    const expectedSitOutSchemeLength = Math.max(0, numberOfPlayers - 5)

    if (playersSet.sitOutScheme.length !== expectedSitOutSchemeLength) {
        return false
    }

    if (playersSet.sitOutScheme.some(member => member < 0 || member >= numberOfPlayers)) {
        return false
    }

    if ([...new Set(playersSet.sitOutScheme)].length !== playersSet.sitOutScheme.length) {
        return false
    }

    const playerNamesSet = new Set(playersSet.playerNames)

    if ([...playerNamesSet].length !== numberOfPlayers) {
        return false
    }

    if (!playerNamesSet.has(playersSet.dealerName)) {
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

const validateDeal = (data, deal) => {

    if (!deal || deal.kind !== 'deal' || !deal.changes) {
        return false
    }

    if (!Array.isArray(deal.changes) || deal.changes.length !== 4 || !deal.changes.every(element => element.name && isString(element.name) && Number.isInteger(element.diff))) {
        return false
    }

    if (deal.changes.map(change => change.diff).reduce((accumulator, currentValue) => accumulator + currentValue, 0) !== 0) {
        return false
    }

    const playerNamesSet = new Set(deal.changes.map(change => change.name))

    if ([...playerNamesSet].length !== deal.changes.length) {
        return false
    }

    const oldPlayerData = calculatePlayerData(data)
    const activePlayerNames = oldPlayerData.filter(player => player.playing).map(player => player.name)

    if (!deal.changes.map(change => change.name).every(name => activePlayerNames.includes(name))) {
        return false
    }

    return true
}

const applyDeal = (data, deal) => {
    return [...data, deal]
}

module.exports = {
    determineDealer,
    validatePlayerSet,
    applyPlayersSet,
    validateDeal,
    applyDeal,
    calculatePlayerData,
}
