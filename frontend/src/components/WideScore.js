import { PropTypes } from 'prop-types'
import { useRef, useState } from 'react'
import PlayerEntry from './PlayerEntry'
import { addPresentOrAbsent, completeDiffs, deduceBock, formatCents } from './Score'
import WideStatistics from './WideStatistics'
import WidePlot from './WidePlot'

const CurrentGame = ({ playerData, diffEntries, handleFocus, handleEntryChanged }) => (
    <>
        <span>Aktuelles Spiel</span>
        {playerData.map((player, index) => {
            if (player.playing) {
                return (
                    <input
                        key={`${index}`}
                        type="text"
                        size={3}
                        id={`currentDeal_${player.name}`}
                        className="currentDeal"
                        value={diffEntries[player.name] ?? ''}
                        onFocus={event => {
                            const playerName = player.name
                            handleFocus(playerName, event.target)
                        }}
                        onChange={event => {
                            const playerName = player.name
                            handleEntryChanged(playerName, event.target.value)
                        }}
                    />)
            }
            else {
                return <span key={`${index}`} />
            }
        })}
    </>)

const ScoreControls = ({ data, numberOfEvents, setNumberOfEvents, isPopDisabled, handlePopClicked, isDealDisabled, handleDealClicked }) => {
    const visibility = data.useBock ? 'visible' : 'hidden'
    return (
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span style={{ visibility: visibility, justifySelf: 'left' }}>Bockereignisse <input type="number" id="bockereignisse" min="0" value={numberOfEvents} onChange={event => setNumberOfEvents(event.target.value)} size={3} /></span>
            <span>
                <button className="popButton" disabled={isPopDisabled} onClick={handlePopClicked}>Zurücksetzen</button>
                <button className="dealButton" disabled={isDealDisabled} onClick={handleDealClicked}>Übernehmen</button>
            </span>
        </div>)
}

const BockDisplay = ({ data }) => (<>
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
    </table></>)

