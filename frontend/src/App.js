import React from "react";
import Game from "./components/Game";
import Footer from "./components/Footer";
import "./styles.css";

const App = () => {
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