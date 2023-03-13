import { PropTypes } from 'prop-types'

const Answer = ({ demo }) => {
    const answerStyle = {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        border: 'solid',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
    }

    console.log('demo', demo)

    return (
        <div style={answerStyle} className='completeAnswer'>
            Answer: {demo.answer}
        </div>
    )
}

Answer.displayName = 'Answer'

Answer.propTypes = {
    demo: PropTypes.shape({
        answer: PropTypes.number.isRequired,
    }),
}

export default Answer