const WideScore = ({ isWriter, data, scoreErrorMessage, addDeal, addMandatorySoloTrigger, addPlayersSet, popLastEntry, reloadAction, }) => {

    const playerData = data.playerData
    const useBock = data.useBock

    const numberOfPlayers = playerData.length

    const gridTemplateColumns = `repeat(${(numberOfPlayers + 1)}, auto)`

    const [message, setMessage] = useState('')
    const [showPlayerEntry, setShowPlayerEntry] = useState(false)
    const [showStatistics, setShowStatistics] = useState(false)
    const [showPlot, setShowPlot] = useState(false)
    const [diffEntries, setDiffEntries] = useState({})
    const [numberOfEvents, setNumberOfEvents] = useState(0)

    const timeOut = useRef(null)

    const setTemporaryMessage = message => {
        setMessage(message)
        clearTimeout(timeOut.current)
        timeOut.current = setTimeout(() => {
            setMessage('')
        }, 5000)
    }

    const shareReaderLink = () => {
        navigator.clipboard.writeText(`${data.deploymentUrl}/${data.readerId}`)
        setTemporaryMessage('Reader-Link in Zwischenablage kopiert')
    }

    const shareWriterLink = () => {
        navigator.clipboard.writeText(`${data.deploymentUrl}/writer/${data.writerId}`)
        setTemporaryMessage('Writer-Link in Zwischenablage kopiert')
    }

    const isChangePlayersDisabled = data.isMandatorySolo

    const handleChangePlayersClicked = () => {
        setShowPlayerEntry(true)
    }

    const submitNewPlayersAction = playerInformation => {
        addPlayersSet(playerInformation)
        setShowPlayerEntry(false)
    }

    const isMandatorySoloDisabled = data.isMandatorySolo

    const handleMandatorySoloClicked = () => {
        addMandatorySoloTrigger()
    }

    const changeEntry = (playerName, value) => {
        const newDiffEntries = { ...diffEntries }
        newDiffEntries[playerName] = value

        setDiffEntries(newDiffEntries)
    }

    const handleEntryChanged = (playerName, value) => {
        changeEntry(playerName, value)
    }

    const handleFocus = (playerName, target) => {
        const relevantEntries = Object.values(diffEntries)
            .filter(entry => entry !== '')
            .sort()
            .filter((entry, index, array) => index === 0 || entry !== array[index - 1])

        if (relevantEntries.length === 1) {
            target.value = relevantEntries[0]
            changeEntry(playerName, relevantEntries[0])
        }
    }

    const isPopDisabled = data.poppableEntry === null

    const handlePopClicked = () => {
        const mapPoppableEntry = poppableEntry => {
            switch (poppableEntry) {
                case 'deal':
                    return 'Letztes Spiel'
                case 'mandatorySoloTrigger':
                    return 'Letzte Pflichtsolorunde'
                case 'playersSet':
                    return 'Letzte Auswahl der Spieler'
            }
        }

        const result = confirm(`${mapPoppableEntry(data.poppableEntry)} rückgängig machen?`)
        if (result) {
            popLastEntry()
        }
    }

    const diffEntriesAreValid = () => {
        const numbers = Object.values(diffEntries).filter(value => !!value).map(value => parseInt(value, 10))

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
            {showPlayerEntry && (<PlayerEntry playerInformation={{ dealerName: data.dealerName, playerData: data.playerData, }} closeAction={() => setShowPlayerEntry(false)} submitAction={submitNewPlayersAction} />)}
            {showStatistics && (<WideStatistics data={data} closeAction={() => setShowStatistics(false)} />)}
            {showPlot && (<WidePlot playerData={data.playerData} closeAction={() => setShowPlot(false)} />)}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                    <button id="readerLinkButton" className='shareButton' onClick={shareReaderLink}>Reader-Link teilen</button>
                    {isWriter && (<button id="writerLinkButton" className='shareButton' onClick={shareWriterLink}>Writer-Link teilen</button>)}
                    <span>{message}</span>
                    <span className='errorMessage'>{scoreErrorMessage ?? ''}</span>
                </span>
                <button id="reloadButton" className='reloadButton' onClick={reloadAction}>&#x27F3;</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                {isWriter && (<button className="changePlayersButton" disabled={isChangePlayersDisabled} onClick={handleChangePlayersClicked}>Spieler ausw&auml;hlen ...</button>)}
                {isWriter && useBock && (<button className="mandatorySoloButton" disabled={isMandatorySoloDisabled} onClick={handleMandatorySoloClicked}>Pflichtsolorunde</button>)}
                {useBock && <BockDisplay data={data} />}
            </div>
            <div style={{ display: 'grid', gap: '5px 10px', gridTemplateColumns: gridTemplateColumns, }}>
                <span>Name</span>
                {playerData.map(player => (<span key={player.name} id={`name_${player.name}`} className={addPresentOrAbsent(data.dealerName === player.name ? 'playerNameDealer' : 'playerName', player)}>{player.name}</span>))}
                <span>Letztes Spiel</span>
                {playerData.map(player => (<span key={player.name} id={`lastDeal_${player.name}`} className={addPresentOrAbsent('lastDeal', player)}>{player.lastDealDiff ?? ''}</span>))}
                {isWriter && (<CurrentGame
                    playerData={playerData}
                    diffEntries={diffEntries}
                    handleFocus={handleFocus}
                    handleEntryChanged={handleEntryChanged}
                />)}
                {isWriter && (<ScoreControls
                    data={data}
                    numberOfEvents={numberOfEvents}
                    setNumberOfEvents={setNumberOfEvents}
                    isPopDisabled={isPopDisabled}
                    handlePopClicked={handlePopClicked}
                    isDealDisabled={isDealDisabled}
                    handleDealClicked={handleDealClicked}
                />)}
                <span style={{ gridColumnStart: '1' }} className="scoreLabel">Spielstand</span>
                {playerData.map(player => (<span key={player.name} id={`score_${player.name}`} className={addPresentOrAbsent('score', player)}>{player.score}</span>))}
                <span>Zu Zahlen</span>
                {playerData.map(player => {
                    const cash = formatCents(player.cents)
                    return (<span key={player.name} id={`cash_${player.name}`} className={addPresentOrAbsent('cash', player)}>{cash}</span>)
                })}
                <span style={{ gridColumn: '1 / 3' }}>Aktueller Kassenstand</span>
                <span id="totalCash" style={{ gridColumn: '3 / -1', justifySelf: 'center' }}>{`${formatCents(data.totalCash)} (inkl. ${formatCents(data.absentPlayerCents)} pro Abwesender)`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button id="statisticsButton" className="bottomButton" onClick={() => { setShowStatistics(true) }}>Statistiken ...</button>
                <button id="plotButton" className="bottomButton" onClick={() => { setShowPlot(true) }}>Graph ...</button>
            </div>
        </>
    )
}

WideScore.displayName = 'WideScore'

WideScore.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default WideScore
