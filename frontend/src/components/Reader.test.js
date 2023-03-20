import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Reader from './Reader'

const playerData = [
    { name: 'Player A' },
    { name: 'Player B' },
]

describe('reader view unit tests', () => {

    test('renders correct content', () => {
        const { container } = render(<Reader readerId={'bbbbbb'} playerData={playerData} />)

        const readerIdSpan = container.querySelector('#reader-readerId')

        expect(readerIdSpan).toHaveTextContent('bbbbbb')
    })

})
