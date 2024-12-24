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

library.add(
  faChess,
  faArrowLeft,
  faArrowRight,
  faFastBackward,
  faFastForward,
  faSyncAlt
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </React.StrictMode>
);