import { PropTypes } from 'prop-types'

const Writer = ({ writerId, readerId, playerData }) => {

    return (
        <>
            <div>
                <span>writerId: </span><span id="writer-writerId">{writerId}</span>
            </div>
            <div>
                <span>readerId: </span><span id="writer-readerId">{readerId}</span>
            </div>
            <div>
                game: {`${playerData[0].name}, ${playerData[1].name}`}
            </div>
        </>
    )
}

Writer.displayName = 'Writer'

Writer.propTypes = {
    demo: PropTypes.shape({
        writerId: PropTypes.string.isRequired,
        readerId: PropTypes.string.isRequired,
        playerData: PropTypes.object.isRequired,
    }),
}

export default Writer