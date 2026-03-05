import { BrowserRouter, Routes, Route } from 'react-router-dom'

import NewGameLanding from './components/NewGameLanding'
import WriterLanding from './components/WriterLanding'
import ReaderLanding from './components/ReaderLanding'

const App = () => (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Routes>
            <Route path="/writer/:id" element={<WriterLanding />} />
            <Route path="/:id" element={<ReaderLanding />} />
            <Route path="/" element={<NewGameLanding />} />
        </Routes>
    </BrowserRouter>
)

export default App
