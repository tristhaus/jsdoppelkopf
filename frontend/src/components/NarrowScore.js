import { PropTypes } from 'prop-types'
import { useRef, useState } from 'react'
import PlayerEntry from './PlayerEntry'
import { addPresentOrAbsent, completeDiffs, deduceBock, formatCents } from './Score'
import NarrowStatistics from './NarrowStatistics'

const PlayerLine = ({ isWriter, singlePlayerData, isDealer, handleEntryChanged, handleFocus }) => (
    <>
        <div id={`name_${singlePlayerData.name}`} className={addPresentOrAbsent(`narrow ${isDealer ? 'playerNameDealer' : 'playerName'}`, singlePlayerData)}>{singlePlayerData.name}</div>
        <div id={`lastDeal_${singlePlayerData.name}`} className={addPresentOrAbsent('narrow lastDeal', singlePlayerData)} >{singlePlayerData.lastDealDiff ?? ''}</div>
        {isWriter && (singlePlayerData.playing
            ? (<input
                type='text'
                size={3}
                id={`currentDeal_${singlePlayerData.name}`}
                className="currentDeal"
                onFocus={event => {
                    const playerName = singlePlayerData.name
                    handleFocus(playerName, event.target)
                }}
                onChange={event => {
                    const playerName = singlePlayerData.name
                    handleEntryChanged(playerName, event.target.value)
                }}
            />)
            : <div></div>)}
        <div id={`score_${singlePlayerData.name}`} className={addPresentOrAbsent('narrow score', singlePlayerData)}>{singlePlayerData.score}</div>
        <div id={`cash_${singlePlayerData.name}`} className={addPresentOrAbsent('narrow cash', singlePlayerData)}>{formatCents(singlePlayerData.cents)}</div>
    </>)

const ScoreControls = ({ numberOfEvents, setNumberOfEvents, isPopDisabled, handlePopClicked, isDealDisabled, handleDealClicked }) => (
    <>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <span style={{ justifySelf: 'left' }}>Bockereignisse <input type="number" id="bockereignisse" min="0" value={numberOfEvents} onChange={event => setNumberOfEvents(event.target.value)} size={3} /></span>
        </div>
        < div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <button className="popButton" disabled={isPopDisabled} onClick={handlePopClicked}>Zurücksetzen</button>
            <button className="dealButton" disabled={isDealDisabled} onClick={handleDealClicked}>Übernehmen</button>
        </div >
    </>)

const NarrowScore = ({ isWriter, data, scoreErrorMessage, reloadAction, addDeal, addMandatorySoloTrigger, addPlayersSet, popLastEntry, }) => {

    const gridTemplateColumns = `repeat(${(isWriter ? 5 : 4)}, auto)`

    const playerData = data.playerData

    const [message, setMessage] = useState('')
    const [showStatistics, setShowStatistics] = useState(false)
    const [showPlayerEntry, setShowPlayerEntry] = useState(false)
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
            {showStatistics && (<NarrowStatistics playerData={data.playerData} closeAction={() => setShowStatistics(false)} />)}
            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(3, auto)' }}>
                <button id="readerLinkButton" className='shareButton' onClick={shareReaderLink}>Reader-Link teilen</button>
                {isWriter && (<button id="writerLinkButton" className='shareButton' onClick={shareWriterLink}>Writer-Link teilen</button>)}
                <button id="reloadButton" className='reloadButton' onClick={reloadAction}>&#x27F3;</button>
                {isWriter && (<button className="changePlayersButton" disabled={isChangePlayersDisabled} onClick={handleChangePlayersClicked}>Spieler ausw&auml;hlen ...</button>)}
                {isWriter && (<button className="mandatorySoloButton" disabled={isMandatorySoloDisabled} onClick={handleMandatorySoloClicked}>Pflichtsolorunde</button>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
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
            <div style={{ display: 'grid', gap: '5px 10px', gridTemplateColumns: gridTemplateColumns }}>
                <span>Namen</span>
                <span style={{ justifySelf: 'right' }}>Letztes</span>
                {isWriter && (<span style={{ justifySelf: 'right' }}>Aktuell</span>)}
                <span style={{ justifySelf: 'right' }}>Stand</span>
                <span style={{ justifySelf: 'right' }}>Zu Zahlen</span>
                {playerData.map((singlePlayerData, index) =>
                    <PlayerLine
                        key={`playerLine${index}`}
                        isWriter={isWriter}
                        singlePlayerData={singlePlayerData}
                        isDealer={singlePlayerData.name === data.dealerName}
                        handleEntryChanged={handleEntryChanged}
                        handleFocus={handleFocus}
                    />)}
                {isWriter && (<ScoreControls
                    numberOfEvents={numberOfEvents}
                    setNumberOfEvents={setNumberOfEvents}
                    isPopDisabled={isPopDisabled}
                    handlePopClicked={handlePopClicked}
                    isDealDisabled={isDealDisabled}
                    handleDealClicked={handleDealClicked}
                />)}
                <span style={{ gridColumn: '1 / 3' }}>Kassenstand</span>
                <span id="totalCash" style={{ gridColumn: '3 / -1', justifySelf: 'center' }}>{`${formatCents(data.totalCash)} (inkl. ${formatCents(data.absentPlayerCents)} / Abw.)`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button id="statisticsButton" className="bottomButton" onClick={() => { setShowStatistics(true) }}>Statistiken ...</button>
            </div>
            <div className="narrow messageArea">
                {message}
            </div>
            <div className='narrow errorMessage'>
                {scoreErrorMessage ?? ''}
            </div>
        </>
    )
}

NarrowScore.displayName = 'WideScore'

NarrowScore.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default NarrowScore
