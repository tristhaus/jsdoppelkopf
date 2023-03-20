import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Writer from './Writer'

import gameService from '../services/game'

const WriterEntry = () => {

    const inputWriterId = useParams().id

    const [writerId, setWriterId] = useState(null)
    const [readerId, setReaderId] = useState(null)
    const [playerData, setPlayerData] = useState(null)

    useEffect(() => {
        const func = async () => {
            const response = await gameService.getGameByWriterId(inputWriterId)

            if (response) {
                setWriterId(response.writerId)
                setReaderId(response.readerId)
                setPlayerData(response.playerData)
            }
        }
        func()
    }, [])

    const writer = () => (
        <div>
            <h2>JSDoppelkopf Writer from WriterEntry</h2>
            <hr />
            <Writer writerId={writerId} readerId={readerId} playerData={playerData} />
        </div>
    )

    if (writerId && readerId && playerData) {
        return writer()
    }

    return <div>Loading from writer ID ...</div>
}

WriterEntry.displayName = 'WriterEntry'

export default WriterEntry