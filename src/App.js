import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Store from './store/store';

import GameBoardContainer from './containers/game-board';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Provider store={Store}>
          <GameBoardContainer />
        </Provider>
      </div>
    );
  }
}

export default App;
