const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const getRandomGame = async () => {
  const response = await fetch(`${API_BASE_URL}/games/random`);
  if (!response.ok) {
    throw new Error("Failed to fetch random game");
  }
  return response.json();
};

export const getMoveData = async (game_uuid, move_number) => {
  const response = await fetch(
    `${API_BASE_URL}/games/${game_uuid}/move/${move_number}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch move data");
  }
  return response.json();
};

export const submitGuess = async (game_uuid, whiteGuess, blackGuess) => {
  const response = await fetch(`${API_BASE_URL}/games/${game_uuid}/guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      white_guess: whiteGuess,
      black_guess: blackGuess,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to submit guess");
  }
  return response.json();
};

export const getElo = async (game_uuid) => {
  const response = await fetch(`${API_BASE_URL}/games/${game_uuid}/elo`);
  if (!response.ok) {
    throw new Error("Failed to fetch Elo");
  }
  return response.json();
};