import { strings } from "./strings";

const parsePokemon = (pokemon) => {
    pokemon.id = pokemon.url.split('pokemon')[1].replace(/\//g, '');
    if (parseInt(pokemon.id) < parseInt('900')) {
        pokemon.image = strings.pokemonPicture + `${pokemon.id.padStart(3, '0')}.png`;
    } else {
        return null;
    }
    return pokemon;
};

export { parsePokemon };
