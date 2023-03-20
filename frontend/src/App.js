import {
    BrowserRouter as Router,
    Routes, Route
} from 'react-router-dom'

import NewGameLanding from './components/NewGameLanding'
import WriterLanding from './components/WriterLanding'
import ReaderLanding from './components/ReaderLanding'

const App = () => (
    <Router>
        <Routes>
            <Route path="/writer/:id" element={<WriterLanding />} />
            <Route path="/:id" element={<ReaderLanding />} />
            <Route path="/" element={<NewGameLanding />} />
        </Routes>
    </Router>
)

export default App
