import { PropTypes } from 'prop-types'
import React from 'react'
import { addPresentOrAbsent } from './Score'

const WideStatistics = ({ playerData, closeAction }) => {

    const okAction = () => {
        closeAction()
    }

    return (
        <>
            <div className="darkBG overlayOutside" onClick={() => { closeAction() }} />
            <div className="statistics_overlayBox">
                <div className="statistics_overlayContent">
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='statistics_playerNameLabel'>Name</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_name_${player.name}`} className={addPresentOrAbsent('statistics_playerName', player)}>{player.name}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'>Gewonnen</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_numWin_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.numWin}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'>Verloren</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_numLoss_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.numLoss}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'># Spiele</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_num_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.num}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'># +Solo</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_numWonSolo_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.numWonSolo}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'># -Solo</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_numLostSolo_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.numLostSolo}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'>Solo Punkte</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_soloScore_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.soloScore}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'>Höchstes +</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_maxWin_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.maxWin}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'>Höchstes -</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_maxLoss_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.maxLoss}</td>))}
                                </tr>
                                <tr>
                                    <td className='statistics_dataLabel'>Höchstes -</td>
                                    {playerData.map(player => (<td key={player.name} id={`statistics_noBockScore_${player.name}`} className={addPresentOrAbsent('statistics_data', player)}>{player.noBockScore}</td>))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <button className="overlayButton" id="statitistics_OkButton" onClick={okAction}>OK</button>
                </div>
            </div>
        </>
    )
}

WideStatistics.displayName = 'WideStatistics'

WideStatistics.propTypes = {
    demo: PropTypes.shape({
        playerData: PropTypes.object,
    }),
}

export default WideStatistics