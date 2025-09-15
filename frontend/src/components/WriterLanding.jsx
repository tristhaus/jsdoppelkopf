import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import Writer from './Writer'

import gameService from '../services/game'

// all in milliseconds
// how long to keep alive
const expirationPeriod = 30 * 60 * 1000
// minimal wait time between requests
const minWaitTime = 25 * 1000
// maximal increment of wait time
const maxWaitIncrement = 35 * 1000 - minWaitTime

const WriterLanding = () => {

    const timeoutRef = useRef(null)
    const expirationTimeRef = useRef(0)

    const inputWriterId = useParams().id

    const [data, setData] = useState(null)
    const [landingErrorMessage, setLandingErrorMessage] = useState('')
    const [scoreErrorMessage, setScoreErrorMessage] = useState('')

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
        setLandingErrorMessage('')
        const response = await gameService.getGameByWriterId(inputWriterId)

        if (response) {
            setScoreErrorMessage('')
            setData(response)
            startCheckHealth()
        }
        else {
            setLandingErrorMessage(`kann nicht laden, writer ID: '${inputWriterId}'`)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const addDeal = async (changes, events) => {
        const response = await gameService.addDealEntryByWriterId(data.writerId, changes, events)

        if (response) {
            setData(response)
            startCheckHealth()
        }
        else {
            setScoreErrorMessage('Spiel konnte nicht notiert werden.')
        }
    }

    const addMandatorySoloTrigger = async () => {
        const response = await gameService.addMandatorySoloEntryByWriterId(data.writerId)

        if (response) {
            setData(response)
            startCheckHealth()
        }
        else {
            setScoreErrorMessage('Pflichtsolorunde konnte nicht gestartet werden.')
        }
    }

    const addPlayersSet = async playerInformation => {
        const response = await gameService.addPlayersSetEntryByWriterId(data.writerId, playerInformation)

        if (response) {
            setData(response)
            startCheckHealth()
        }
        else {
            setScoreErrorMessage('Spieler konnten nicht geändert werden.')
        }
    }

    const popLastEntry = async () => {
        const response = await gameService.popLastEntryOnGameByWriterId(data.writerId)

        if (response) {
            setData(response)
            startCheckHealth()
        }
        else {
            setScoreErrorMessage('Letzter Eintrag konnte nicht gelöscht werden.')
        }
    }

    const writer = () => (
        <div>
            <Writer
                data={data}
                scoreErrorMessage={scoreErrorMessage}
                addDeal={addDeal}
                addMandatorySoloTrigger={addMandatorySoloTrigger}
                addPlayersSet={addPlayersSet}
                popLastEntry={popLastEntry}
                reloadAction={loadData}
            />
        </div>
    )

    if (data) {
        return writer()
    }

    return <div>Lade aus writer ID &apos;{inputWriterId}&apos; ... <span className='errorMessage'>{landingErrorMessage}</span></div>
}

WriterLanding.displayName = 'WriterLanding'

export default WriterLanding