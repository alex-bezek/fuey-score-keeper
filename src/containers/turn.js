import { connect } from 'react-redux';
import { setBid, setTricksTaken } from '../actions/actions';
import Turn from '../components/turn';

const mapStateToProps = (state, ownProps) => {
  const { roundNumber, playerId } = ownProps;
  return {
    isCurrentRound: state.currentRound.currentRoundNumber === roundNumber,
    currentPhase: state.currentPhase,
    bid: state.roundBids[roundNumber] && state.roundBids[roundNumber][playerId],
    tricksTaken: state.roundTricksTaken[roundNumber] && state.roundTricksTaken[roundNumber][playerId],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onBidChange: (bidAmount) => {
      dispatch(setBid(bidAmount, ownProps.roundNumber, ownProps.playerId))
    },
    onTricksTakenChange: (tricksTakenAmount) => {
      dispatch(setTricksTaken(tricksTakenAmount, ownProps.roundNumber, ownProps.playerId))
    }
  }
}

const TurnContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Turn)

export default TurnContainer
