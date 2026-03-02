import { API_BASE_URL } from "../core/constants.js";

const DEFAULT_LIMIT = 18;

export const fetchPokemon = async (limit = DEFAULT_LIMIT, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?limit=${limit}&offset=${offset}`,
    );

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar Pokémons:", error.message);
    throw error;
  }
};
