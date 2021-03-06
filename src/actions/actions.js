import * as types from './types';

export const advancePhase = () => {
  return {
    type: types.ADVANCE_PHASE,
  }
};

export const setBid = (bid, roundNumber, roundId, playerId) =>({
  type: types.SET_BID,
  bid: bid,
  roundNumber: roundNumber,
  roundId: roundId,
  playerId: playerId
});

export const setTricksTaken = (tricksTaken, roundNumber, roundId, playerId) =>({
  type: types.SET_TRICKS_TAKEN,
  tricksTaken: tricksTaken,
  roundNumber: roundNumber,
  roundId: roundId,
  playerId: playerId
});
