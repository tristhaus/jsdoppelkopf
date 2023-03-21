import React, { useState } from 'react'
import { PropTypes } from 'prop-types'

const PlayerEntry = ({ closeAction }) => {

    const cancelAction = () => {
        closeAction()
    }

    const confirmAction = () => {
        closeAction()
    }

    // <input type="radio" name="players" value="dealer0" /><br />
    // <input type="text" name="name0" />

    // TODO: use the playerEntry object, if present, to fill the table
    // TODO: find some control to move players - or use buttons, if necessary
    // TODO: center table, SO says it can be done

    const [dragId, setDragId] = useState()
    const [boxes, setBoxes] = useState([
        {
            id: 'Box-0',
            order: 0
        },
        {
            id: 'Box-1',
            order: 1
        },
        {
            id: 'Box-2',
            order: 2
        },
        {
            id: 'Box-3',
            order: 3
        },
        {
            id: 'Box-4',
            order: 4
        },
        {
            id: 'Box-5',
            order: 5
        }
    ])

    const handleDrag = (ev) => {
        setDragId(ev.currentTarget.id)
    }

    const handleDrop = (ev) => {
        const dragBox = boxes.find((box) => box.id === dragId)
        const dropBox = boxes.find((box) => box.id === ev.currentTarget.id)

        const dragBoxOrder = dragBox.order
        const dropBoxOrder = dropBox.order

        const newBoxState = boxes.map((box) => {
            if (box.id === dragId) {
                box.order = dropBoxOrder
            }

            if (box.id === ev.currentTarget.id) {
                box.order = dragBoxOrder
            }

            return box
        })

        setBoxes(newBoxState)
    }

    return (
        <>
            <div className="darkBG overlayOutside" onClick={() => { return }} />
            <div className="overlayBox">
                <div className="overlayVertical">
                    <div className="overlayContent">
                        {boxes
                            .sort((a, b) => a.order - b.order)
                            .map((box) => (
                                <div
                                    draggable={true}
                                    id={box.id}
                                    key={box.id}
                                    onDragOver={(ev) => ev.preventDefault()}
                                    onDragStart={handleDrag}
                                    onDrop={handleDrop}
                                    className="playerSelectionBox"
                                >
                                    something {box.id} <br />
                                    <input type="radio" name="players" value={box.id} />
                                    <input type="text" />
                                </div>
                            ))}
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