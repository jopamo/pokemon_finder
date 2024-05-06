import axios from 'axios';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

export const fetchPokemon = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
};
