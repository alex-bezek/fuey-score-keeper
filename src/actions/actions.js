import * as types from './types';

export const advancePhase = () => {
  return {
    type: types.ADVANCE_PHASE,
  }
};

export const setBid = (bid, roundNumber, playerId) =>({
  type: types.SET_BID,
  bid: bid,
  roundNumber: roundNumber,
  playerId: playerId
});

export const setTricksTaken = (tricksTaken, roundNumber, playerId) =>({
  type: types.SET_TRICKS_TAKEN,
  tricksTaken: tricksTaken,
  roundNumber: roundNumber,
  playerId: playerId
});
