import { act } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import PlayerEntry from './PlayerEntry'

describe('PlayerEntry view unit tests', () => {

    test('given null data, renders correct content', () => {
        const expectedNumberOfPlayers = 7
        const expectedPlayerName = ''
        const expectedSitOut1 = '3'
        const expectedSitOut2 = '5'

        const { container } = render(<PlayerEntry closeAction={null} submitAction={null} />)

        const selectedRadioButton = container.querySelector('#radio-0')
        expect(selectedRadioButton).toBeChecked()

        for (let index = 1; index < expectedNumberOfPlayers; index++) {
            const radioButton = container.querySelector(`#radio-${index}`)
            expect(radioButton).not.toBeChecked()
        }

        const nonExistentRadioButton = container.querySelector(`#radio-${expectedNumberOfPlayers}`)
        expect(nonExistentRadioButton).toBeNull()

        for (let index = 0; index < expectedNumberOfPlayers; index++) {
            const textInput = container.querySelector(`#text-${index}`)
            expect(textInput).toHaveProperty('value', expectedPlayerName)
        }

        const nonExistentTextInput = container.querySelector(`#text-${expectedNumberOfPlayers}`)
        expect(nonExistentTextInput).toBeNull()

        for (let index = 0; index < expectedNumberOfPlayers; index++) {
            const deleteButton = container.querySelector(`#deleteButton-${index}`)
            expect(deleteButton).toHaveProperty('disabled', false)
        }

        const nonExistentDeleteButton = container.querySelector(`#deleteButton-${expectedNumberOfPlayers}`)
        expect(nonExistentDeleteButton).toBeNull()

        const sitOut1TextField = container.querySelector('#sitOut1')
        expect(sitOut1TextField).toHaveProperty('value', expectedSitOut1)

        const sitOut2TextField = container.querySelector('#sitOut2')
        expect(sitOut2TextField).toHaveProperty('value', expectedSitOut2)

        const addPlayerButton = container.querySelector('#addButton')
        expect(addPlayerButton).toHaveProperty('disabled', true)

        const cancelButton = container.querySelector('#cancelButton')
        expect(cancelButton).toHaveProperty('disabled', false)

        const confirmButton = container.querySelector('#confirmButton')
        expect(confirmButton).toHaveProperty('disabled', true)
    })

    test('add/remove buttons disabled, sit-out fields removed as sensible', () => {

        const validate = (container, expectedNumberOfPlayers, addIsDisabled, removeIsDisabled) => {

            for (let index = 0; index < expectedNumberOfPlayers; index++) {
                const radioButton = container.querySelector(`#radio-${index}`)
                expect(radioButton).not.toBeNull()
            }

            const nonRadioButton = container.querySelector(`#radio-${expectedNumberOfPlayers}`)
            expect(nonRadioButton).toBeNull()

            for (let index = 0; index < expectedNumberOfPlayers; index++) {
                const textInput = container.querySelector(`#text-${index}`)
                expect(textInput).not.toBeNull()
            }

            const nonExistentTextInput = container.querySelector(`#text-${expectedNumberOfPlayers}`)
            expect(nonExistentTextInput).toBeNull()

            for (let index = 0; index < expectedNumberOfPlayers; index++) {
                const deleteButton = container.querySelector(`#deleteButton-${index}`)
                expect(deleteButton).toHaveProperty('disabled', removeIsDisabled)
            }

            const nonExistentDeleteButton = container.querySelector(`#deleteButton-${expectedNumberOfPlayers}`)
            expect(nonExistentDeleteButton).toBeNull()

            const sitOut1TextField = container.querySelector('#sitOut1')

            if (expectedNumberOfPlayers > 5) {
                expect(sitOut1TextField).not.toBeNull()
            }
            else {
                expect(sitOut1TextField).toBeNull()
            }

            const sitOut2TextField = container.querySelector('#sitOut2')

            if (expectedNumberOfPlayers > 6) {
                expect(sitOut2TextField).not.toBeNull()
            }
            else {
                expect(sitOut2TextField).toBeNull()
            }

            const addPlayerButton = container.querySelector('#addButton')
            expect(addPlayerButton).toHaveProperty('disabled', addIsDisabled)
        }

        const { container } = render(<PlayerEntry closeAction={null} submitAction={null} />)

        validate(container, 7, true, false)

        act(() => {
            const deleteButton = container.querySelector('#deleteButton-0')
            deleteButton.click()
        })

        validate(container, 6, false, false)

        act(() => {
            const deleteButton = container.querySelector('#deleteButton-0')
            deleteButton.click()
        })

        validate(container, 5, false, false)

        act(() => {
            const deleteButton = container.querySelector('#deleteButton-0')
            deleteButton.click()
        })

        validate(container, 4, false, true)

        act(() => {
            const addButton = container.querySelector('#addButton')
            addButton.click()
        })

        validate(container, 5, false, false)

        act(() => {
            const addButton = container.querySelector('#addButton')
            addButton.click()
        })

        validate(container, 6, false, false)

        act(() => {
            const addButton = container.querySelector('#addButton')
            addButton.click()
        })

        validate(container, 7, true, false)
    })

    const getPlayerInformation6 = () => ({
        dealerName: 'C6',
        playerData: [
            {
                name: 'A6',
                present: true,
                playing: false,
            },
            {
                name: 'B6',
                present: true,
                playing: true,
            },
            {
                name: 'C6',
                present: true,
                playing: false,
            },
            {
                name: 'D6',
                present: true,
                playing: true,
            },
            {
                name: 'E6',
                present: true,
                playing: true,
            },
            {
                name: 'F6',
                present: true,
                playing: true,
            },
        ]
    })

    const getPlayerInformation7 = () => ({
        dealerName: 'C7',
        playerData: [
            {
                name: 'A7',
                present: true,
                playing: false,
            },
            {
                name: 'B7',
                present: true,
                playing: true,
            },
            {
                name: 'C7',
                present: true,
                playing: false,
            },
            {
                name: 'D7',
                present: true,
                playing: false,
            },
            {
                name: 'E7',
                present: true,
                playing: true,
            },
            {
                name: 'F7',
                present: true,
                playing: true,
            },
            {
                name: 'G7',
                present: true,
                playing: true,
            },
        ]
    })

    test('given 6 players, renders correct content', () => {

        const { container } = render(<PlayerEntry playerInformation={getPlayerInformation6()} closeAction={null} submitAction={null} />)

        expect(container.querySelector('#radio-0')).not.toBeChecked()
        expect(container.querySelector('#radio-1')).not.toBeChecked()
        expect(container.querySelector('#radio-2')).toBeChecked()
        expect(container.querySelector('#radio-3')).not.toBeChecked()
        expect(container.querySelector('#radio-4')).not.toBeChecked()
        expect(container.querySelector('#radio-5')).not.toBeChecked()

        expect(container.querySelector('#text-0')).toHaveProperty('value', 'A6')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'B6')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'C6')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'D6')
        expect(container.querySelector('#text-4')).toHaveProperty('value', 'E6')
        expect(container.querySelector('#text-5')).toHaveProperty('value', 'F6')

        const sitOut1TextField = container.querySelector('#sitOut1')
        expect(sitOut1TextField).toHaveProperty('value', '5')
    })

    test('given 7 players, renders correct content', () => {

        const { container } = render(<PlayerEntry playerInformation={getPlayerInformation7()} closeAction={null} submitAction={null} />)

        expect(container.querySelector('#radio-0')).not.toBeChecked()
        expect(container.querySelector('#radio-1')).not.toBeChecked()
        expect(container.querySelector('#radio-2')).toBeChecked()
        expect(container.querySelector('#radio-3')).not.toBeChecked()
        expect(container.querySelector('#radio-4')).not.toBeChecked()
        expect(container.querySelector('#radio-5')).not.toBeChecked()
        expect(container.querySelector('#radio-6')).not.toBeChecked()

        expect(container.querySelector('#text-0')).toHaveProperty('value', 'A7')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'B7')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'C7')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'D7')
        expect(container.querySelector('#text-4')).toHaveProperty('value', 'E7')
        expect(container.querySelector('#text-5')).toHaveProperty('value', 'F7')
        expect(container.querySelector('#text-6')).toHaveProperty('value', 'G7')

        const sitOut1TextField = container.querySelector('#sitOut1')
        expect(sitOut1TextField).toHaveProperty('value', '2')

        const sitOut2TextField = container.querySelector('#sitOut2')
        expect(sitOut2TextField).toHaveProperty('value', '6')
    })

    test('when removing players, dealer is handled correctly', () => {

        const { container } = render(<PlayerEntry playerInformation={getPlayerInformation7()} closeAction={null} submitAction={null} />)

        expect(container.querySelector('#radio-0')).not.toBeChecked()
        expect(container.querySelector('#radio-1')).not.toBeChecked()
        expect(container.querySelector('#radio-2')).toBeChecked()
        expect(container.querySelector('#radio-3')).not.toBeChecked()
        expect(container.querySelector('#radio-4')).not.toBeChecked()
        expect(container.querySelector('#radio-5')).not.toBeChecked()
        expect(container.querySelector('#radio-6')).not.toBeChecked()

        expect(container.querySelector('#text-0')).toHaveProperty('value', 'A7')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'B7')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'C7')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'D7')
        expect(container.querySelector('#text-4')).toHaveProperty('value', 'E7')
        expect(container.querySelector('#text-5')).toHaveProperty('value', 'F7')
        expect(container.querySelector('#text-6')).toHaveProperty('value', 'G7')

        act(() => {
            const deleteButton = container.querySelector('#deleteButton-0')
            deleteButton.click()
        })

        expect(container.querySelector('#radio-0')).not.toBeChecked()
        expect(container.querySelector('#radio-1')).toBeChecked()
        expect(container.querySelector('#radio-2')).not.toBeChecked()
        expect(container.querySelector('#radio-3')).not.toBeChecked()
        expect(container.querySelector('#radio-4')).not.toBeChecked()
        expect(container.querySelector('#radio-5')).not.toBeChecked()

        expect(container.querySelector('#text-0')).toHaveProperty('value', 'B7')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'C7')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'D7')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'E7')
        expect(container.querySelector('#text-4')).toHaveProperty('value', 'F7')
        expect(container.querySelector('#text-5')).toHaveProperty('value', 'G7')

        act(() => {
            const deleteButton = container.querySelector('#deleteButton-1')
            deleteButton.click()
        })

        expect(container.querySelector('#radio-0')).not.toBeChecked()
        expect(container.querySelector('#radio-1')).toBeChecked()
        expect(container.querySelector('#radio-2')).not.toBeChecked()
        expect(container.querySelector('#radio-3')).not.toBeChecked()
        expect(container.querySelector('#radio-4')).not.toBeChecked()

        expect(container.querySelector('#text-0')).toHaveProperty('value', 'B7')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'D7')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'E7')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'F7')
        expect(container.querySelector('#text-4')).toHaveProperty('value', 'G7')

        act(() => {
            const lastDealerButton = container.querySelector('#radio-4')
            lastDealerButton.click()
        })

        act(() => {
            const deleteButton = container.querySelector('#deleteButton-4')
            deleteButton.click()
        })

        expect(container.querySelector('#radio-0')).toBeChecked()
        expect(container.querySelector('#radio-1')).not.toBeChecked()
        expect(container.querySelector('#radio-2')).not.toBeChecked()
        expect(container.querySelector('#radio-3')).not.toBeChecked()

        expect(container.querySelector('#text-0')).toHaveProperty('value', 'B7')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'D7')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'E7')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'F7')
    })

    test('validation handles duplicated player names', () => {

        const localInformation = getPlayerInformation7()
        localInformation.playerData[0].name = 'duplicated'
        localInformation.playerData[4].name = 'duplicated'

        const { container } = render(<PlayerEntry playerInformation={localInformation} closeAction={null} submitAction={null} />)

        expect(container.querySelector('#text-0')).toHaveProperty('value', 'duplicated')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'B7')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'C7')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'D7')
        expect(container.querySelector('#text-4')).toHaveProperty('value', 'duplicated')
        expect(container.querySelector('#text-5')).toHaveProperty('value', 'F7')
        expect(container.querySelector('#text-6')).toHaveProperty('value', 'G7')

        const confirmButton = container.querySelector('#confirmButton')
        expect(confirmButton).toHaveProperty('disabled', true)
    })

    test('validation handles empty player names', () => {

        const localInformation = getPlayerInformation7()
        localInformation.playerData[0].name = ''

        const { container } = render(<PlayerEntry playerInformation={localInformation} closeAction={null} submitAction={null} />)

        expect(container.querySelector('#text-0')).toHaveProperty('value', '')
        expect(container.querySelector('#text-1')).toHaveProperty('value', 'B7')
        expect(container.querySelector('#text-2')).toHaveProperty('value', 'C7')
        expect(container.querySelector('#text-3')).toHaveProperty('value', 'D7')
        expect(container.querySelector('#text-4')).toHaveProperty('value', 'E7')
        expect(container.querySelector('#text-5')).toHaveProperty('value', 'F7')
        expect(container.querySelector('#text-6')).toHaveProperty('value', 'G7')

        const confirmButton = container.querySelector('#confirmButton')
        expect(confirmButton).toHaveProperty('disabled', true)
    })

    test('given 4 players, submitAction is called with correct argument', () => {

        const playerInformation4 = {
            dealerName: 'C4',
            playerData: [
                {
                    name: 'A4',
                    present: true,
                    playing: true,
                },
                {
                    name: 'B4',
                    present: true,
                    playing: true,
                },
                {
                    name: 'C4',
                    present: true,
                    playing: true,
                },
                {
                    name: 'D4',
                    present: true,
                    playing: true,
                },
            ]
        }

        const spy = jest.fn()

        const { container } = render(<PlayerEntry playerInformation={playerInformation4} closeAction={() => { }} submitAction={spy} />)

        act(() => {
            const confirmButton = container.querySelector('#confirmButton')
            confirmButton.click()
        })

        expect(spy).toHaveBeenCalledWith({
            playerNames: ['A4', 'B4', 'C4', 'D4'],
            dealerName: 'C4',
            sitOutScheme: []
        })
    })

    test('given 5 players, submitAction is called with correct argument', () => {

        const playerInformation5 = {
            dealerName: 'C5',
            playerData: [
                {
                    name: 'A5',
                    present: true,
                    playing: true,
                },
                {
                    name: 'B5',
                    present: true,
                    playing: true,
                },
                {
                    name: 'C5',
                    present: true,
                    playing: false,
                },
                {
                    name: 'D5',
                    present: true,
                    playing: true,
                },
                {
                    name: 'E5',
                    present: true,
                    playing: true,
                },
            ]
        }

        const spy = jest.fn()

        const { container } = render(<PlayerEntry playerInformation={playerInformation5} closeAction={() => { }} submitAction={spy} />)

        act(() => {
            const confirmButton = container.querySelector('#confirmButton')
            confirmButton.click()
        })

        expect(spy).toHaveBeenCalledWith({
            playerNames: ['A5', 'B5', 'C5', 'D5', 'E5'],
            dealerName: 'C5',
            sitOutScheme: []
        })
    })

    test('given 6 players, submitAction is called with correct argument', () => {

        const spy = jest.fn()

        const { container } = render(<PlayerEntry playerInformation={getPlayerInformation6()} closeAction={() => { }} submitAction={spy} />)

        act(() => {
            const confirmButton = container.querySelector('#confirmButton')
            confirmButton.click()
        })

        expect(spy).toHaveBeenCalledWith({
            playerNames: ['A6', 'B6', 'C6', 'D6', 'E6', 'F6'],
            dealerName: 'C6',
            sitOutScheme: [4]
        })
    })

    test('given 7 players, submitAction is called with correct argument', () => {

        const spy = jest.fn()

        const { container } = render(<PlayerEntry playerInformation={getPlayerInformation7()} closeAction={() => { }} submitAction={spy} />)

        act(() => {
            const confirmButton = container.querySelector('#confirmButton')
            confirmButton.click()
        })

        expect(spy).toHaveBeenCalledWith({
            playerNames: ['A7', 'B7', 'C7', 'D7', 'E7', 'F7',  'G7'],
            dealerName: 'C7',
            sitOutScheme: [1, 5]
        })
    })
})
