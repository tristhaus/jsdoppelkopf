import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Reader from './Reader'

import gameService from '../services/game'

const ReaderLanding = () => {

    const inputReaderId = useParams().id

    const [data, setData] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    const loadData = async () => {
        const response = await gameService.getGameByReaderId(inputReaderId)

        if (response) {
            setData(response)
        }
        else {
            setErrorMessage(`kann nicht laden, reader ID: '${inputReaderId}'`)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const reader = () => (
        <div>
            <h2>JSDoppelkopf Reader</h2>
            <hr />
            <Reader
                data={data}
                reloadAction={loadData}
            />
        </div>
    )

    if (data) {
        return reader()
    }

    return <div>Lade aus reader ID &apos;{inputReaderId}&apos; ... <span className='errorMessage'>{errorMessage}</span></div>
}

ReaderLanding.displayName = 'ReaderEntry'

export default ReaderLanding