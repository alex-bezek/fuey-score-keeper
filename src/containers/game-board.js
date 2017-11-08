import { connect } from 'react-redux';
import { advancePhase } from '../actions/actions';
import GameBoard from '../components/game-board';

const mapStateToProps = state => {
  return {
    currentRoundNumber: state.currentRound.currentRoundNumber,
    currentRoundGoingUp: state.currentRound.currentRoundGoingUp,
    players: state.players,
    currentPhase: state.currentPhase,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onNextRoundClick: () => {
      dispatch(advancePhase())
    }
  }
}

const GameBoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameBoard)

export default GameBoardContainer
