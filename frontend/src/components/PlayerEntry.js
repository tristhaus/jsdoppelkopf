import { PropTypes } from 'prop-types'

const PlayerEntry = ({ closeAction }) => {

    const cancelAction = () => {
        closeAction()
    }

    const confirmAction = () => {
        closeAction()
    }

    // TODO: use the playerEntry object, if present, to fill the table
    // TODO: find some control to move players - or use buttons, if necessary
    // TODO: center table, SO says it can be done

    return (
        <>
            <div className="darkBG overlayOutside" onClick={() => { return }} />
            <div className="overlayBox">
                <div className="overlayVertical">
                    <div className="overlayContent">
                        <table>
                            <tr>
                                <th>Geber?</th>
                                <th>Name</th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="radio" name="players" value="dealer0" /><br />
                                </td>
                                <td>
                                    <input type="text" name="name0" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="radio" name="players" value="dealer1" /><br />
                                </td>
                                <td>
                                    <input type="text" name="name1" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="radio" name="players" value="dealer2" /><br />
                                </td>
                                <td>
                                    <input type="text" name="name2" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="radio" name="players" value="dealer3" /><br />
                                </td>
                                <td>
                                    <input type="text" name="name3" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <button className="overlayButton" onClick={cancelAction}>Cancel</button>
                    <button className="overlayButton" onClick={confirmAction}>OK</button>
                </div>
            </div>
        </>
    )
}

PlayerEntry.displayName = 'PlayerEntry'

PlayerEntry.propTypes = {
    demo: PropTypes.shape({
        playerData: PropTypes.object,
    }),
}

export default PlayerEntry