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

// maxRoundCount = 4
//   round = 2 : returns 3
//
// maxRoundCount = 4
//   round = 3 : returns 4
//
// maxRoundCount = 4
//   round = 4 : returns 4
//
// maxRoundCount = 4
//   round = 5 : returns 3
// in this case, round is 0 indexed as if from a map index
const calculateLogicalRound = (round, maxRoundCount) => {
   const x = (round + 1 <= maxRoundCount) ?
  (round + 1)
  :
  // Add 1 for the extra round spent at maxRoundCount (2 rounds at 10, 1 going up, 1 going down)
  // Add 1 since round is 0 indexed as its the map index, but maxRoundCount and round calculations are 1 indexed
  // ???
  (maxRoundCount + maxRoundCount - round);
  return x;
}

const GameBoard = (props) => {
  const {
    currentRoundNumber,
    currentRoundId,
    onNextRoundClick,
    players,
    currentRoundGoingUp,
    currentPhase,
    maxRoundCount,
  } = props;

  const playerIds = players.map(player => player.id);
  const goingUpWord = currentRoundGoingUp ? 'Up' : 'Down';

  return (
    <div>
      <h2>
        { `Round ${currentRoundNumber} of ${maxRoundCount} Going ${goingUpWord}` }
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
           // currentRoundNumber and maxRoundCount is 1 indexed
           [...Array(currentRoundGoingUp ? currentRoundNumber : (maxRoundCount + maxRoundCount - currentRoundNumber + 1)).keys()].map((round) => {
             const logicalRound = calculateLogicalRound(round, maxRoundCount);
             return(
               <Round
                 key={'round_' + round}
                 playerIds={playerIds}
                 roundId={round}
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
