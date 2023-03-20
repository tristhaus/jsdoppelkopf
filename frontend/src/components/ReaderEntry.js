import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Reader from './Reader'

import gameService from '../services/game'

const ReaderEntry = () => {

    const inputReaderId = useParams().id

    const [readerId, setReaderId] = useState(null)
    const [playerData, setPlayerData] = useState(null)

    useEffect(() => {
        const func = async () => {
            const response = await gameService.getGameByReaderId(inputReaderId)

            if (response) {
                setReaderId(response.readerId)
                setPlayerData(response.playerData)
            }
        }
        func()
    }, [])

    const reader = () => (
        <div>
            <h2>JSDoppelkopf Reader from ReaderEntry</h2>
            <hr />
            <Reader readerId={readerId} playerData={playerData} />
        </div>
    )

    if (readerId && playerData) {
        return reader()
    }

    return <div>Loading from reader ID ...</div>
}

ReaderEntry.displayName = 'ReaderEntry'

export default ReaderEntry