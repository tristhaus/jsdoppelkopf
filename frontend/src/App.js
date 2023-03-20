import {
    BrowserRouter as Router,
    Routes, Route
} from 'react-router-dom'

import NewGame from './NewGame'
import WriterEntry from './components/WriterEntry'
import ReaderEntry from './components/ReaderEntry'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/writer/:id" element={<WriterEntry />} />
                <Route path="/:id" element={<ReaderEntry />} />
                <Route path="/" element={<NewGame />} />
            </Routes>
        </Router>
    )
}

export default App
