import { connect } from 'react-redux';
import { setBid, setTricksTaken } from '../actions/actions';
import Turn from '../components/turn';

const mapStateToProps = (state, ownProps) => {
  const { roundNumber, playerId, roundId } = ownProps;
  return {
    isCurrentRound: state.currentRound.currentRoundId === roundId,
    currentPhase: state.currentPhase,
    bid: state.roundBids[roundId] && state.roundBids[roundId][playerId],
    tricksTaken: state.roundTricksTaken[roundId] && state.roundTricksTaken[roundId][playerId],
    score: state.roundScores[roundId] && state.roundScores[roundId][playerId],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onBidChange: (bidAmount) => {
      dispatch(setBid(bidAmount, ownProps.roundNumber, ownProps.roundId, ownProps.playerId))
    },
    onTricksTakenChange: (tricksTakenAmount) => {
      dispatch(setTricksTaken(tricksTakenAmount, ownProps.roundNumber, ownProps.roundId, ownProps.playerId))
    }
  }
}

const TurnContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Turn)

export default TurnContainer
