import { useState } from 'react'

import Writer from './Writer'
import Reader from './Reader'

import gameService from '../services/game'
import PlayerEntry from './PlayerEntry'

const NewGameLanding = () => {
    const [showPlayerEntry, setShowPlayerEntry] = useState(false)

    const [writerId, setWriterId] = useState(null)
    const [readerId, setReaderId] = useState(null)
    const [playerData, setPlayerData] = useState(null)

    const handleNewGameClick = async playerInformation => {
        setWriterId(null)
        setReaderId(null)
        setPlayerData(null)

        const response = await gameService.startGame(playerInformation)

        if (response) {
            setWriterId(response.writerId)
            setReaderId(response.readerId)
            setPlayerData(response.playerData)
        }
    }

    const initial = () => (
        <div>
            <h2>JSDoppelkopf Initial</h2>
            <hr />
            <button onClick={() => setShowPlayerEntry(true)}>Neues Spiel beginnen</button>
            {showPlayerEntry && (<PlayerEntry closeAction={() => setShowPlayerEntry(false)} submitAction={handleNewGameClick} />)}
        </div>
    )

    const writer = () => (
        <div>
            <h2>JSDoppelkopf Writer from Initial</h2>
            <hr />
            <Writer writerId={writerId} readerId={readerId} playerData={playerData} />
        </div>
    )

    const reader = () => (
        <div>
            <h2>JSDoppelkopf Reader from Initial</h2>
            <hr />
            <Reader readerId={readerId} playerData={playerData} />
        </div>
    )

    if (writerId) {
        return writer()
    }
    else if (readerId) {
        return reader()
    }
    else {
        return initial()
    }
}

export default NewGameLanding
