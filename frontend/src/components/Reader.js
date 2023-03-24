import { PropTypes } from 'prop-types'

const Reader = ({ readerId, data }) => {

    return (
        <>
            <div>
                <span>readerId: </span><span id="reader-readerId">{readerId}</span>
            </div>
            <div>
                game: {`${data.playerData[0].name}, ${data.playerData[1].name}`}
            </div>
        </>
    )
}

Reader.displayName = 'Reader'

Reader.propTypes = {
    demo: PropTypes.shape({
        readerId: PropTypes.string.isRequired,
        playerData: PropTypes.object.isRequired,
    }),
}

export default Reader