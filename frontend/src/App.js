import React from 'react';
import Game from './components/Game';
import './styles.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>Guess the Elo</h1>
      <Game />
    </div>
  );
};

export default App;