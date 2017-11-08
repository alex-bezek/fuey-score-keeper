import { combineReducers } from 'redux';
import { SET_BID, ADVANCE_PHASE, SET_TRICKS_TAKEN } from '../actions/types';
import { PHASE_TYPES } from '../constants';

const defaultRound = {
  currentRoundNumber: 1,
  currentRoundId: 0,
  currentRoundGoingUp: true
};

export const currentRound = (state = defaultRound,) => ( state );

export const players = (state = []) => { return state; };
export const maxRoundCount = (state = 10) => { return state; };
export const roundGoingUp = (state = true) => { return state; };
export const roundScores = (state = {}) => { return state; };
// Just used for default state
export const currentPhase = (state = PHASE_TYPES.bidding, action) => { return state; };

// Useful for setting a single value in the nested value of a round for a player.
const setRoundValue = (state, newValue, roundNumber, roundId, playerId) => {
  if(newValue > roundNumber) { // TODO: newValue is coming back as a string, but roundNumber is int. Check if that causes issues
    return state; // TODO: do some async thunk stuff to set a value in store and show a warning message
  }
  return {
    ...state,
    [roundId]: {
      ...state[roundId],
      [playerId]: parseInt(newValue, 10)
    },
  };
}

// To set a whole round of values, its much simpler since we can clobber more state.
// this provides just a simpler interface to set the whole round. Its assuming new
// values already match the shape of the tree (object in our cases)
const setRoundValues = (state, newValues, roundNumber) => {
  return {
    ...state,
    [roundNumber]: newValues
  }
}

export const roundBids = (state = {}, action) => {
  switch (action.type) {
    case SET_BID:
      return setRoundValue(state, action.bid, action.roundNumber, action.roundId, action.playerId);
    default:
      return state;
  }
};

export const roundTricksTaken = (state = {}, action) => {
  switch (action.type) {
    case SET_TRICKS_TAKEN:
      return setRoundValue(state, action.tricksTaken, action.roundNumber, action.roundId, action.playerId);
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

const calculateSingleScore = ( previousRoundScore, thisRoundBid, thisRoundTrickTaken) => {
  // TODO: Throw some things if some things are null
  const safePreviousRoundScore = previousRoundScore || 0; // Set to 0 if undefined for first round's calculations

  // They bid fuey
  if(thisRoundBid === 0){
    // And got it so they get 5 points
    if(thisRoundBid === thisRoundTrickTaken){
      return safePreviousRoundScore + 5;
    } else { // They didn't get fuey but their score stays the same
      return safePreviousRoundScore;
    }
  } else { // They bid non fuey
    // And got it so give them 10 plus what they thisRoundBid
    if(thisRoundBid === thisRoundTrickTaken){
      return safePreviousRoundScore + 10 + thisRoundBid;
    } else { // And failed so they lose points
      return safePreviousRoundScore - thisRoundBid;
    }
  }
}

const calculateRoundScores = (previousRoundScores, thisRoundBids, thisRoundTricksTaken) => {
  if(Object.keys(thisRoundBids).length !== Object.keys(thisRoundTricksTaken).length) {
    console.log(`
      previousRoundScores: ${previousRoundScores}
      thisRoundBids: ${thisRoundBids}
      thisRoundTricksTaken: ${thisRoundTricksTaken}
    `);
    throw 'thisRoundBids and thisRoundTricksTaken should be the same size';
  }
  // Returns an object of the values coming back from the function called
  let newRoundScores = {};
  Object.keys(thisRoundBids).forEach (playerId => {
    const previousPlayersRoundScore = previousRoundScores && previousRoundScores[playerId]; // Saftey check for undefined
    newRoundScores[playerId] = calculateSingleScore(previousPlayersRoundScore, thisRoundBids[playerId], thisRoundTricksTaken[playerId])
  })
  return newRoundScores;
}

const calculateNextRound = (currentRound, maxRoundCount, currentRoundId) => {
  // If we are on our last round, and we are going up, then lets go down after. All other cases stay the same
  let nextRoundGoingUp = currentRound.currentRoundGoingUp;
  let nextRoundNumber = currentRound.currentRoundNumber;

  if(currentRound.currentRoundNumber === maxRoundCount) {
      if(currentRound.currentRoundGoingUp) {
        nextRoundGoingUp = false;
      } else {
        nextRoundNumber = currentRound.currentRoundNumber - 1
      }
  } else {
    if(currentRound.currentRoundGoingUp) {
      nextRoundNumber = currentRound.currentRoundNumber + 1
    } else {
      nextRoundNumber = currentRound.currentRoundNumber - 1
    }
  }

  return {
    currentRoundNumber: nextRoundNumber ,
    "currentRoundGoingUp": nextRoundGoingUp,
    "currentRoundId": currentRoundId + 1,
  }
}

// Reducers that have to do logic based off the whole tree can go here
const crossSliceReducer = (state, action) => {
    switch(action.type) {
      case ADVANCE_PHASE:
        if(state.currentPhase === PHASE_TYPES.bidding) {
          // If bidding is done, flip the phase to taking. Otherwise leave it. TODO: Would be to show an error
          if(isBiddingDone(state.roundBids[state.currentRound.currentRoundId], state.currentRound.currentRoundId, state.players.map(player => (player.id)))){
            return { ...state, currentPhase: PHASE_TYPES.taking }
          }
        } else {
          // TODO: Check if its the last round and do something
          if(doesRoundContainEntriesFromAllPlayers(state.roundTricksTaken[state.currentRound.currentRoundId], state.players.map(player => (player.id)))){
            return {
              ...state,
              currentRound: calculateNextRound(state.currentRound, state.maxRoundCount, state.currentRound.currentRoundId),
              currentPhase: PHASE_TYPES.bidding,
              roundScores: {
                ...state.roundScores,
                [state.currentRound.currentRoundId]: calculateRoundScores(
                  state.roundScores && state.roundScores[state.currentRound.currentRoundId - 1],
                  state.roundBids[state.currentRound.currentRoundId],  // TODO: This is getting cray cray, make some variables for gods sake
                  state.roundTricksTaken[state.currentRound.currentRoundId]
                )
              }
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
  roundScores,
  maxRoundCount,
})


const rootReducer = (state, action) => {
    const intermediateState = combinedReducer(state, action);
    const finalState = crossSliceReducer(intermediateState, action);
    return finalState;
}

export default rootReducer;
