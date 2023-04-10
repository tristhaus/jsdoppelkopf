const deduceBock = data => {
    if (data.isMandatorySolo) { return <div className="pflichtSolo">Pflichtsolo</div> }
    if (data.bockPreview.triple > 0) { return <div className="dreifachbock">Dreifachbock</div> }
    if (data.bockPreview.double > 0) { return <div className="doppelbock">Doppelbock</div> }
    if (data.bockPreview.single > 0) { return <div className="bock">Bock</div> }
    return <div className="keinBock">Kein Bock</div>
}

const completeDiffs = (diffEntries, playerNamesInDeal) => {
    const numbers = Object.values(diffEntries).filter(value => !!value).map(value => parseInt(value, 10))

    const sumOfCurrentEntries = numbers.reduce((total, number) => total + number, 0)

    const set = new Set(numbers)

    if (numbers.length === 4) {
        return sumOfCurrentEntries === 0 && (set.size === 2 || (set.size === 1 && set.has(0))) ? diffEntries : null
    }

    if (set.size !== 1) {
        return null
    }

    const numberOfMissingEntries = 4 - numbers.length

    if ((sumOfCurrentEntries % numberOfMissingEntries) !== 0) {
        return null
    }

    const retval = { ...diffEntries }

    playerNamesInDeal.forEach(name => {
        if (!(name in retval) || !retval[name]) {
            retval[name] = - sumOfCurrentEntries / numberOfMissingEntries
        }
    })

    return retval
}

const formatCents = cents => `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')}`

const addPresentOrAbsent = (classString, player) => {
    return `${classString} ${player.present ? 'isPresent' : 'isAbsent'}`
}

export { addPresentOrAbsent, completeDiffs, deduceBock, formatCents }