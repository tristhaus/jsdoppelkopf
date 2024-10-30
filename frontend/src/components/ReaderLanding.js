import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import Reader from './Reader'

import gameService from '../services/game'

// all in milliseconds
// how long to keep alive
const expirationPeriod = 30 * 60 * 1000
// minimal wait time between requests
const minWaitTime = 25 * 1000
// maximal increment of wait time
const maxWaitIncrement = 35 * 1000 - minWaitTime

const ReaderLanding = () => {

    const timeoutRef = useRef(null)
    const expirationTimeRef = useRef(0)

    const inputReaderId = useParams().id

    const [data, setData] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    const runCheckHealth = async () => {
        if (Date.now() < expirationTimeRef.current) {
            await gameService.getHealth()
            const duration = minWaitTime + Math.floor(Math.random() * maxWaitIncrement)
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(async () => { await runCheckHealth() }, duration)
        }
    }

    const startCheckHealth = async () => {
        expirationTimeRef.current = Date.now() + expirationPeriod
        runCheckHealth()
    }

    const loadData = async () => {
        const response = await gameService.getGameByReaderId(inputReaderId)

        if (response) {
            setData(response)
            startCheckHealth()
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