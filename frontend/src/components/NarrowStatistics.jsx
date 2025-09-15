import { PropTypes } from 'prop-types'
import React from 'react'
import { addPresentOrAbsent } from './Score'

const StatisticsColumn = ({ label, playerData, selector, idTemplate, }) => {
    return (
        <div className='narrow statistics_dataColumn'>
            <span className='narrow statistics_dataLabel'>{label}</span>
            {playerData.map(player => (<span key={player.name} id={`${idTemplate}_${player.name}`} className={addPresentOrAbsent('narrow statistics_data', player)}>{selector(player)}</span>))}
        </div>
    )
}

const NarrowStatistics = ({ data, closeAction }) => {
    const playerData = data.playerData
    return (
        <>
            <div className="darkBG overlayOutside" onClick={closeAction} />
            <div className="statistics_overlayBox">
                <div className="statistics_overlayContent">
                    <div className="narrow statistics_tableContainer">
                        <div className="narrow statistics_nameColumn">
                            <span className="narrow statistics_playerNameLabel">Name</span>
                            {playerData.map(player => (<span key={player.name} id={`statistics_name_${player.name}`} className={addPresentOrAbsent('narrow statistics_playerName', player)}>{player.name}</span>))}
                        </div>
                        <div className="narrow statistics_dataColumns">
                            <StatisticsColumn label='Gewonnen' playerData={playerData} selector={player => player.numWin} idTemplate='statistics_numWin' />
                            <StatisticsColumn label='Verloren' playerData={playerData} selector={player => player.numLoss} idTemplate='statistics_numLoss' />
                            <StatisticsColumn label='# Spiele' playerData={playerData} selector={player => player.num} idTemplate='statistics_num' />
                            <StatisticsColumn label='# +Solo' playerData={playerData} selector={player => player.numWonSolo} idTemplate='statistics_numWonSolo' />
                            <StatisticsColumn label='# -Solo' playerData={playerData} selector={player => player.numLostSolo} idTemplate='statistics_numLostSolo' />
                            <StatisticsColumn label='Solo Punkte' playerData={playerData} selector={player => player.soloScore} idTemplate='statistics_soloScore' />
                            <StatisticsColumn label='Höchstes +' playerData={playerData} selector={player => player.maxWin} idTemplate='statistics_maxWin' />
                            <StatisticsColumn label='Höchstes -' playerData={playerData} selector={player => player.maxLoss} idTemplate='statistics_maxLoss' />
                            {data.useBock && <StatisticsColumn label='Ohne Bock' playerData={playerData} selector={player => player.noBockScore} idTemplate='statistics_noBockScore' />}
                        </div>
                    </div>
                    <div>
                        <button className="narrow overlayButton" id="statitistics_OkButton" onClick={closeAction}>OK</button>
                    </div>
                </div>
            </div>
        </>
    )
}

NarrowStatistics.displayName = 'NarrowStatistics'

NarrowStatistics.propTypes = {
    demo: PropTypes.shape({
        playerData: PropTypes.object,
    }),
}

export default NarrowStatistics