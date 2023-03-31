import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Writer from './Writer'

import gameService from '../services/game'

const WriterLanding = () => {

    const inputWriterId = useParams().id

    const [data, setData] = useState(null)
    const [landingErrorMessage, setLandingErrorMessage] = useState('')
    const [scoreErrorMessage, setScoreErrorMessage] = useState('')

    const loadData = async () => {
        setLandingErrorMessage('')
        const response = await gameService.getGameByWriterId(inputWriterId)

        if (response) {
            setScoreErrorMessage('')
            setData(response)
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
        }
        else {
            setScoreErrorMessage('Spiel konnte nicht notiert werden.')
        }
    }

    const addMandatorySoloTrigger = async () => {
        const response = await gameService.addMandatorySoloEntryByWriterId(data.writerId)

        if (response) {
            setData(response)
        }
        else {
            setScoreErrorMessage('Pflichtsolorunde konnte nicht gestartet werden.')
        }
    }

    const addPlayersSet = async playerInformation => {
        const response = await gameService.addPlayersSetEntryByWriterId(data.writerId, playerInformation)

        if (response) {
            setData(response)
        }
        else {
            setScoreErrorMessage('Spieler konnten nicht geändert werden.')
        }
    }

    const popLastEntry = async () => {
        const response = await gameService.popLastEntryOnGameByWriterId(data.writerId)

        if (response) {
            setData(response)
        }
        else {
            setScoreErrorMessage('Letzter Eintrag konnte nicht gelöscht werden.')
        }
    }

    const writer = () => (
        <div>
            <h2>JSDoppelkopf Writer</h2>
            <hr />
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