import React from 'react';
import ReactDOM from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './styles.css';
import App from './App';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChess,
  faArrowLeft,
  faArrowRight,
  faFastBackward,
  faFastForward,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import ReactGA from 'react-ga4';

library.add(
  faChess,
  faArrowLeft,
  faArrowRight,
  faFastBackward,
  faFastForward,
  faSyncAlt
);

// Initialize Google Analytics with Measurement ID from environment variable
ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </React.StrictMode>
);