import { PropTypes } from 'prop-types'
import { Score } from './Score'

const Reader = ({ data }) => {

    const noop = () => {}

    return (
        <>
            <div>
                <span>readerId: </span><span id="reader-readerId">{data.readerId}</span>
            </div>
            <Score
                isWriter={false}
                data={data}
                addDeal={noop}
                addMandatorySoloTrigger={noop}
                popLastEntry={noop}
            />
        </>
    )
}

Reader.displayName = 'Reader'

Reader.propTypes = {
    demo: PropTypes.shape({
        data: PropTypes.object.isRequired,
    }),
}

export default Reader