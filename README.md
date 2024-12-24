# ♟️ Guess the Elo ♟️

A fun and challenging web application where you can test your chess skills by guessing the Elo ratings of players based on a game!

**Live Demo:** [Insert link to your deployed app here, if available]

## ✨ Overview

This project is a full-stack web application built with **React** on the frontend and **FastAPI** on the backend. It uses a database of chess games from [Lichess.org](https://lichess.org/) to present you with a random game, move by move. Your task is to analyze the game and guess the Elo ratings of both the white and black players.

💡 **How it Works:**

1. A random game is fetched from the Lichess database.
2. You see the chessboard and can navigate through the moves of the game.
3. After observing the game, you enter your Elo guesses for the white and black players.
4. The app reveals the actual Elo ratings and calculates your score based on the accuracy of your guesses.

## 🌟 Features

*   **Engaging Gameplay:** Test your chess knowledge and intuition by analyzing real games.
*   **Slick and Minimalistic UI:** A clean and user-friendly interface built with Tailwind CSS.
*   **Responsive Design:**  Plays well on desktop and mobile devices.
*   **Error Handling:**  Provides helpful feedback for invalid input or network issues.
*   **Scoring System:**  Tracks your performance and challenges you to improve.
*   **Backend API:**  A robust FastAPI backend handles game retrieval and data processing.
*   **PostgreSQL Database:** Stores a large dataset of Lichess games for a wide variety of gameplay.
*   **Continuous Improvement:**  Future enhancements planned, including time-based scoring, difficulty levels, and more!

## 🗂️ Project Structure

This repository contains both the frontend and backend code:

```
guess-the-elo/
├── app/                 # Backend (FastAPI)
│   ├── __init__.py      # Makes the 'app' directory a Python package
│   ├── database.py      # Database connection and setup using SQLAlchemy
│   ├── main.py          # Main FastAPI application file (entry point)
│   ├── models.py        # SQLAlchemy database models (defining the 'games' table)
│   ├── routers/         # API endpoints (organized by resource)
│   │   ├── __init__.py
│   │   └── games.py     # Endpoints related to games (/games, /games/{game_id})
│   ├── schemas.py       # Pydantic models for request/response validation and documentation
│   └── services/        # Business logic (functions that interact with the database)
│       ├── __init__.py
│       └── game_service.py # Functions for retrieving random games and game details
├── guess-the-elo-frontend/   # Frontend (React)
│   ├── public/          # Static assets (HTML, icons, etc.)
│   │   └── index.html   # Main HTML template for the React app
│   ├── src/             # Source code for the React application
│   │   ├── components/  # Reusable UI components
│   │   │   ├── Game.js    # Main component for game display, logic, and state
│   │   │   ├── Board.js   # Renders the chessboard using chessboardjsx
│   │   │   └── EloGuess.js# Handles Elo input, submission, and validation
│   │   ├── App.js       # Main application component (root of the component tree)
│   │   ├── index.js     # Entry point for the React application
│   │   └── api.js       # Functions for making API requests to the backend
│   ├── package.json     # Frontend dependencies and build scripts
│   └── ...              # Other React-related files (e.g., configuration)
├── .env                 # Environment variables (for sensitive data like database credentials - keep this out of version control!)
├── .gitignore           # Specifies files and folders to be ignored by Git
├── load_pgn.py          # Python script to load PGN data into the PostgreSQL database
├── requirements.txt     # Backend Python dependencies
├── tailwind.config.js   # Tailwind CSS configuration file
└── ...                  # Other project files (e.g., README.md, LICENSE)
```

## 🛠️ Setup and Installation

**Prerequisites:**

*   **Node.js** (v16 or later recommended) and **npm** (or Yarn) for the frontend.
*   **Python** (v3.9 or later recommended) and **pip** for the backend.
*   **PostgreSQL** database server.

**Steps:**

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd guess-the-elo
    ```

2. **Backend Setup:**

    *   **Create a virtual environment:**

        ```bash
        python3 -m venv .venv
        ```

    *   **Activate the virtual environment:**

        *   On Windows:

            ```bash
            .venv\Scripts\activate
            ```

        *   On macOS/Linux:

            ```bash
            source .venv/bin/activate
            ```

    *   **Install dependencies:**

        ```bash
        pip install -r requirements.txt
        ```

    *   **Create a `.env` file in the project root:**

        ```
        DB_HOST=your_db_host
        DB_NAME=your_db_name
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        ```

        Replace the placeholders with your actual PostgreSQL database credentials.

    *   **Create the database and tables:**

        *   Make sure your PostgreSQL server is running.
        *   Run the following command in your terminal:

        ```bash
        python app/main.py
        ```

        (This will execute `Base.metadata.create_all(bind=engine)` which creates the necessary tables).

    *   **Load Data (Optional):**
        *   Download a `.pgn.zst` file from the [Lichess database](https://database.lichess.org/).
        *   Decompress the file using `pzstd -d <filename>.pgn.zst`.
        *   Run the data loading script:

            ```bash
            python load_pgn.py <filename>.pgn
            ```

            **Note:** Loading a large PGN file can take a significant amount of time.

3. **Frontend Setup:**

    *   Navigate to the frontend directory:

        ```bash
        cd guess-the-elo-frontend
        ```

    *   Install dependencies:

        ```bash
        npm install
        ```

        (or `yarn install` if you are using Yarn).

## ▶️ Running the Application

1. **Start the Backend Server:**

    *   Make sure your virtual environment is activated.
    *   From the project root directory, run:

        ```bash
        uvicorn app.main:app --reload
        ```

    *   The backend server will typically start on `http://localhost:8000`.

2. **Start the Frontend Development Server:**

    *   Open a new terminal window or tab.
    *   Navigate to the frontend directory: `cd guess-the-elo-frontend`
    *   Run:

        ```bash
        npm start
        ```

        (or `yarn start`).

    *   The frontend development server will usually start on `http://localhost:3000`.

3. **Open your browser and go to `http://localhost:3000` to play!**

## 🧪 Testing

*   **Backend Tests:**
    *   The backend includes unit tests using `pytest`. You can run them from the project root using:

        ```bash
        pytest
        ```

## 🚀 Future Enhancements

*   **Time-Based Scoring:** Incorporate the time taken to guess into the scoring algorithm.
*   **Difficulty Levels:** Allow users to select different difficulty levels, perhaps by filtering games based on Elo ranges.
*   **User Accounts:** Implement user accounts to track progress, save scores, and enable leaderboards.
*   **Advanced Game Analysis:** Provide more in-depth analysis of the game, such as engine evaluations or common opening variations.
*   **Mobile App:** Develop a mobile app version for on-the-go gameplay.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or bug fixes, please feel free to open an issue or submit a pull request.

## 🙏 Acknowledgements

*   [Lichess.org](https://lichess.org/) for providing the open game database.
*   [React](https://reactjs.org/) for the frontend framework.
*   [FastAPI](https://fastapi.tiangolo.com/) for the backend framework.
*   [Tailwind CSS](https://tailwindcss.com/) for styling.
*   [chessboardjsx](https://github.com/willb335/chessboardjsx) for the chessboard component.
*   [chess.js](https://github.com/jhlywa/chess.js) for chess logic.
*   [react-dnd](https://react-dnd.github.io/react-dnd/) for drag-and-drop functionality.

## 📝 License

This project is licensed under the [MIT License](LICENSE).