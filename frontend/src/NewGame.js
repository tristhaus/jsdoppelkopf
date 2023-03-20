import { useState } from 'react'

import Writer from './components/Writer'
import Reader from './components/Reader'

import gameService from './services/game'

const NewGame = () => {
    const [writerId, setWriterId] = useState(null)
    const [readerId, setReaderId] = useState(null)
    const [playerData, setPlayerData] = useState(null)

    const handleNewGameClick = async () => {
        setWriterId(null)
        setReaderId(null)
        setPlayerData(null)

        const response = await gameService.startGame()

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
            <button onClick={handleNewGameClick}>Start new game</button>
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

export default NewGame
