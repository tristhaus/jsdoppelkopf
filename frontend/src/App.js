import { useState } from 'react'

import Answer from './components/Answer'

import demoService from './services/demo'

const App = () => {
    const [demo, setDemo] = useState(null)

    const handleGetAnswerClick = async () => {
        const response = await demoService.obtain()

        if (response) {
            console.log('response', response)
            setDemo(response)
        }
    }

    const initial = () => (
        <div>
            <h2>Demo</h2>
            <hr />
            <button onClick={handleGetAnswerClick}>Get answer</button>
        </div>
    )

    const answer = () => (
        <div>
            <h2>Demo</h2>
            <hr />
            <Answer demo={demo} />
        </div>
    )

    if (demo) {
        return answer()
    }
    else {
        return initial()
    }
}

export default App
