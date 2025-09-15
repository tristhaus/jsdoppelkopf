import { PropTypes } from 'prop-types'
import { useEffect, useState } from 'react'
import WideScore from './WideScore'
import NarrowScore from './NarrowScore'

const Reader = ({ data, reloadAction, }) => {

    const [wideScreen, setWideScreen] = useState(
        window.matchMedia('(min-width: 768px)').matches
    )

    useEffect(() => {
        window
            .matchMedia('(min-width: 768px)')
            .addEventListener('change', e => setWideScreen(e.matches))
    }, [])

    const noop = () => { }

    if (wideScreen) {
        return (
            <WideScore
                isWriter={false}
                data={data}
                addDeal={noop}
                addMandatorySoloTrigger={noop}
                popLastEntry={noop}
                reloadAction={reloadAction}
            />
        )
    }
    else {
        return <NarrowScore
            isWriter={false}
            data={data}
            addDeal={noop}
            addMandatorySoloTrigger={noop}
            popLastEntry={noop}
            reloadAction={reloadAction}
        />
    }
}

Reader.displayName = 'Reader'

Reader.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default Reader