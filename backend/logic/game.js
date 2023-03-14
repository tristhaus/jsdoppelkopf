const isString = candidate => {
    return (typeof candidate === 'string' || candidate instanceof String)
}

const validatePlayerSet = data => {
    if (!data || data.kind !== 'playersSet' || !data.playerNames || !data.dealerName || !data.sitOutScheme || !data.previousDealerName) {
        return false
    }

    if (!Array.isArray(data.playerNames) || !isString(data.dealerName) || !Array.isArray(data.sitOutScheme) || !isString(data.previousDealerName)) {
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

module.exports = { validatePlayerSet }