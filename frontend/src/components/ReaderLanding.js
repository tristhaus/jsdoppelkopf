import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Reader from './Reader'

import gameService from '../services/game'

const ReaderLanding = () => {

    const inputReaderId = useParams().id

    const [readerId, setReaderId] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        const func = async () => {
            const response = await gameService.getGameByReaderId(inputReaderId)

            if (response) {
                setReaderId(response.readerId)
                setData(response)
            }
        }
        func()
    }, [])

    const reader = () => (
        <div>
            <h2>JSDoppelkopf Reader from ReaderEntry</h2>
            <hr />
            <Reader readerId={readerId} data={data} />
        </div>
    )

    if (readerId && data) {
        return reader()
    }

    return <div>Loading from reader ID ...</div>
}

ReaderLanding.displayName = 'ReaderEntry'

export default ReaderLanding