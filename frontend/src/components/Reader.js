import { PropTypes } from 'prop-types'

const Reader = ({ readerId, playerData }) => {

    return (
        <>
            <div>
                <span>readerId: </span><span id="reader-readerId">{readerId}</span>
            </div>
            <div>
                game: {`${playerData[0].name}, ${playerData[1].name}`}
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