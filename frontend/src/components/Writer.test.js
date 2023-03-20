import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Writer from './Writer'

const playerData = [
    { name: 'Player A' },
    { name: 'Player B' },
]

describe('writer view unit tests', () => {

    test('renders correct content', () => {
        const { container } = render(<Writer writerId={'aaaaaa'} readerId={'bbbbbb'} playerData={playerData} />)

        const writerIdSpan = container.querySelector('#writer-writerId')

        expect(writerIdSpan).toHaveTextContent('aaaaaa')

        const readerIdSpan = container.querySelector('#writer-readerId')

        expect(readerIdSpan).toHaveTextContent('bbbbbb')
    })

})
