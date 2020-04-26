import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';
import { Loading, PokemonCard, Template } from '../components';
import { strings } from '../config/strings';
import * as PokemonService from '../services/PokemonService';
import { parsePokemon } from '../config/utils';

export default function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState(1);
    const [more, setMore] = useState(true);

    useEffect(() => {
        document.title = `Home :: ${strings.labels.title}`;

        loadTypes();
        loadPokemons();
    }, []);

    const loadPokemons = async (offset = 0) => {
        try {
            setLoading(true);
            const { status, data } = await PokemonService.pokemons(offset);
            if (status === 200) {
                let list = [];
                list = data.results.filter((pokemon) => {
                    pokemon = parsePokemon(pokemon);
                    return pokemon ? true : false;
                });
                setPokemons(offset === 0 ? list : [...pokemons, ...list]);
                setTotal(data.count);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    const loadTypes = async () => {
        try {
            setLoading(true);
            const { status, data } = await PokemonService.types();
            if (status === 200) {
                let list = data.results.filter((type) => type.name !== 'unknown' && type.name !== 'shadow');
                setTypes(list);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    const loadPokemonsByTypes = async (url) => {
        try {
            setMore(false);
            setLoading(true);
            let typeId = url.split('type')[1].replace(/\//g, '');
            const { status, data } = await PokemonService.pokemonsByType(typeId);
            if (status === 200) {
                let list = [];
                data.pokemon.map((elem) => {
                    let poke = parsePokemon(elem.pokemon);
                    if (!!poke) {
                        list.push(poke);
                    }
                });
                setPokemons(list);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    const onScroll = () => {
        if (pokemons.length < total && more) {
            loadPokemons(pokemons.length);
        } else {
            setMore(false);
        }
    };

    const onClear = async () => {
        await setPokemons([]);
        setMore(true);
        loadPokemons();
    };

    return (
        <div>
            <Template>
                <div className='col-12 bg-white py-3 rounded-bottom shadow mb-4 text-center'>
                    <h5 className='text-muted text-weight-bold mb-3'>{strings.labels.filter}</h5>
                    {types.map((type, index) => (
                        <img
                            key={index}
                            onClick={() => loadPokemonsByTypes(type.url)}
                            src={require(`../assets/images/types/${type.name}@2x.png`)}
                            width='130'
                            alt={type.name}
                            className='pr-2 py-2 poke-type'
                        />
                    ))}

                    <button className='btn btn-link-danger text-danger' onClick={onClear}>
                        Clear filter
                    </button>
                </div>
                <InfiniteScroll
                    className='row'
                    pageStart={0}
                    loadMore={!loading ? onScroll : () => {}}
                    hasMore={more}
                    loader={<Loading key={0} />}>
                    {pokemons.map((pokemon) => (
                        <div key={pokemon.id} className='col-md-4'>
                            <Link to={`/pokemon/${pokemon.id}`} className='text-decoration-none'>
                                <PokemonCard pokemon={pokemon} />
                            </Link>
                        </div>
                    ))}
                </InfiniteScroll>
            </Template>
        </div>
    );
}
