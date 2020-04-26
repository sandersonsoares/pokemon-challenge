import { api } from '../config/api';

const LIMIT_REGISTERS = 30;

export const pokemons = async (offset = 0) => {
    return api().get(`/pokemon`, { params: { offset, limit: LIMIT_REGISTERS } });
};

export const pokemon = async (id) => {
    return api().get(`/pokemon/${id}`);
};

export const types = async () => {
    return api().get(`/type`);
};

export const pokemonsByType = async (typeId) => {
    return api().get(`/type/${typeId}`);  
};

export const ability = async (ability) => {
    return api().get(`/ability/${ability}`);  
};
