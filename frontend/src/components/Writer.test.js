import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import 'jest-canvas-mock'
import Writer from './Writer'
import { BrowserRouter } from 'react-router-dom'

describe('writer view unit tests', () => {

    test('renders the content: general / with Bock', () => {
        const data = {
            deploymentUrl: 'http://localhost:3001',
            readerId: 'bbbbbb',
            creationDate: 1679695174984,
            poppableEntry: 'deal',
            playerData: [
                { name: 'PlayerA', present: true, playing: true, lastDealDiff: 6, score: 4, cents: 0 },
                { name: 'PlayerB', present: true, playing: true, lastDealDiff: -6, score: -11, cents: 8 },
                { name: 'PlayerC', present: true, playing: true, lastDealDiff: 6, score: 5, cents: 0 },
                { name: 'PlayerD', present: true, playing: true, lastDealDiff: -6, score: -2, cents: 3 },
                { name: 'PlayerE', present: true, playing: false, lastDealDiff: null, score: -1, cents: 3 },
                { name: 'PlayerF', present: false, playing: false, lastDealDiff: null, score: -3, cents: 4 },
            ],
            dealerName: 'PlayerE',
            useBock: true,
            bockPreview: { 'single': 0, 'double': 0, 'triple': 0 },
            isMandatorySolo: false,
            totalCash: 224,
            absentPlayerCents: 7,
            writerId: 'aaaaaa'
        }

        const { container } = render(<BrowserRouter><Writer data={data} /></BrowserRouter>)

        const readerLinkButton = container.querySelector('#readerLinkButton')
        expect(readerLinkButton).not.toBeNull()

        const readerIdDisplay = container.querySelector('#readerIdDisplay')
        expect(readerIdDisplay).toHaveTextContent('Reader ID: bbbbbb')

        const writerLinkButton = container.querySelector('#writerLinkButton')
        expect(writerLinkButton).not.toBeNull()

        const mandatorySoloButton = container.querySelector('.mandatorySoloButton')
        expect(mandatorySoloButton).not.toBeDisabled()

        const currentBockStatus = container.querySelector('#currentBockStatus')
        expect(currentBockStatus).toHaveTextContent('Kein Bock')

        const bockPreviewTriple = container.querySelector('#bockPreviewTriple')
        expect(bockPreviewTriple).toHaveTextContent('0')

        const bockPreviewDouble = container.querySelector('#bockPreviewDouble')
        expect(bockPreviewDouble).toHaveTextContent('0')

        const bockPreviewSingle = container.querySelector('#bockPreviewSingle')
        expect(bockPreviewSingle).toHaveTextContent('0')

        expect(container.querySelector('#name_PlayerA')).toHaveTextContent('PlayerA')
        expect(container.querySelector('#name_PlayerB')).toHaveTextContent('PlayerB')
        expect(container.querySelector('#name_PlayerC')).toHaveTextContent('PlayerC')
        expect(container.querySelector('#name_PlayerD')).toHaveTextContent('PlayerD')
        expect(container.querySelector('#name_PlayerE')).toHaveTextContent('PlayerE')
        expect(container.querySelector('#name_PlayerF')).toHaveTextContent('PlayerF')

        expect(container.querySelector('#name_PlayerA')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerB')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerC')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerD')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerE')).toHaveClass('playerNameDealer')
        expect(container.querySelector('#name_PlayerF')).toHaveClass('playerName')

        expect(container.querySelector('#lastDeal_PlayerA')).toHaveTextContent('6')
        expect(container.querySelector('#lastDeal_PlayerB')).toHaveTextContent('-6')
        expect(container.querySelector('#lastDeal_PlayerC')).toHaveTextContent('6')
        expect(container.querySelector('#lastDeal_PlayerD')).toHaveTextContent('-6')
        expect(container.querySelector('#lastDeal_PlayerE')).toHaveTextContent('')
        expect(container.querySelector('#lastDeal_PlayerF')).toHaveTextContent('')

        expect(container.querySelector('#currentDeal_PlayerA')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerB')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerC')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerD')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerE')).toBeNull()
        expect(container.querySelector('#currentDeal_PlayerF')).toBeNull()

        const bockereignisse = container.querySelector('#bockereignisse')
        expect(bockereignisse).toBeDefined()

        const popButton = container.querySelector('.popButton')
        expect(popButton).not.toBeDisabled()

        const dealButton = container.querySelector('.dealButton')
        expect(dealButton).toBeDisabled()

        expect(container.querySelector('#score_PlayerA')).toHaveTextContent('4')
        expect(container.querySelector('#score_PlayerB')).toHaveTextContent('-11')
        expect(container.querySelector('#score_PlayerC')).toHaveTextContent('5')
        expect(container.querySelector('#score_PlayerD')).toHaveTextContent('-2')
        expect(container.querySelector('#score_PlayerE')).toHaveTextContent('-1')
        expect(container.querySelector('#score_PlayerF')).toHaveTextContent('-3')

        expect(container.querySelector('#cash_PlayerA')).toHaveTextContent('0')
        expect(container.querySelector('#cash_PlayerB')).toHaveTextContent('8')
        expect(container.querySelector('#cash_PlayerC')).toHaveTextContent('0')
        expect(container.querySelector('#cash_PlayerD')).toHaveTextContent('3')
        expect(container.querySelector('#cash_PlayerE')).toHaveTextContent('3')
        expect(container.querySelector('#cash_PlayerF')).toHaveTextContent('4')

        const totalCash = container.querySelector('#totalCash')
        expect(totalCash).toHaveTextContent('2,24 (inkl. 0,07 pro Abwesender)')
    })

    test('renders the content: general / no Bock', () => {
        const data = {
            deploymentUrl: 'http://localhost:3001',
            readerId: 'bbbbbb',
            creationDate: 1679695174984,
            poppableEntry: 'deal',
            playerData: [
                { name: 'PlayerA', present: true, playing: true, lastDealDiff: 6, score: 4, cents: 0 },
                { name: 'PlayerB', present: true, playing: true, lastDealDiff: -6, score: -11, cents: 8 },
                { name: 'PlayerC', present: true, playing: true, lastDealDiff: 6, score: 5, cents: 0 },
                { name: 'PlayerD', present: true, playing: true, lastDealDiff: -6, score: -2, cents: 3 },
                { name: 'PlayerE', present: true, playing: false, lastDealDiff: null, score: -1, cents: 3 },
                { name: 'PlayerF', present: false, playing: false, lastDealDiff: null, score: -3, cents: 4 },
            ],
            dealerName: 'PlayerE',
            useBock: false,
            bockPreview: { 'single': 0, 'double': 0, 'triple': 0 },
            isMandatorySolo: false,
            totalCash: 224,
            absentPlayerCents: 7,
            writerId: 'aaaaaa'
        }

        const { container } = render(<BrowserRouter><Writer data={data} /></BrowserRouter>)

        const readerLinkButton = container.querySelector('#readerLinkButton')
        expect(readerLinkButton).not.toBeNull()

        const readerIdDisplay = container.querySelector('#readerIdDisplay')
        expect(readerIdDisplay).toHaveTextContent('Reader ID: bbbbbb')

        const writerLinkButton = container.querySelector('#writerLinkButton')
        expect(writerLinkButton).not.toBeNull()

        const mandatorySoloButton = container.querySelector('.mandatorySoloButton')
        expect(mandatorySoloButton).toBeNull()

        const currentBockStatus = container.querySelector('#currentBockStatus')
        expect(currentBockStatus).toBeNull()

        const bockPreviewTriple = container.querySelector('#bockPreviewTriple')
        expect(bockPreviewTriple).toBeNull()

        const bockPreviewDouble = container.querySelector('#bockPreviewDouble')
        expect(bockPreviewDouble).toBeNull()

        const bockPreviewSingle = container.querySelector('#bockPreviewSingle')
        expect(bockPreviewSingle).toBeNull()

        expect(container.querySelector('#name_PlayerA')).toHaveTextContent('PlayerA')
        expect(container.querySelector('#name_PlayerB')).toHaveTextContent('PlayerB')
        expect(container.querySelector('#name_PlayerC')).toHaveTextContent('PlayerC')
        expect(container.querySelector('#name_PlayerD')).toHaveTextContent('PlayerD')
        expect(container.querySelector('#name_PlayerE')).toHaveTextContent('PlayerE')
        expect(container.querySelector('#name_PlayerF')).toHaveTextContent('PlayerF')

        expect(container.querySelector('#name_PlayerA')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerB')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerC')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerD')).toHaveClass('playerName')
        expect(container.querySelector('#name_PlayerE')).toHaveClass('playerNameDealer')
        expect(container.querySelector('#name_PlayerF')).toHaveClass('playerName')

        expect(container.querySelector('#lastDeal_PlayerA')).toHaveTextContent('6')
        expect(container.querySelector('#lastDeal_PlayerB')).toHaveTextContent('-6')
        expect(container.querySelector('#lastDeal_PlayerC')).toHaveTextContent('6')
        expect(container.querySelector('#lastDeal_PlayerD')).toHaveTextContent('-6')
        expect(container.querySelector('#lastDeal_PlayerE')).toHaveTextContent('')
        expect(container.querySelector('#lastDeal_PlayerF')).toHaveTextContent('')

        expect(container.querySelector('#currentDeal_PlayerA')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerB')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerC')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerD')).toBeDefined()
        expect(container.querySelector('#currentDeal_PlayerE')).toBeNull()
        expect(container.querySelector('#currentDeal_PlayerF')).toBeNull()

        const bockereignisse = container.querySelector('#bockereignisse')
        expect(bockereignisse).toBeDefined()

        const popButton = container.querySelector('.popButton')
        expect(popButton).not.toBeDisabled()

        const dealButton = container.querySelector('.dealButton')
        expect(dealButton).toBeDisabled()

        expect(container.querySelector('#score_PlayerA')).toHaveTextContent('4')
        expect(container.querySelector('#score_PlayerB')).toHaveTextContent('-11')
        expect(container.querySelector('#score_PlayerC')).toHaveTextContent('5')
        expect(container.querySelector('#score_PlayerD')).toHaveTextContent('-2')
        expect(container.querySelector('#score_PlayerE')).toHaveTextContent('-1')
        expect(container.querySelector('#score_PlayerF')).toHaveTextContent('-3')

        expect(container.querySelector('#cash_PlayerA')).toHaveTextContent('0')
        expect(container.querySelector('#cash_PlayerB')).toHaveTextContent('8')
        expect(container.querySelector('#cash_PlayerC')).toHaveTextContent('0')
        expect(container.querySelector('#cash_PlayerD')).toHaveTextContent('3')
        expect(container.querySelector('#cash_PlayerE')).toHaveTextContent('3')
        expect(container.querySelector('#cash_PlayerF')).toHaveTextContent('4')

        const totalCash = container.querySelector('#totalCash')
        expect(totalCash).toHaveTextContent('2,24 (inkl. 0,07 pro Abwesender)')
    })

    test('renders the content: mandatory solo', () => {
        const data = {
            deploymentUrl: 'http://localhost:3001',
            readerId: 'bbbbbb',
            creationDate: 1679695174984,
            poppableEntry: 'deal',
            playerData: [
                { name: 'PlayerA', present: true, playing: true, lastDealDiff: 6, score: 4, cents: 0 },
                { name: 'PlayerB', present: true, playing: true, lastDealDiff: -6, score: -11, cents: 8 },
                { name: 'PlayerC', present: true, playing: true, lastDealDiff: 6, score: 5, cents: 0 },
                { name: 'PlayerD', present: true, playing: true, lastDealDiff: -6, score: -2, cents: 3 },
                { name: 'PlayerE', present: true, playing: false, lastDealDiff: null, score: -1, cents: 3 },
                { name: 'PlayerF', present: false, playing: false, lastDealDiff: null, score: -3, cents: 4 },
            ],
            dealerName: 'PlayerE',
            useBock: true,
            bockPreview: { 'single': 1, 'double': 2, 'triple': 3 },
            isMandatorySolo: true,
            totalCash: 24,
            absentPlayerCents: 7,
            writerId: 'aaaaaa'
        }

        const { container } = render(<BrowserRouter><Writer data={data} /></BrowserRouter>)

        const mandatorySoloButton = container.querySelector('.mandatorySoloButton')
        expect(mandatorySoloButton).toBeDisabled()

        const currentBockStatus = container.querySelector('#currentBockStatus')
        expect(currentBockStatus).toHaveTextContent('Pflichtsolo')

        const bockPreviewTriple = container.querySelector('#bockPreviewTriple')
        expect(bockPreviewTriple).toHaveTextContent('3')

        const bockPreviewDouble = container.querySelector('#bockPreviewDouble')
        expect(bockPreviewDouble).toHaveTextContent('2')

        const bockPreviewSingle = container.querySelector('#bockPreviewSingle')
        expect(bockPreviewSingle).toHaveTextContent('1')
    })

    test('renders the content: Dreifachbock', () => {
        const data = {
            deploymentUrl: 'http://localhost:3001',
            readerId: 'bbbbbb',
            creationDate: 1679695174984,
            poppableEntry: 'deal',
            playerData: [
                { name: 'PlayerA', present: true, playing: true, lastDealDiff: 6, score: 4, cents: 0 },
                { name: 'PlayerB', present: true, playing: true, lastDealDiff: -6, score: -11, cents: 8 },
                { name: 'PlayerC', present: true, playing: true, lastDealDiff: 6, score: 5, cents: 0 },
                { name: 'PlayerD', present: true, playing: true, lastDealDiff: -6, score: -2, cents: 3 },
                { name: 'PlayerE', present: true, playing: false, lastDealDiff: null, score: -1, cents: 3 },
                { name: 'PlayerF', present: false, playing: false, lastDealDiff: null, score: -3, cents: 4 },
            ],
            dealerName: 'PlayerE',
            useBock: true,
            bockPreview: { 'single': 1, 'double': 2, 'triple': 3 },
            isMandatorySolo: false,
            totalCash: 24,
            absentPlayerCents: 7,
            writerId: 'aaaaaa'
        }

        const { container } = render(<BrowserRouter><Writer data={data} /></BrowserRouter>)

        const mandatorySoloButton = container.querySelector('.mandatorySoloButton')
        expect(mandatorySoloButton).not.toBeDisabled()

        const currentBockStatus = container.querySelector('#currentBockStatus')
        expect(currentBockStatus).toHaveTextContent('Dreifachbock')

        const bockPreviewTriple = container.querySelector('#bockPreviewTriple')
        expect(bockPreviewTriple).toHaveTextContent('3')

        const bockPreviewDouble = container.querySelector('#bockPreviewDouble')
        expect(bockPreviewDouble).toHaveTextContent('2')

        const bockPreviewSingle = container.querySelector('#bockPreviewSingle')
        expect(bockPreviewSingle).toHaveTextContent('1')
    })

    test('renders the content: Doppelbock', () => {
        const data = {
            deploymentUrl: 'http://localhost:3001',
            readerId: 'bbbbbb',
            creationDate: 1679695174984,
            poppableEntry: 'deal',
            playerData: [
                { name: 'PlayerA', present: true, playing: true, lastDealDiff: 6, score: 4, cents: 0 },
                { name: 'PlayerB', present: true, playing: true, lastDealDiff: -6, score: -11, cents: 8 },
                { name: 'PlayerC', present: true, playing: true, lastDealDiff: 6, score: 5, cents: 0 },
                { name: 'PlayerD', present: true, playing: true, lastDealDiff: -6, score: -2, cents: 3 },
                { name: 'PlayerE', present: true, playing: false, lastDealDiff: null, score: -1, cents: 3 },
                { name: 'PlayerF', present: false, playing: false, lastDealDiff: null, score: -3, cents: 4 },
            ],
            dealerName: 'PlayerE',
            useBock: true,
            bockPreview: { 'single': 1, 'double': 2, 'triple': 0 },
            isMandatorySolo: false,
            totalCash: 24,
            absentPlayerCents: 7,
            writerId: 'aaaaaa'
        }

        const { container } = render(<BrowserRouter><Writer data={data} /></BrowserRouter>)

        const mandatorySoloButton = container.querySelector('.mandatorySoloButton')
        expect(mandatorySoloButton).not.toBeDisabled()

        const currentBockStatus = container.querySelector('#currentBockStatus')
        expect(currentBockStatus).toHaveTextContent('Doppelbock')

        const bockPreviewTriple = container.querySelector('#bockPreviewTriple')
        expect(bockPreviewTriple).toHaveTextContent('0')

        const bockPreviewDouble = container.querySelector('#bockPreviewDouble')
        expect(bockPreviewDouble).toHaveTextContent('2')

        const bockPreviewSingle = container.querySelector('#bockPreviewSingle')
        expect(bockPreviewSingle).toHaveTextContent('1')
    })

    test('renders the content: Einfachbock', () => {
        const data = {
            deploymentUrl: 'http://localhost:3001',
            readerId: 'bbbbbb',
            creationDate: 1679695174984,
            poppableEntry: 'deal',
            playerData: [
                { name: 'PlayerA', present: true, playing: true, lastDealDiff: 6, score: 4, cents: 0 },
                { name: 'PlayerB', present: true, playing: true, lastDealDiff: -6, score: -11, cents: 8 },
                { name: 'PlayerC', present: true, playing: true, lastDealDiff: 6, score: 5, cents: 0 },
                { name: 'PlayerD', present: true, playing: true, lastDealDiff: -6, score: -2, cents: 3 },
                { name: 'PlayerE', present: true, playing: false, lastDealDiff: null, score: -1, cents: 3 },
                { name: 'PlayerF', present: false, playing: false, lastDealDiff: null, score: -3, cents: 4 },
            ],
            dealerName: 'PlayerE',
            useBock: true,
            bockPreview: { 'single': 1, 'double': 0, 'triple': 0 },
            isMandatorySolo: false,
            totalCash: 24,
            absentPlayerCents: 7,
            writerId: 'aaaaaa'
        }

        const { container } = render(<BrowserRouter><Writer data={data} /></BrowserRouter>)

        const mandatorySoloButton = container.querySelector('.mandatorySoloButton')
        expect(mandatorySoloButton).not.toBeDisabled()

        const currentBockStatus = container.querySelector('#currentBockStatus')
        expect(currentBockStatus).toHaveTextContent('Bock')

        const bockPreviewTriple = container.querySelector('#bockPreviewTriple')
        expect(bockPreviewTriple).toHaveTextContent('0')

        const bockPreviewDouble = container.querySelector('#bockPreviewDouble')
        expect(bockPreviewDouble).toHaveTextContent('0')

        const bockPreviewSingle = container.querySelector('#bockPreviewSingle')
        expect(bockPreviewSingle).toHaveTextContent('1')
    })

    test('renders the content: no popping possible', () => {
        const data = {
            deploymentUrl: 'http://localhost:3001',
            readerId: 'bbbbbb',
            creationDate: 1679695174984,
            poppableEntry: null,
            playerData: [
                { name: 'PlayerA', present: true, playing: true, lastDealDiff: 6, score: 4, cents: 0 },
                { name: 'PlayerB', present: true, playing: true, lastDealDiff: -6, score: -11, cents: 8 },
                { name: 'PlayerC', present: true, playing: true, lastDealDiff: 6, score: 5, cents: 0 },
                { name: 'PlayerD', present: true, playing: true, lastDealDiff: -6, score: -2, cents: 3 },
                { name: 'PlayerE', present: true, playing: false, lastDealDiff: null, score: -1, cents: 3 },
                { name: 'PlayerF', present: false, playing: false, lastDealDiff: null, score: -3, cents: 4 },
            ],
            dealerName: 'PlayerE',
            useBock: true,
            bockPreview: { 'single': 0, 'double': 0, 'triple': 0 },
            isMandatorySolo: false,
            totalCash: 224,
            absentPlayerCents: 7,
            writerId: 'aaaaaa'
        }

        const { container } = render(<BrowserRouter><Writer data={data} /></BrowserRouter>)

        const popButton = container.querySelector('.popButton')
        expect(popButton).toBeDisabled()
    })
})
