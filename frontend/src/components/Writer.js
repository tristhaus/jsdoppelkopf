import { PropTypes } from 'prop-types'
import { useEffect, useState } from 'react'
import WideScore from './WideScore'
import NarrowScore from './NarrowScore'

const Writer = ({ data, scoreErrorMessage, addDeal, addMandatorySoloTrigger, addPlayersSet, popLastEntry, reloadAction, }) => {

    const [wideScreen, setWideScreen] = useState(
        window.matchMedia('(min-width: 768px)').matches
    )

    useEffect(() => {
        window
            .matchMedia('(min-width: 768px)')
            .addEventListener('change', e => setWideScreen(e.matches))
    }, [])

    if (wideScreen) {
        return <WideScore
            isWriter={true}
            scoreErrorMessage={scoreErrorMessage}
            data={data}
            addDeal={addDeal}
            addMandatorySoloTrigger={addMandatorySoloTrigger}
            addPlayersSet={addPlayersSet}
            popLastEntry={popLastEntry}
            reloadAction={reloadAction}
        />

    }
    else {
        return <NarrowScore
            isWriter={true}
            scoreErrorMessage={scoreErrorMessage}
            data={data}
            addDeal={addDeal}
            addMandatorySoloTrigger={addMandatorySoloTrigger}
            addPlayersSet={addPlayersSet}
            popLastEntry={popLastEntry}
            reloadAction={reloadAction}
        />
    }
}

Writer.displayName = 'Writer'

Writer.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default Writer