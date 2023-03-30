import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Writer from './Writer'

import gameService from '../services/game'

const WriterLanding = () => {

    const inputWriterId = useParams().id

    const [data, setData] = useState(null)

    const loadData = async () => {
        const response = await gameService.getGameByWriterId(inputWriterId)

        if (response) {
            setData(response)
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
    }

    const addMandatorySoloTrigger = async () => {
        const response = await gameService.addMandatorySoloEntryByWriterId(data.writerId)

        if (response) {
            setData(response)
        }
    }

    const popLastEntry = async () => {
        const response = await gameService.popLastEntryOnGameByWriterId(data.writerId)

        if (response) {
            setData(response)
        }
    }

    const writer = () => (
        <div>
            <h2>JSDoppelkopf Writer</h2>
            <hr />
            <Writer
                data={data}
                addDeal={addDeal}
                addMandatorySoloTrigger={addMandatorySoloTrigger}
                popLastEntry={popLastEntry}
                reloadAction={loadData}
            />
        </div>
    )

    if (data) {
        return writer()
    }

    return <div>Loading from writer ID &apos;{inputWriterId}&apos;  ...</div>
}

WriterLanding.displayName = 'WriterLanding'

export default WriterLanding