import { PropTypes } from 'prop-types'
import Plot from 'react-plotly.js'
import { useEffect, useState } from 'react'

const NarrowPlot = ({ playerData, closeAction }) => {

    const x = playerData[0].history.map((value, index) => index + 1)

    const plotlyData = playerData.map(player => {
        return {
            x: x,
            y: player.history,
            type: 'scatter',
            mode: 'lines',
            name: player.name
        }
    })

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    useEffect(() => {
        const handleWindowResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    const availableHeight = Math.floor(height * 0.9) - 120
    const availableWidth = Math.floor(width * 0.8)

    const dtick = Math.max(1, Math.floor(playerData[0].history.length / 5))

    return (
        <>
            <div className="darkBG overlayOutside" onClick={closeAction} />
            <div className="narrow plot_overlayBox">
                <div className="narrow plot_overlayContent manuallySpaced">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
                            <Plot
                                data={plotlyData}
                                layout={{
                                    margin: {
                                        l: 50,
                                        t: 20,
                                        r: 50,
                                        b: 20,
                                    },
                                    legend: {
                                        itemclick: false,
                                        itemdoubleclick: false,
                                    },
                                    modebar: {
                                        remove: ['autoScale2d', 'lasso2d', 'pan2d', 'select2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d'],
                                    },
                                    autosize: false,
                                    width: availableHeight,
                                    height: availableWidth,
                                    xaxis: {
                                        dtick: dtick,
                                    }
                                }}
                                config={{
                                    doubleClick: 'reset',
                                    responsive: true,
                                }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button className="narrow overlayButton manuallySpaced" id="plot_OkButton" onClick={closeAction}>OK</button>
                </div>
            </div>
        </>
    )
}

NarrowPlot.displayName = 'NarrowPlot'

NarrowPlot.propTypes = {
    demo: PropTypes.shape({
        playerData: PropTypes.object,
    }),
}

export default NarrowPlot
