import React, { useEffect } from "react";
import Game from "./components/Game";
import Footer from "./components/Footer";
import "./styles.css";
import ReactGA from 'react-ga4';

const App = () => {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Game />
      </div>
      <Footer />
    </div>
  );
};

export default App;