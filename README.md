# Fuey Score Keeper

##### The Core Rules
* How many rounds
  * 52 cards in a deck. So the number of rounds is dictated by the number of players
  * By default we also only allow up to 10 rounds
  * rounds =  Math.min(10, Math.floor(52/this.props.numberOfPlayers));
*


#### Redux Store
```js
{
  "currentRound": {
    "currentRoundNumber": 1,
    "currentRoundGoingUp": true,
  },
  "currentPhase": "BIDDING",

  "players": [
    {
      "id": 1,
      "name": "kitty"
    },
    {
      "id": 2,
      "name": "alex"
    },
    {
      "id": 3,
      "name": "lori"
    },
    {
      "id": 4,
      "name": "dale"
    },
  ],
  "roundScores": {
    "1": {            
      "1": 0,         
      "2": 5,
      "3": 11,
      "4": -1
    }
  },
  "roundBids": {
    "1": {            
      "1": 0,         
      "2": 0,
      "3": 1,
      "4": 0
    }
  },
  "roundTricksTaken": {
    "1": {            
      "1": 1,         
      "2": 0,
      "3": 1,
      "4": 0
    }
  }
}
```
