import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import gameService from '../services/game'
import PlayerEntry from './PlayerEntry'

const NewGameLanding = () => {
    const [showPlayerEntry, setShowPlayerEntry] = useState(false)

    const [readerId, setReaderId] = useState(null)
    const [writerId, setWriterId] = useState(null)
    const [inputReaderId, setInputReaderId] = useState('')
    const [inputWriterId, setInputWriterId] = useState('')

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleWindowResize = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    const handleNewGameClick = async playerInformation => {
        setWriterId(null)

        const response = await gameService.startGame(playerInformation)

        if (response) {
            setWriterId(response.writerId)
        }
    }

    const handleReaderIdChange = event => {
        setInputReaderId(event.target.value)
    }

    const readerIdButtonIsDisabled = !(/^[rR][A-Za-z]{6}$/.test(inputReaderId))

    const handleReaderIdButton = () => {
        setReaderId(inputReaderId.toUpperCase())
    }

    const handleWriterIdChange = event => {
        setInputWriterId(event.target.value)
    }

    const writerIdButtonIsDisabled = !(/^[wW][A-Za-z]{6}$/.test(inputWriterId))

    const handleWriterIdButton = () => {
        setWriterId(inputWriterId.toUpperCase())
    }

    const banners = [
        { src: 'homer-beer.gif', alt: 'Mmmmmh ... beer.' },
        { src: 'ingo-ohne-flamingo-saufen.gif', alt: 'Ich kann schon wieder laufen!' },
        { src: 'si-w-saufen.gif', alt: 'Saufen, Junge!' },
        { src: 'alcohol-beer.gif', alt: 'Wir haben Pläne' },
        { src: 'dinner-for-one-drink.gif', alt: 'Same procedure as every weekend.' },
        { src: 'drinking-desperate.gif', alt: 'Mama braucht einen Cocktail.' },
        { src: 'drinking-wasted.gif', alt: 'Papa braucht einen Cocktail.' },
    ]

    const bannerIndex = Math.floor(Date.now() / 60000) % banners.length

    const effectiveBannerWidth = Math.min(400, Math.floor(width * 0.9))

    const initial = () => (
        <div>
            <div className="centering">
                <h4>Saufen und Kartenspielen</h4>
                <img src={`banners/${banners[bannerIndex].src}`} width={effectiveBannerWidth} alt={banners[bannerIndex].alt} />
            </div>
            <hr />
            <button onClick={() => setShowPlayerEntry(true)}>Neues Spiel beginnen</button>
            {showPlayerEntry && (<PlayerEntry closeAction={() => setShowPlayerEntry(false)} submitAction={handleNewGameClick} />)}
            <hr />
            <div style={{ display: 'grid', gap: '5px 10px', gridTemplateColumns: 'auto auto auto minmax(0, 1fr)' }}>
                <span>ReaderID</span>
                <input
                    type="text"
                    id="inputReaderId"
                    value={inputReaderId}
                    onChange={handleReaderIdChange}
                />
                <button
                    id="readerIdButton"
                    onClick={handleReaderIdButton}
                    disabled={readerIdButtonIsDisabled}>
                    Zur &apos;Lesen&apos; Seite
                </button>
                <div style={{ gridColumn: '1 / 5' }}>
                    <hr></hr>
                </div>
                <span>WriterID</span>
                <input
                    type="text"
                    id="inputWriterId"
                    value={inputWriterId}
                    onChange={handleWriterIdChange}
                />
                <button
                    id="writerIdButton"
                    onClick={handleWriterIdButton}
                    disabled={writerIdButtonIsDisabled}>
                    Zur &apos;Schreiben&apos; Seite
                </button>
            </div>
            <hr />
            <p className="centering">
                <Link to="datenschutz.html" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</Link>
            </p>
        </div >
    )

    if (writerId) {
        return (
            <Navigate to={`/writer/${writerId}`} replace={true} />
        )
    }
    else if (readerId) {
        return (
            <Navigate to={`/${readerId}`} replace={true} />
        )
    }
    else {
        return initial()
    }
}

export default NewGameLanding
