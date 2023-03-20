import React, { useState } from 'react'
import { PropTypes } from 'prop-types'

const deleteSymbol = '\u274c'

const defaultSettings = {
    numberOfPlayers: 7,
    playerName: '',
    dealerIndex: 0,
    sitOut1: 2,
    sitOut2: 4,
}

const findNumberOfPlayers = playerInformation => playerInformation?.playerData.filter(player => player.present).length ?? defaultSettings.numberOfPlayers

const findDealerIndex = playerInformation => playerInformation?.playerData.map(player => player.name).indexOf(playerInformation.dealerName) ?? defaultSettings.dealerIndex

const findPlayerNameAt = (playerInformation, index) => playerInformation?.playerData[index].name ?? defaultSettings.playerName

const findSitOutGeneric = (playerInformation, numberOfPlayers, isFirst) => {

    const dealerIndex = findDealerIndex(playerInformation)

    const playerIndicesSittingOut = playerInformation.playerData
        .map((player, index) => {
            if (player.present && !player.playing && index !== dealerIndex) {
                return index
            }
        })
        .filter(value => value !== undefined)
        .map(value => value > dealerIndex ? value - dealerIndex : value + numberOfPlayers - dealerIndex)
        .sort((a, b) => a - b)

    return isFirst ? playerIndicesSittingOut[0] : playerIndicesSittingOut[1]
}

const findSitOut1 = playerInformation => {
    if (!playerInformation) {
        return defaultSettings.sitOut1
    }

    const numberOfPlayers = findNumberOfPlayers(playerInformation)

    if (numberOfPlayers < 6) {
        return null
    }

    return findSitOutGeneric(playerInformation, numberOfPlayers, true)
}

const findSitOut2 = playerInformation => {
    if (!playerInformation) {
        return defaultSettings.sitOut2
    }

    const numberOfPlayers = findNumberOfPlayers(playerInformation)

    if (numberOfPlayers < 7) {
        return null
    }

    return findSitOutGeneric(playerInformation, numberOfPlayers, false)
}

const generateBoxInfo = index => {
    return {
        id: `box-${index}`,
        inputTextId: `text-${index}`,
        inputRadioId: `radio-${index}`,
        deleteButtonId: `deleteButton-${index}`,
        originalIndex: index,
        order: index,
    }
}

