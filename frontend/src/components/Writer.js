import { PropTypes } from 'prop-types'
import { Score } from './Score'

const Writer = ({ data, addDeal, addMandatorySoloTrigger, popLastEntry, reloadAction, }) => {

    return (
        <Score
            isWriter={true}
            data={data}
            addDeal={addDeal}
            addMandatorySoloTrigger={addMandatorySoloTrigger}
            popLastEntry={popLastEntry}
            reloadAction={reloadAction}
        />
    )
}

Writer.displayName = 'Writer'

Writer.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default Writer