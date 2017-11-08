import { combineReducers, reduceReducers } from 'redux';
import { SET_BID, ADVANCE_PHASE, SET_TRICKS_TAKEN } from '../actions/types';
import { PHASE_TYPES } from '../constants';

const defaultRound = {
  currentRoundNumber: 1,
  currentRoundGoingUp: true
};

export const currentRound = (state = defaultRound,) => ( state );

export const players = (state = []) => { return state; };
export const roundGoingUp = (state = true) => { return state; };
// Just used for default state
export const currentPhase = (state = PHASE_TYPES.bidding, action) => { return state; };

const setRoundValue = (state, newValue, roundNumber, playerId) => {
  if(newValue > roundNumber) {
    return state; // TODO: do some async thunk stuff to set a value in store and show a warning message
  }
  return {
    ...state,
    [roundNumber]: {
      ...state[roundNumber],
      [playerId]: parseInt(newValue, 10)
    },
  };
}

export const roundBids = (state = {}, action) => {
  switch (action.type) {
    case SET_BID:
      return setRoundValue(state, action.bid, action.roundNumber, action.playerId);
    default:
      return state;
  }
};

export const roundTricksTaken = (state = {}, action) => {
  switch (action.type) {
    case SET_TRICKS_TAKEN:
      return setRoundValue(state, action.tricksTaken, action.roundNumber, action.playerId);
    default:
      return state;
  }
};

// Generic method to take an object of round values (bids, scores, tricks taken, etc)
// and just makes sure there is an entry for each person.
const doesRoundContainEntriesFromAllPlayers = (roundValues, playerIds) => {
  // If there are no bids or tricks taken yet, the round might be null
  if(roundValues === undefined) {
    return false;
  }
  // Make sure to convert keys to int's to match player id's
  const playerIdsInThisSet = Object.keys(roundValues).map(key => (parseInt(key, 10)));
  const doAllPlayersHaveValues = playerIds.every(playerId => {
    return playerIdsInThisSet.includes(playerId);
  })
  return doAllPlayersHaveValues;
}

// Check that for this round, in the roundBids, there is an entry for each playerId
//
// @thisRoundsBids: Object where keys are userIds and values are bids
const isBiddingDone = (thisRoundsBids, roundNumber, playerIds) => {
  const didAllPlayersPlacedBids = doesRoundContainEntriesFromAllPlayers(thisRoundsBids, playerIds);
  // If they didnt' all place bids, return false. We need them to all bid
  if(!didAllPlayersPlacedBids) {
    return false
  }

  // TODO: DO this. Need to figure out if we split into multiple functions depending on how we
  // want to handle displaying the error to the user.
  // If we reached here, then all players have placed bids. So check the round number
  // at round 4 and higher we have to do more checks so if its under that, we are good
  // if(roundNumber < 4) {
  //   return true
  // }
  return true;
}

// Reducers that have to do logic based off the whole tree can go here
const crossSliceReducer = (state, action) => {
    switch(action.type) {
      case ADVANCE_PHASE:
        if(state.currentPhase === PHASE_TYPES.bidding) {
          // If bidding is done, flip the phase to taking. Otherwise leave it. TODO: Would be to show an error
          if(isBiddingDone(state.roundBids[state.currentRound.currentRoundNumber], state.currentRound.currentRoundNumber, state.players.map(player => (player.id)))){
            return { ...state, currentPhase: PHASE_TYPES.taking }
          }
        } else {
          if(doesRoundContainEntriesFromAllPlayers(state.roundTricksTaken[state.currentRound.currentRoundNumber], state.players.map(player => (player.id)))){
            return {
              ...state,
              currentRound: {
                currentRoundNumber: state.currentRound.currentRoundNumber + 1,
                "currentRoundGoingUp": true, // TODO: Make this change based on the round
              },
              currentPhase: PHASE_TYPES.bidding
            }
          }
        }

      default : return state;
    }
}

const combinedReducer = combineReducers({
  currentRound,
  players,
  roundGoingUp,
  currentPhase,
  roundBids,
  roundTricksTaken,
})


const rootReducer = (state, action) => {
    const intermediateState = combinedReducer(state, action);
    const finalState = crossSliceReducer(intermediateState, action);
    return finalState;
}

export default rootReducer;
