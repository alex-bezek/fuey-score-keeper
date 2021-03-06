import React  from 'react';
import PropTypes from 'prop-types';
import TurnContainer from '../containers/turn';

const propTypes = {
  roundId: PropTypes.number.isRequired,
  roundNumber: PropTypes.number.isRequired,
  playerIds: PropTypes.arrayOf(PropTypes.number)
};

// React representation of a full round
const Round = (props) => {
  const { roundId, roundNumber, playerIds } = props;
  return (
    <tr key={'round_tr_' + roundNumber}>
      <th>
        Round: {roundNumber}
      </th>
      {
        playerIds.map((playerId, index) => {
          return(
            <TurnContainer
              key={'turn_' + playerId}
              roundId={roundId}
              roundNumber={roundNumber}
              playerId={playerId}
            />
          );
        })
      }
    </tr>
  );
}

Round.propTypes = propTypes;

export default Round;
