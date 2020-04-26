import * as axios from 'axios';

// Recuperação da URL correta de acordo com o ambiente
const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Criação de instância de axios para API
 */
const api = () => {
    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return instance;
};

export { api };
