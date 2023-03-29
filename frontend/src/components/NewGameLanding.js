import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import gameService from '../services/game'
import PlayerEntry from './PlayerEntry'

const NewGameLanding = () => {
    const [showPlayerEntry, setShowPlayerEntry] = useState(false)

    const [readerId, setReaderId] = useState(null)
    const [writerId, setWriterId] = useState(null)
    const [inputReaderId, setInputReaderId] = useState('')
    const [inputWriterId, setInputWriterId] = useState('')

    const handleNewGameClick = async playerInformation => {
        setWriterId(null)

        const response = await gameService.startGame(playerInformation)

        if (response) {
            setWriterId(response.writerId)
        }
    }

    const handleReaderIdChange = event => {
        setInputReaderId(event.target.value)
    }

    const readerIdButtonIsDisabled = !(/^[rR][A-Za-z]{6}$/.test(inputReaderId))

    const handleReaderIdButton = () => {
        setReaderId(inputReaderId.toUpperCase())
    }

    const handleWriterIdChange = event => {
        setInputWriterId(event.target.value)
    }

    const writerIdButtonIsDisabled = !(/^[wW][A-Za-z]{6}$/.test(inputWriterId))

    const handleWriterIdButton = () => {
        setWriterId(inputWriterId.toUpperCase())
    }

    const initial = () => (
        <div>
            <h2>JSDoppelkopf Initial</h2>
            <hr />
            <button onClick={() => setShowPlayerEntry(true)}>Neues Spiel beginnen</button>
            {showPlayerEntry && (<PlayerEntry closeAction={() => setShowPlayerEntry(false)} submitAction={handleNewGameClick} />)}
            <hr />
            <div style={{ display: 'grid', gap: '5px 10px', gridTemplateColumns: 'auto auto auto minmax(0, 1fr)' }}>
                <span>ReaderID</span>
                <input
                    type="text"
                    id="inputReaderId"
                    value={inputReaderId}
                    onChange={handleReaderIdChange}
                />
                <button
                    id="readerIdButton"
                    onClick={handleReaderIdButton}
                    disabled={readerIdButtonIsDisabled}>
                    Zur &apos;Lesen&apos; Seite
                </button>
                <div style={{ gridColumn: '1 / 5' }}>
                    <hr></hr>
                </div>
                <span>WriterID</span>
                <input
                    type="text"
                    id="inputWriterId"
                    value={inputWriterId}
                    onChange={handleWriterIdChange}
                />
                <button
                    id="writerIdButton"
                    onClick={handleWriterIdButton}
                    disabled={writerIdButtonIsDisabled}>
                    Zur &apos;Schreiben&apos; Seite
                </button>
            </div>
            <hr />
        </div >
    )

    if (writerId) {
        return (
            <Navigate to={`/writer/${writerId}`} replace={true} />
        )
    }
    else if (readerId) {
        return (
            <Navigate to={`/${readerId}`} replace={true} />
        )
    }
    else {
        return initial()
    }
}

export default NewGameLanding
