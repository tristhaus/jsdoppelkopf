import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Reader from './Reader'

const data = {
    'deploymentUrl': 'http://localhost:3001',
    'readerId': 'bbbbbb',
    'creationDate': 1679695174984,
    'poppableEntry': 'deal',
    'playerData': [
        { 'name': 'Player A', 'present': true, 'playing': true, 'lastDealDiff': 6, 'score': 6, 'cents': 0 },
        { 'name': 'Player B', 'present': true, 'playing': true, 'lastDealDiff': -6, 'score': -6, 'cents': 6 },
        { 'name': 'Player C', 'present': true, 'playing': true, 'lastDealDiff': 6, 'score': 6, 'cents': 0 },
        { 'name': 'Player D', 'present': true, 'playing': true, 'lastDealDiff': -6, 'score': -6, 'cents': 6 }
    ],
    'dealerName': 'Player A',
    'bockPreview': { 'single': 0, 'double': 0, 'triple': 0 },
    'isMandatorySolo': false,
    'totalCash': 24,
    'absentPlayerCents': 3,
}

describe('reader view unit tests', () => {

    test('renders correct content', () => {
        const { container } = render(<Reader readerId={data.readerId} data={data} />)

        const readerIdSpan = container.querySelector('#reader-readerId')

        expect(readerIdSpan).toHaveTextContent('bbbbbb')
    })

})
