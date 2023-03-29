import { PropTypes } from 'prop-types'
import { useState } from 'react'

const deduceBock = data => {
    if (data.isMandatorySolo) { return <div className="pflichtSolo">Pflichtsolo</div> }
    if (data.bockPreview.triple > 0) { return <div className="dreifachbock">Dreifachbock</div> }
    if (data.bockPreview.double > 0) { return <div className="doppelbock">Doppelbock</div> }
    if (data.bockPreview.single > 0) { return <div className="bock">Bock</div> }
    return <div className="keinBock">Kein Bock</div>
}

const completeDiffs = (diffEntries, playerNamesInDeal) => {
    const numbers = Object.values(diffEntries).map(value => parseInt(value, 10))

    const sumOfCurrentEntries = numbers.reduce((total, number) => total + number, 0)

    const set = new Set(numbers)

    if (numbers.length === 4) {
        return sumOfCurrentEntries === 0 && set.size === 2 ? diffEntries : null
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
        if (!(name in retval)) {
            retval[name] = - sumOfCurrentEntries / numberOfMissingEntries
        }
    })

    return retval
}

const formatCents = cents => `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')}`

const CurrentGame = ({ playerData, diffEntries, handleEntryChanged }) => (
    <>
        <span>Aktuelles Spiel</span>
        {playerData.map((player, index) => {
            if (player.playing) {
                return (<input key={`${index}`} type="text" size={3} id={`currentDeal_${player.name}`} className="currentDeal" value={diffEntries[player.name] ?? ''} onChange={event => {
                    const playerName = player.name
                    handleEntryChanged(playerName, event.target.value)
                }} />)
            }
            else {
                return <span key={`${index}`} />
            }
        })}
    </>)

const ScoreControls = ({ numberOfPlayers, numberOfEvents, setNumberOfEvents, isPopDisabled, handlePopClicked, isDealDisabled, handleDealClicked }) => (
    <>
        <span style={{ gridColumn: '1 / 3', justifySelf: 'left' }}>Bockereignisse <input type="number" id="bockereignisse" min="0" value={numberOfEvents} onChange={event => setNumberOfEvents(event.target.value)} size={3} /></span>
        <button id="popButton" style={{ gridColumn: `${numberOfPlayers - 1} / ${numberOfPlayers}`, justifySelf: 'center' }} disabled={isPopDisabled} onClick={handlePopClicked}>Zurücksetzen</button>
        <button id="dealButton" style={{ gridColumn: `${numberOfPlayers + 1} / ${numberOfPlayers + 2}`, justifySelf: 'center' }} disabled={isDealDisabled} onClick={handleDealClicked}>Übernehmen</button>
    </>)

const Score = ({ isWriter, data, addDeal, addMandatorySoloTrigger, popLastEntry, }) => {

    const playerData = data.playerData

    const numberOfPlayers = playerData.length

    const gridTemplateColumns = [...Array(numberOfPlayers + 1)].map(() => 'auto').join(' ')

    const [diffEntries, setDiffEntries] = useState({})
    const [numberOfEvents, setNumberOfEvents] = useState(0)

    const isMandatorySoloDisabled = data.isMandatorySolo

    const handleMandatorySoloClicked = () => {
        addMandatorySoloTrigger()
    }

    const handleEntryChanged = (playerName, value) => {
        const newDiffEntries = { ...diffEntries }
        newDiffEntries[playerName] = value

        setDiffEntries(newDiffEntries)
    }

    const isPopDisabled = data.poppableEntry === null

    const handlePopClicked = () => {
        popLastEntry()
    }

    const diffEntriesAreValid = () => {
        const numbers = Object.values(diffEntries).map(value => parseInt(value, 10))

        if (!numbers.every(objectValue => Number.isInteger(objectValue))) {
            return false
        }

        const playerNames = playerData.filter(player => player.playing).map(player => player.name)

        const completedDiffEntries = completeDiffs(diffEntries, playerNames)

        return completedDiffEntries !== null
    }

    const isDealDisabled = !diffEntriesAreValid()

    const handleDealClicked = () => {
        const playerNames = playerData.filter(player => player.playing).map(player => player.name)
        const completedDiffEntries = completeDiffs(diffEntries, playerNames)

        const changes = Object.entries(completedDiffEntries).map(objectEntry => ({ name: objectEntry[0], diff: parseInt(objectEntry[1], 10) }))
        addDeal(changes, parseInt(numberOfEvents, 10))
        setNumberOfEvents(0)
        setDiffEntries({})
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                {isWriter && (<button className="mandatorySoloButton" disabled={isMandatorySoloDisabled} onClick={handleMandatorySoloClicked}>Pflichtsolorunde</button>)}
                <span id="currentBockStatus">{deduceBock(data)}</span>
                <table style={{ margin: '0px 15px' }}>
                    <tbody>
                        <tr>
                            <td>Dreifachbock:</td><td id="bockPreviewTriple">{data.bockPreview.triple}</td>
                        </tr>
                        <tr>
                            <td>Doppelbock:</td><td id="bockPreviewDouble">{data.bockPreview.double}</td>
                        </tr>
                        <tr>
                            <td>Bock:</td><td id="bockPreviewSingle">{data.bockPreview.single}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'grid', gap: '5px 10px', gridTemplateColumns: gridTemplateColumns, }}>
                <span>Name</span>
                {playerData.map(player => (<span key={player.name} id={`name_${player.name}`} className={data.dealerName === player.name ? 'playerNameDealer' : 'playerName'}>{player.name}</span>))}
                <span>Letztes Spiel</span>
                {playerData.map(player => (<span key={player.name} id={`lastDeal_${player.name}`} className="lastDeal">{player.lastDealDiff ?? ''}</span>))}
                {isWriter && (<CurrentGame
                    playerData={playerData}
                    diffEntries={diffEntries}
                    handleEntryChanged={handleEntryChanged}
                />)}
                {isWriter && (<ScoreControls
                    numberOfPlayers={numberOfPlayers}
                    numberOfEvents={numberOfEvents}
                    setNumberOfEvents={setNumberOfEvents}
                    isPopDisabled={isPopDisabled}
                    handlePopClicked={handlePopClicked}
                    isDealDisabled={isDealDisabled}
                    handleDealClicked={handleDealClicked}
                />)}
                <span style={{ gridColumnStart: '1', fontWeight: 'bold' }}>Spielstand</span>
                {playerData.map(player => (<span key={player.name} id={`score_${player.name}`} style={{ justifySelf: 'center', fontWeight: 'bold' }}>{player.score}</span>))}
                <span>Zu Zahlen</span>
                {playerData.map(player => {
                    const cash = formatCents(player.cents)
                    return (<span key={player.name} id={`cash_${player.name}`} style={{ justifySelf: 'center' }}>{cash}</span>)
                })}
                <span style={{ gridColumn: '1 / 3' }}>Aktueller Kassenstand</span>
                <span id="totalCash" style={{ gridColumn: `3 / ${numberOfPlayers + 2}`, justifySelf: 'center' }}>{`${formatCents(data.totalCash)} (inkl. ${formatCents(data.absentPlayerCents)} pro Abwesender)`}</span>
            </div>
        </>
    )
}

Score.displayName = 'Score'

Score.propTypes = {
    demo: PropTypes.shape({
        playerData: PropTypes.object.isRequired,
    }),
}

export { Score, completeDiffs }