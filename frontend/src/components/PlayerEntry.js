import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PropTypes } from 'prop-types'

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

const initialBoxes = [
    {
        key: 'Box-0',
        name: 'some name 0',
    },
    {
        key: 'Box-1',
        name: 'some name 1',
    },
    {
        key: 'Box-2',
        name: 'some name 2',
    },
    {
        key: 'Box-3',
        name: 'some name 3',
    },
]

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

    /*
                                        <input type="radio" name="players" value={box.id} />
                                        <input type="text" />
    */

    const [boxes, setBoxes] = useState(initialBoxes)

    const onDragEnd = result => {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        const newBoxes = reorder(boxes, result.source.index, result.destination.index)

        setBoxes(newBoxes)
    }

    return (
        <>
            <div className="darkBG overlayOutside" onClick={() => { return }} />
            <div className="overlayBox">
                <div className="overlayVertical">
                    <div className="overlayContent">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="list">
                                {provided => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{ border: '1px solid #242424', opacity: 0.5, borderRadius: '5px' }}
                                    >
                                        {boxes && boxes.map((item, index) =>
                                            <Draggable draggableId={item.key} key={item.key} index={index}>
                                                {provided => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <p style={{ color: 'green' }}>{item.name}</p>
                                                    </div>
                                                )}
                                            </Draggable>)}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
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