const lodash = require('lodash')
const config = require('../utils/config')

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

const constructBockHelper = data => {

    const maximumAllowedBock = 3

    let gameIndex = 0
    let numberOfPresentPlayers = 0
    const bockHelper = []

    data.forEach(entry => {

        if (entry.kind === 'deal') {
            for (let event = 0; event < entry.events; event++) {

                let endIndexOfThisBock = gameIndex + 1 + numberOfPresentPlayers

                for (let i = gameIndex + 1; i < endIndexOfThisBock; i++) {

                    if ((bockHelper[i] ?? 0) < maximumAllowedBock) {
                        bockHelper[i] = (bockHelper[i] ?? 0) + 1
                    }
                    else {
                        endIndexOfThisBock++
                    }
                }
            }

            gameIndex++
        }
        else if (entry.kind === 'playersSet') {
            numberOfPresentPlayers = entry.playerNames.length
        }
        else if (entry.kind === 'mandatorySoloTrigger') {
            const mandatorySoloRound = Array(numberOfPresentPlayers)
            mandatorySoloRound.fill(0)
            bockHelper.splice(gameIndex, 0, ...mandatorySoloRound)
        }
    })

    return bockHelper
}

const getMultiplier = (bockHelper, gameIndex) => {
    switch (bockHelper[gameIndex]) {
        default:
            return 1
        case 1:
            return 2
        case 2:
            return 4
        case 3:
            return 8
    }
}

const createBockPreview = (bockHelper, currentGameIndex) => {

    const preview = {
        single: 0,
        double: 0,
        triple: 0,
    }

    const future = bockHelper.slice(currentGameIndex)

    for (const value of future) {
        switch (value) {
            case 1:
                preview.single++
                break
            case 2:
                preview.double++
                break
            case 3:
                preview.triple++
                break
        }
    }

    return preview
}

const isMandatorySolo = data => {
    const relevantPlayersSetIndex = lodash.findLastIndex(data, entry => entry.kind === 'playersSet')

    if (relevantPlayersSetIndex === -1) {
        return false
    }

    const relevantPlayersSet = data[relevantPlayersSetIndex]
    const numberOfPresentPlayers = relevantPlayersSet.playerNames.length

    const relevantRecentEntries = data.slice(-numberOfPresentPlayers)

    return relevantRecentEntries.some(entry => entry.kind === 'mandatorySoloTrigger')
}

const pointDifferenceToCents = difference => {
    return Number(BigInt.asIntN(64, BigInt(difference) * BigInt(config.POINT_TO_CENT_NUMERATOR) / BigInt(config.POINT_TO_CENT_DENOMINATOR)))
}

const calculatePlayerData = data => {

    const relevantPlayersSetIndex = lodash.findLastIndex(data, entry => entry.kind === 'playersSet')
    const relevantPlayersSet = data[relevantPlayersSetIndex]
    const numberOfPresentPlayers = relevantPlayersSet.playerNames.length
    const dealerName = determineDealer(data)
    const dealerIndex = lodash.indexOf(relevantPlayersSet.playerNames, dealerName)

    const presentPlayers = relevantPlayersSet
        .playerNames
        .map(name => { return { name, present: true, playing: true, lastDealDiff: null } })

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
        .sort()
        .filter((name, index, array) => index === 0 || name !== array[index - 1]) // remove duplicates
        .map(name => { return { name, present: false, playing: false, lastDealDiff: null } })

    const allPlayers = [...presentPlayers, ...absentPlayers]

    const bockHelper = constructBockHelper(data)

    allPlayers.forEach(player => player.score = 0)

    let gameIndex = 0

    data.forEach(entry => {
        if (entry.kind === 'deal') {
            const multiplier = getMultiplier(bockHelper, gameIndex)

            entry.changes.forEach(change => {
                allPlayers.find(player => player.name === change.name).score += change.diff * multiplier
            })

            gameIndex++
        }
    })

    const mostRecentDeal = lodash.findLast(data, entry => entry.kind === 'deal')

    if (mostRecentDeal) {
        mostRecentDeal.changes.forEach(change => {
            const player = allPlayers.find(player => player.name === change.name)
            player.lastDealDiff = change.diff
        })
    }

    const bockPreview = createBockPreview(bockHelper, gameIndex)

    const leaderScore = Math.max(...allPlayers.map(player => player.score))

    allPlayers.forEach(player => {
        player.cents = pointDifferenceToCents(leaderScore - player.score)
    })

    const numberOfAbsentPlayers = config.TOTAL_NUMBER_OF_PLAYERS - allPlayers.length

    const absentPlayerCents = numberOfAbsentPlayers > 0 ? pointDifferenceToCents(leaderScore - 0) : null

    const totalCash = allPlayers.reduce((total, player) => total + player.cents, 0) + (absentPlayerCents ?? 0) * numberOfAbsentPlayers

    return {
        playerData: allPlayers,
        dealerName,
        bockPreview,
        isMandatorySolo: isMandatorySolo(data),
        totalCash,
        absentPlayerCents,
    }
}

const validatePlayerSet = (data, playersSet) => {
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

    if (playerNamesSet.size !== numberOfPlayers) {
        return false
    }

    if (!playerNamesSet.has(playersSet.dealerName)) {
        return false
    }

    if (isMandatorySolo(data)) {
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

    if (!deal || deal.kind !== 'deal' || !deal.changes || !Object.prototype.hasOwnProperty.call(deal, 'events') || !Number.isInteger(deal.events) || deal.events < 0) {
        return false
    }

    if (!Array.isArray(deal.changes) || deal.changes.length !== 4 || !deal.changes.every(element => element.name && isString(element.name) && Number.isInteger(element.diff))) {
        return false
    }

    if (deal.changes.map(change => change.diff).reduce((accumulator, currentValue) => accumulator + currentValue, 0) !== 0) {
        return false
    }

    const set = new Set(deal.changes.map(change => change.diff))

    if ((set.size !== 2 && !(set.size === 1 && set.has(0)))) {
        return false
    }

    const playerNamesSet = new Set(deal.changes.map(change => change.name))

    if ([...playerNamesSet].length !== deal.changes.length) {
        return false
    }

    const oldData = calculatePlayerData(data)
    const activePlayerNames = oldData.playerData.filter(player => player.playing).map(player => player.name)

    if (!deal.changes.map(change => change.name).every(name => activePlayerNames.includes(name))) {
        return false
    }

    return true
}

const applyDeal = (data, deal) => {
    return [...data, deal]
}

const validateMandatorySoloTrigger = (data, mandatorySoloTrigger) => {

    if (!mandatorySoloTrigger || mandatorySoloTrigger.kind !== 'mandatorySoloTrigger') {
        return false
    }

    if (isMandatorySolo(data)) {
        return false
    }

    return true
}

const applyMandatorySoloTrigger = (data, mandatorySoloTrigger) => {
    return [...data, mandatorySoloTrigger]
}

module.exports = {
    applyDeal,
    applyMandatorySoloTrigger,
    applyPlayersSet,
    calculatePlayerData,
    createBockPreview,
    constructBockHelper,
    determineDealer,
    getMultiplier,
    pointDifferenceToCents,
    validateDeal,
    validateMandatorySoloTrigger,
    validatePlayerSet,
}
