# ♟️ EloGuessr ♟️

A fun and challenging web application where you can test your chess skills by guessing the Elo ratings of players based on their games!

🔸 **STATUS:** FIRST RELEASE 🔸 

**First on the to-do list: Add more (normalized\*) data.**

*\*normalized in this context would mean equal probabilities for different ranges of ELOs to be picked randomly, given the skewness on Lichess*

## ✨ Overview

This project is a full-stack web application built with **React** on the frontend and **FastAPI** on the backend. It uses a database of chess games from [Lichess.org](https://lichess.org/) to present you with a random game, move by move. Your task is to analyze the game and guess the Elo ratings of both the white and black players. After each game, you can share on your socials how well you did! The live version of the app can be found at [eloguessr.live](https://eloguessr.live).

💡 **How it Works:**

1. A random game is fetched from the Lichess database.
2. You see the chessboard and can navigate through the moves of the game.
3. After observing the game, you enter your Elo guesses for the white and black players.
4. The app reveals the actual Elo ratings and calculates your score based on the accuracy of your guesses.
5. **Share your score!** You can copy your results to your clipboard and share your score on social media.

## 🌟 Features

*   **Engaging Gameplay:** Test your chess knowledge and intuition by analyzing real games.
*   **Social Sharing:** Share your scores with your friends and followers on social media!
*   **Slick and Minimalistic UI:** A clean and user-friendly interface built with Tailwind CSS.
*   **Responsive Design:** Plays well on desktop and mobile devices.
*   **Error Handling:** Provides helpful feedback for invalid input or network issues.
*   **Scoring System:** Tracks your performance and challenges you to improve.
*   **Backend API:** A robust FastAPI backend handles game retrieval and data processing.
*   **PostgreSQL Database:** Stores a large dataset of Lichess games for a wide variety of gameplay.
*   **Continuous Improvement:** Future enhancements planned, including time-based scoring, difficulty levels, and more!

## 🗂️ Project Structure

This repository contains both the frontend and backend code:

```
rating-guessr/
├── .dockerignore # Specifies files and folders to be ignored by Docker
├── .env # Environment variables (for sensitive data like database credentials - keep this out of version control!)
├── .gitignore # Specifies files and folders to be ignored by Git
├── backend/ # Backend (FastAPI)
│   ├── __init__.py # Makes the 'app' directory a Python package
│   ├── database.py # Database connection and setup using SQLAlchemy
│   ├── main.py # Main FastAPI application file (entry point)
│   ├── models.py # SQLAlchemy database models (defining the 'games' table)
│   ├── routers/ # API endpoints (organized by resource)
│   │   ├── __init__.py
│   │   └── games.py # Endpoints related to games (/games, /games/{game_id})
│   ├── schemas.py # Pydantic models for request/response validation and documentation
│   ├── services/ # Business logic (functions that interact with the database)
│   │   ├── __init__.py
│   │   └── game_service.py # Functions for retrieving random games and game details
│   └── wait_for_db.py
├── docker-compose.yml # Docker Compose configuration file
├── Dockerfile.backend # Dockerfile for the backend
├── Dockerfile.frontend # Dockerfile for the frontend
├── frontend/ # Frontend (React)
│   ├── package-lock.json
│   ├── package.json # Frontend dependencies and build scripts
│   ├── public/ # Static assets (HTML, icons, etc.)
│   │   └── index.html # Main HTML template for the React app
│   ├── src/ # Source code for the React application
│   │   ├── App.js # Main application component (root of the component tree)
│   │   ├── api.js # Functions for making API requests to the backend
│   │   ├── components/ # Reusable UI components
│   │   │   ├── Board.js # Renders the chessboard using chessboardjsx
│   │   │   ├── EloGuess.js# Handles Elo input, submission, and validation
│   │   │   ├── Footer.js
│   │   │   ├── Game.js # Main component for game display, logic, state, and sharing
│   │   │   └── Modal.js # Modal component for "About" and "Support" info
│   │   ├── index.js # Entry point for the React application
│   │   └── styles.css
│   └── tailwind.config.js # Tailwind CSS configuration file
├── load_pgn.py # Python script to load PGN data into the PostgreSQL database
├── nginx.conf # Nginx configuration file
└── requirements.txt # Backend Python dependencies
```


## 🛠️ Setup and Installation

### Local Development

**Prerequisites:**

*   **Node.js** (v16 or later recommended) and **npm** (or Yarn) for the frontend.
*   **Python** (v3.9 or later recommended) and **pip** for the backend.
*   **PostgreSQL** database server (running locally).

**Steps:**

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd eloguessr
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
        DB_HOST=localhost # Assuming PostgreSQL is running locally
        DB_NAME=your_db_name
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        FRONTEND_API_BASE_URL=http://localhost:3000/api/
        ```

        Replace the placeholders with your actual PostgreSQL database credentials.

    *   **Create the database and tables:**

        *   Make sure your PostgreSQL server is running locally.
        *   Run the following command in your terminal:

            ```bash
            python backend/main.py
            ```

3. **Frontend Setup:**

    *   Navigate to the frontend directory:

        ```bash
        cd frontend
        ```

    *   Install dependencies:

        ```bash
        npm install
        ```

        (or `yarn install` if you are using Yarn).
    *   Create a `.env.frontend` file in the `frontend` directory:

        ```
        REACT_APP_API_BASE_URL=http://localhost:8000/
        ```
        This ensures that the frontend dev server will communicate with the backend dev server.

4. **Running the Application Locally:**

    1. **Start the Backend Server:**

        *   Make sure your virtual environment is activated.
        *   From the project root directory, run:

            ```bash
            uvicorn backend.main:app --reload
            ```

        *   The backend server will typically start on `http://localhost:8000`.

    2. **Start the Frontend Development Server:**

        *   Open a new terminal window or tab.
        *   Navigate to the `frontend` directory: `cd frontend`
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

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or bug fixes, please feel free to open an issue or submit a pull request.

### Best Practices for Contributions

To keep the codebase clean, organized, and easy to navigate, follow these best practices when naming branches and commits:

#### Branch Naming

* Use **descriptive and concise names** that reflect the purpose of the branch.

Examples:
* `feature/add-user-authentication`
* `bugfix/fix-chessboard-render-issue`
* `hotfix/update-readme`

Common branch types:
* **feature/**: New features or enhancements.
* **bugfix/**: Fixes for known bugs.
* **hotfix/**: Critical fixes requiring immediate attention.
* **refactor/**: Code improvements without changing functionality.
* **docs/**: Updates to documentation.
* **test/**: Adding or improving tests.

#### Commit Message Guidelines

* Write **clear and meaningful messages** that explain what the commit does.

Example: `fix: resolve broken API endpoint for game retrieval`

**Types** commonly used in commit messages:
* `feat`: Adding a new feature.
* `fix`: Fixing a bug.
* `refactor`: Code restructuring or optimization.
* `docs`: Documentation updates.
* `test`: Adding or updating tests.
* `chore`: Minor tasks like dependency updates or formatting changes.

* Include a **body** (optional) for more detailed explanations, especially for non-trivial changes.
* Use the **imperative mood** (e.g., "Add tests" instead of "Added tests").

#### Example Commit Messages

* `feat: add Elo guess input validation on frontend`
* `fix: correct database connection issue in production`
* `docs: update README with installation instructions`
* `refactor: simplify chessboard rendering logic`
* `test: add tests for game service functions`

By following these best practices, you'll help ensure that contributions are easier to review and maintain!


## 🙏 Acknowledgements

*   [Lichess.org](https://lichess.org/) for providing the open game database.
*   [chessboardjsx](https://github.com/willb335/chessboardjsx) for the chessboard component.
*   [chess.js](https://github.com/jhlywa/chess.js) for chess logic.

## 📝 License

This project is licensed under the [MIT License](LICENSE).
