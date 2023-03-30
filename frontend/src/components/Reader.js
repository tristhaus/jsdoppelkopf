import { PropTypes } from 'prop-types'
import { Score } from './Score'

const Reader = ({ data, reloadAction, }) => {

    const noop = () => { }

    return (
        <Score
            isWriter={false}
            data={data}
            addDeal={noop}
            addMandatorySoloTrigger={noop}
            popLastEntry={noop}
            reloadAction={reloadAction}
        />
    )
}

Reader.displayName = 'Reader'

Reader.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default Reader