const PlayerEntry = ({ playerInformation, closeAction, submitAction }) => {

    const [numberOfPlayers, setNumberOfPlayers] = useState(findNumberOfPlayers(playerInformation))
    const [sitOut1, setSitOut1] = useState(findSitOut1(playerInformation))
    const [sitOut2, setSitOut2] = useState(findSitOut2(playerInformation))

    const initialBoxes = Array.from(Array(numberOfPlayers).keys()).map(index => generateBoxInfo(index))
    const initialTextInputs = Array.from(Array(numberOfPlayers).keys()).map(index => findPlayerNameAt(playerInformation, index))

    const [selectedDealerOriginalIndex, setSelectedDealerOriginalIndex] = useState(findDealerIndex(playerInformation))
    const [textInputs, setTextInputs] = useState(initialTextInputs)

    const [dragId, setDragId] = useState()
    const [boxes, setBoxes] = useState(initialBoxes)

    const handleDrag = event => {
        setDragId(event.currentTarget.id)
    }

    const handleDrop = event => {
        const dragBox = boxes.find((box) => box.id === dragId)
        const dropBox = boxes.find((box) => box.id === event.currentTarget.id)

        const dragBoxOrder = dragBox.order
        const dropBoxOrder = dropBox.order

        const newBoxState = boxes.map((box) => {
            if (box.id === dragId) {
                box.order = dropBoxOrder
            }

            if (box.id === event.currentTarget.id) {
                box.order = dragBoxOrder
            }

            return box
        })

        setBoxes(newBoxState)
    }

    const handleRadioOnInput = index => {
        setSelectedDealerOriginalIndex(index)
    }

    const handleTextOnInput = (value, index) => {
        const newTextInputs = [...textInputs]
        newTextInputs[index] = value
        setTextInputs(newTextInputs)
    }

    const handleAddPlayer = () => {
        const newNumberOfPlayers = numberOfPlayers + 1

        const newTextInputs = [...boxes.map(box => textInputs[box.originalIndex]), '']

        const newBoxes = [...Array(newNumberOfPlayers)].map((_, index) => generateBoxInfo(index))

        if (newNumberOfPlayers === 6) {
            setSitOut1(3)
        }
        else if (newNumberOfPlayers === 7) {
            setSitOut1(2)
            setSitOut2(4)
        }

        setNumberOfPlayers(newNumberOfPlayers)
        setTextInputs(newTextInputs)
        setBoxes(newBoxes)
    }

    const handleRemovePlayer = originalIndex => {
        const newNumberOfPlayers = numberOfPlayers - 1

        const newTextInputs = boxes
            .filter(box => box.originalIndex !== originalIndex)
            .map(box => textInputs[box.originalIndex])

        const newBoxes = [...Array(newNumberOfPlayers)].map((_, index) => generateBoxInfo(index))

        const boxIndexRemoved = boxes.findIndex(box => box.originalIndex === originalIndex)
        const boxIndexDealer = boxes.findIndex(box => box.originalIndex === selectedDealerOriginalIndex)

        if (boxIndexRemoved === boxIndexDealer) {
            const newSelectedDealerOriginalIndex = boxes[boxIndexRemoved]?.originalIndex ?? (0)
            setSelectedDealerOriginalIndex(newSelectedDealerOriginalIndex < newNumberOfPlayers ? newSelectedDealerOriginalIndex : 0)
        }
        else {
            const dealerName = textInputs[selectedDealerOriginalIndex]
            const newSelectedDealerOriginalIndex = newTextInputs.indexOf(dealerName)
            setSelectedDealerOriginalIndex(newSelectedDealerOriginalIndex)
        }

        if (newNumberOfPlayers === 6) {
            setSitOut1(3)
        }
        else if (newNumberOfPlayers === 7) {
            setSitOut1(2)
            setSitOut2(4)
        }

        setNumberOfPlayers(newNumberOfPlayers)
        setTextInputs(newTextInputs)
        setBoxes(newBoxes)
    }

    const handleSitOut1 = value => { setSitOut1(Number.parseInt(value) - 1) }
    const handleSitOut2 = value => { setSitOut2(Number.parseInt(value) - 1) }

    const cancelAction = () => {
        closeAction()
    }

    const confirmAction = async () => {
        const playerNames = []

        boxes.forEach(box => {
            playerNames.push(textInputs[box.originalIndex])
        })

        const dealerName = textInputs[selectedDealerOriginalIndex]

        const sitOutScheme = []

        if (numberOfPlayers > 5) {
            sitOutScheme.push(sitOut1)

            if (numberOfPlayers > 6) {
                sitOutScheme.push(sitOut2)
            }
        }

        await submitAction({
            playerNames,
            dealerName,
            sitOutScheme,
        })
    }

    const dataIsValid = () => {
        const relevantTextInputs = textInputs.slice(0, numberOfPlayers).filter(entry => entry !== '')

        const allPlayers = new Set(relevantTextInputs)

        if (allPlayers.size !== numberOfPlayers) {
            return false
        }

        if (numberOfPlayers > 5) {
            if (!Number.isInteger(sitOut1) || sitOut1 < 1 || sitOut1 >= numberOfPlayers) {
                return false
            }

            if (numberOfPlayers > 6) {
                if (!Number.isInteger(sitOut2) || sitOut2 < 1 || sitOut2 >= numberOfPlayers || sitOut2 === sitOut1) {
                    return false
                }
            }
        }

        return true
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
                                    <input
                                        className='dealerRadioButton'
                                        id={box.inputRadioId}
                                        type="radio"
                                        name="players"
                                        value={box.id}
                                        checked={box.originalIndex === selectedDealerOriginalIndex}
                                        onChange={() => {
                                            const localIndex = box.originalIndex
                                            handleRadioOnInput(localIndex)
                                        }}
                                    />
                                    <input
                                        className='playerNameInputText'
                                        id={box.inputTextId}
                                        type="text"
                                        value={textInputs[box.originalIndex]}
                                        onInput={e => {
                                            const localIndex = box.originalIndex
                                            handleTextOnInput(e.target.value, localIndex)
                                        }}
                                    />
                                    <button
                                        className='deletePlayerButton'
                                        id={box.deleteButtonId}
                                        disabled={numberOfPlayers <= 4}
                                        onClick={() => {
                                            handleRemovePlayer(box.originalIndex)
                                        }}>{deleteSymbol}</button>
                                </div>
                            ))}
                    </div>
                    {numberOfPlayers === 6 && (<div>
                        Aussitzen an Position:
                        <input
                            className='sitOutInput'
                            id='sitOut1'
                            type="text"
                            size={1}
                            value={(sitOut1 + 1)}
                            onInput={e => { handleSitOut1(e.target.value) }}
                        />
                    </div>)}
                    {numberOfPlayers === 7 && (<div>
                        Aussitzen an Position:
                        <input
                            className='sitOutInput'
                            id='sitOut1'
                            type="text"
                            size={1}
                            value={(sitOut1 + 1)}
                            onInput={e => { handleSitOut1(e.target.value) }}
                        />
                        <input
                            className='sitOutInput'
                            id='sitOut2'
                            type="text"
                            size={1}
                            value={(sitOut2 + 1)}
                            onInput={e => { handleSitOut2(e.target.value) }}
                        />
                    </div>)}
                    <div>
                        <button
                            className="overlayButton"
                            id='addButton'
                            onClick={handleAddPlayer}
                            disabled={numberOfPlayers >= 7}>
                            Spieler hinzufügen
                        </button>
                    </div>
                    <div>
                        <button className="overlayButton" id="cancelButton" onClick={cancelAction}>Abbrechen</button>
                        <button className="overlayButton" id="confirmButton" disabled={!dataIsValid()} onClick={confirmAction}>OK</button>
                    </div>
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