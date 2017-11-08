import React  from 'react';
import PropTypes from 'prop-types';
import { PHASE_TYPES } from '../constants';

const propTypes = {
  roundNumber: PropTypes.number.isRequired,
  roundId: PropTypes.number.isRequired,
  playerId: PropTypes.number.isRequired,

  isCurrentRound: PropTypes.bool.isRequired,
  currentPhase: PropTypes.oneOf(Object.keys(PHASE_TYPES)).isRequired,
  onBidChange: PropTypes.func.isRequired,
  onTricksTakenChange: PropTypes.func.isRequired,
  bid: PropTypes.number,
  tricksTaken: PropTypes.number,
  score: PropTypes.number,
};

const presentValue = (value) => {
  return value === undefined ?
    '' :
    value;
}

// React representation a single players turn of a round
const Turn = (props) => {
  const {
    roundNumber,
    playerId,
    currentPhase,
    isCurrentRound,
    onBidChange,
    onTricksTakenChange,
    bid,
    tricksTaken,
    score,
  } = props;

  return (
    <td>
      <div>
        <input
          type="number"
          name="bid"
          min="0"
          disabled={!isCurrentRound || currentPhase !== PHASE_TYPES.bidding}
          max={roundNumber}
          value={presentValue(bid)}
          onChange={(event) => onBidChange(event.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          name="taken"
          min="0"
          disabled={!isCurrentRound || currentPhase !== PHASE_TYPES.taking}
          max={roundNumber}
          value={presentValue(tricksTaken)}
          onChange={(event) => onTricksTakenChange(event.target.value)}
        />
      </div>
      <div>{score}</div>
    </td>
  )
}

Turn.propTypes = propTypes;

export default Turn;
