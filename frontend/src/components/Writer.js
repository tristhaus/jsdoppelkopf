import { PropTypes } from 'prop-types'
import { Score } from './Score'

const Writer = ({ data, addDeal, addMandatorySoloTrigger, popLastEntry, }) => {

    return (
        <>
            <div>
                <span>writerId: </span><span id="writer-writerId">{data.writerId}</span>
            </div>
            <div>
                <span>readerId: </span><span id="writer-readerId">{data.readerId}</span>
            </div>
            <Score
                isWriter={true}
                data={data}
                addDeal={addDeal}
                addMandatorySoloTrigger={addMandatorySoloTrigger}
                popLastEntry={popLastEntry}
            />
        </>
    )
}

Writer.displayName = 'Writer'

Writer.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default Writer