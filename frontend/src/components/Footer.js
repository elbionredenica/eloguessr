import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import {
  faCoffee,
  faUser,
  faExternalLinkAlt,
  faDatabase,
  faRocket,
  faLightbulb,
  faHeart,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

const Footer = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <footer className="bg-gray-800 py-4 mt-8 sticky bottom-0 w-full">
      <div className="container mx-auto px-4 text-center text-gray-300">
        <div className="md:flex md:justify-between md:items-center relative">
          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex justify-between items-center w-full">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-300 hover:text-yellow-400 focus:outline-none"
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
            <p className="text-sm">
              © {new Date().getFullYear()} Elbion Redenica.
            </p>
          </div>

          {/* Links (Visible on larger screens or when menu is open) */}
          <div
            className={`${
              showMenu ? "block" : "hidden"
            } md:block absolute bottom-full w-full md:static md:w-auto mt-4 md:mt-0 bg-gray-800`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => {
                  setShowAboutModal(true);
                  setShowMenu(false);
                }}
                className="hover:text-yellow-400 transition duration-200"
              >
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                About
              </button>
              <a
                href="https://github.com/elbionredenica"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition duration-200"
              >
                <FontAwesomeIcon icon={faGithub} className="mr-1" />
                GitHub
              </a>
              <button
                onClick={() => {
                  setShowCoffeeModal(true);
                  setShowMenu(false);
                }}
                className="hover:text-yellow-400 transition duration-200"
              >
                <FontAwesomeIcon icon={faCoffee} className="mr-1" />
                Buy Me a Coffee
              </button>
            </div>
          </div>

          {/* Copyright (Visible on larger screens) */}
          <p className="text-sm mt-4 md:mt-0 hidden md:block">
            © {new Date().getFullYear()} Elbion Redenica.
          </p>
        </div>

        {/* About Me Modal */}
        <Modal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            About the Creator
          </h2>
          <div className="text-gray-300 text-left">
            <p className="mb-4">
              Hey there! 👋 I'm Elbion, a junior at{" "}
              <a
                href="https://www.minerva.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                Minerva University
              </a>
              , diving deep into the world of Computational Sciences. I'm
              concentrating on Machine Learning and Statistics 🤖📊, and when
              I'm not training models or crunching numbers, you can probably
              find me moving pieces on a chessboard or gazing up at the sky,
              admiring airplanes ✈️.
            </p>
            <p className="mb-4">
              I'm an avid chess player ♟️ (though I'd never call myself a
              master-it's been a while since I touched a chess book/resource 😅), and you can challenge me on{" "}
              <a
                href="https://www.chess.com/member/nyctamentlaugh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                Chess.com
              </a>{" "}
              (I'm{" "}
              <span className="font-medium">
               ♘ nyctamentlaugh
              </span>
              )!
            </p>
            <p className="mb-4">
              This project was partially inspired by{" "}
              <a
                href="https://jackli.gg/chessle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                Jack Li's Chessle
              </a>{" "}
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />.
              While he also had the awesome idea of guessing game Elo ratings, I
              thought, "Why not try to guess the players' Elo?" (and their website seemed to not be maintained) 🤔 So, here we
              are!
            </p>
            <p className="mb-4">
              <FontAwesomeIcon icon={faDatabase} className="text-lg mr-2" />
              The data for this app is pulled from the massive{" "}
              <a
                href="https://database.lichess.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                Lichess database
              </a>
              . It's a fantastic resource, but it's good to keep in mind that
              Lichess ratings are a bit different from other systems (like
              FIDE). There's generally some rating inflation, especially at
              certain levels, and not every player has a perfectly calibrated
              rating. So, you might encounter some surprisingly high or low
              ratings here and there! 🤯 
            </p>
            <p className="mb-4">
              <FontAwesomeIcon icon={faRocket} className="text-lg mr-2" />
              Future plans? Oh, I've got plenty! I'm thinking of mixing in some
              in-person games, adding a timer ⏱️ to spice things up (and maybe
              tie it into the scoring somehow), and who knows what else!
            </p>
            <p className="mb-4">
              <FontAwesomeIcon icon={faLightbulb} className="text-lg mr-2" />
              Got ideas or found a bug? Head over to the{" "}
              <a
                href="https://github.com/elbionredenica/guess_elo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                GitHub repo
              </a>{" "}
              and open an issue. And if you want to connect, you can also find
              me on{" "}
              <a
                href="https://www.linkedin.com/in/elbionred/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                LinkedIn
              </a>
              !
            </p>
          </div>
        </Modal>

        {/* Buy Me a Coffee Modal */}
        <Modal isOpen={showCoffeeModal} onClose={() => setShowCoffeeModal(false)}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FontAwesomeIcon icon={faHeart} className="mr-2 text-red-400" />
            Show Some Love 
          </h2>
          <div className="text-gray-300 text-left">
            <p className="mb-4">
              I truly hope you're enjoying the game! If you're feeling generous and want to
              show your appreciation, you can support the project by buying me a
              coffee (or a virtual one! ☕).
            </p>
            <p className="mb-4">
              Your support helps me dedicate more time to developing new
              features and improving the game. Every
              contribution, big or small, is highly appreciated! ❤️
            </p>
            <p>
              If you'd like to contribute, simply click the link below. Thanks a
              bunch! 🙏
            </p>
            <a
              href="https://www.ko-fi.com/elbionredenica" 
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              <FontAwesomeIcon icon={faCoffee} className="mr-2" />
              Support the Project
            </a>
          </div>
        </Modal>
      </div>
    </footer>
  );
};

export default Footer;