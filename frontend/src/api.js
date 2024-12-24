import axios from 'axios';

const API_URL = 'http://0.0.0.0:8000';

export const getRandomGame = async () => {
  try {
    const response = await axios.get(`${API_URL}/games/random`);
    // Or using fetch:
    // const response = await fetch(`${API_URL}/games/random`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random game:', error);
    throw error;
  }
};

export const getGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}`);
    // Or using fetch:
    // const response = await fetch(`${API_URL}/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for game ${gameId}:`, error);
    throw error;
  }
};