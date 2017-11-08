import React from 'react';
import PropTypes from 'prop-types';
import Round from './round';

const propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  currentRoundNumber: PropTypes.number.isRequired,
  onNextRoundClick: PropTypes.func.isRequired,
  currentPhase: PropTypes.string.isRequired,
};

const GameBoard = (props) => {
  const {
    currentRoundNumber,
    onNextRoundClick,
    players,
    currentRoundGoingUp,
    currentPhase
  } = props;

  const playerIds = players.map(player => player.id);
  // 52 cards in a deck. So the number of rounds is dictated by the number of players
  // By default we also only allow up to 10 rounds
  // Logical Round Count where 7 means we play up to 7 and back down
  const maxLogicalRoundCount = Math.min(10, Math.floor(52/players.length));

  return (
    <div>
      <h2>
        { `Round ${currentRoundNumber}` }
      </h2>
     <table>
       <tbody>
         <tr>
           <th>Rounds</th>
           {
             players.map((player) => {
               return (<th key={'playerName_' + player.id}>{player.name}</th>);
             })
           }
         </tr>
         {
           // Round Number is 1 indexed
           [...Array(currentRoundNumber).keys()].map((round) => {
             const logicalRound = currentRoundGoingUp ? (round + 1) : (round + 1 - maxLogicalRoundCount);
             return(
               <Round
                 key={'round_' + logicalRound}
                 playerIds={playerIds}
                 roundNumber={logicalRound}
               />
             );
           })
         }
       </tbody>
     </table>
     <p>Current phase is {currentPhase}.</p>
     <button type="button" onClick={() => { onNextRoundClick()}}>Continue</button>
   </div>
  )
}

GameBoard.propTypes = propTypes;
export default GameBoard;
