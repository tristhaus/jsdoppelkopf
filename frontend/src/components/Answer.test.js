import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Answer from './Answer'

const demo = {
    answer: 1337
}

describe('answer unit tests', () => {

    test('renders correct content', () => {
        const { container } = render(<Answer demo={demo} />)

        const briefDiv = container.querySelector('.completeAnswer')

        expect(briefDiv).toHaveTextContent('Answer: 1337')
    })

})
