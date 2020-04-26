import React, { useEffect, useState } from 'react';
import { Collapse, ProgressBar } from 'react-bootstrap';
import { FiChevronLeft } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import { Loading, PokemonCard, Template } from '../components';
import { strings } from '../config/strings';
import { parsePokemon } from '../config/utils';
import * as PokemonService from '../services/PokemonService';
import ScrollableAnchor, { goToAnchor } from 'react-scrollable-anchor';

export default function Pokemon() {
    const ABILITY_INITIAL_STATE = {
        effect_entries: [],
        flavor_text_entries: [],
        generation: {},
        names: [],
        pokemon: [],
    };

    const { id } = useParams();
    const [pokemon, setPokemon] = useState({ types: [], species: {}, abilities: [], stats: [] });
    const [ability, setAbility] = useState(ABILITY_INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [loadingCollapse, setLoadingCollapse] = useState(false);
    const [collapse, setCollapse] = useState(false);

    useEffect(() => {
        loadPokemon();
    }, []);

    const loadPokemon = async (pokemonId = id) => {
        try {
            setLoading(true);
            const { status, data } = await PokemonService.pokemon(pokemonId);
            if (status === 200) {
                // seta o titulo com o nome do pokemon
                document.title = `${String(data.name).toUpperCase()} :: ${strings.labels.title}`;

                data.stats.map((stat, index) => {
                    data.stats.total = index === 0 ? 0 : data.stats.total;
                    data.stats.total = stat.base_stat + data.stats.total;
                });
                setPokemon(data);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    const loadAbillity = async (ability) => {
        try {
            setCollapse(true);
            setLoadingCollapse(true);
            const { status, data } = await PokemonService.ability(ability);
            if (status === 200) {
                let flavors = data.flavor_text_entries.filter((flavor) => flavor.language.name === strings.language);
                let pokemons = data.pokemon.filter((pokemon) => {
                    let poke = parsePokemon(pokemon.pokemon);
                    pokemon = poke;
                    return pokemon ? true : false;
                });
                data.flavor_text_entries = flavors;
                data.pokemon = pokemons;
                setAbility(data);
            }
            setLoadingCollapse(false);
        } catch (e) {
            setLoadingCollapse(false);
            console.log(e);
        }
        goToAnchor('ability');
    };

    const onLoadNewPokemon = async (id) => {
        setCollapse(false);
        await setAbility(ABILITY_INITIAL_STATE);
        loadPokemon(id);
    };

    return (
        <Template>
            {!loading ? (
                <div className='row'>
                    <div className='col-12 bg-white py-3 rounded-bottom shadow mb-4'>
                        <Link to='/' className='btn btn-outline-muted'>
                            <FiChevronLeft className='mr-2' /> Voltar
                        </Link>
                    </div>
                    <div className={'col-md-6 col-lg-4'}>
                        <img
                            src={strings.pokemonPicture + `${String(pokemon.id).padStart(3, '0')}.png`}
                            className='col-12 poke-image'
                            alt='...'
                        />
                    </div>
                    <div className={'col-md-6 col-lg-4 text-weight-bold'}>
                        <p className='poke-number m-0'>#{String(pokemon.id).padStart(3, '0')}</p>
                        <p className='poke-name'>{pokemon.name}</p>
                        {pokemon.types.map((type, index) => (
                            <img
                                key={index}
                                src={require(`../assets/images/types/${type.type.name}@2x.png`)}
                                alt={type.type.name}
                                width='130'
                                alt='type.type.name'
                                className='pr-2 poke-type'
                            />
                        ))}

                        <h5 className='text-secondary pt-4 pb-2'>{strings.labels.characteristics}</h5>
                        <span className='text-muted'>{strings.labels.base_experience}: </span>
                        <span className='text-primary'>{' ' + pokemon.base_experience}</span>
                        <hr />
                        <span className='text-muted'>{strings.labels.height}:</span>
                        <span className='text-primary'>{' ' + parseFloat(pokemon.height / 10).toFixed(1)} m</span>
                        <hr />
                        <span className='text-muted'>{strings.labels.weight}:</span>
                        <span className='text-primary'>{' ' + parseFloat(pokemon.weight / 10).toFixed(1)} kg</span>
                        <hr />
                        <span className='text-muted'>{strings.labels.abilities}:</span>
                        <br />
                        {pokemon.abilities.map((ability, index) => (
                            <p
                                key={index}
                                className='text-primary chip m-0 mt-2 mr-2'
                                onClick={() => loadAbillity(ability.ability.name)}
                                aria-controls='ability-collapse'
                                aria-expanded={collapse}>
                                {' ' + ability.ability.name}{' '}
                                <small className='text-muted'>{ability.is_hidden ? '(hidden)' : null}</small>
                            </p>
                        ))}
                    </div>
                    <div className='col-md-12 col-lg-4 pt-lg-5'>
                        <h5 className='text-secondary pt-4 pb-2'>Stats</h5>
                        {pokemon.stats.map((stat, index) => (
                            <div key={index} className='text-primary m-0'>
                                <span className='text-uppercase'>{stat.stat.name}</span>
                                <span className='text-muted float-right'>{stat.base_stat}</span>
                                <ProgressBar
                                    variant='success'
                                    animated
                                    now={stat.base_stat}
                                    max={255}
                                    className='mb-2'
                                />
                            </div>
                        ))}
                        <span className='text-uppercase'>TOTAL</span>
                        <span className='text-secondary float-right'>{pokemon.stats.total}</span>
                    </div>
                    <div className='col-12'>
                        <ScrollableAnchor id={'ability'}>
                            <Collapse in={collapse} className='py-3'>
                                <div key={0} id='ability-collapse'>
                                    {loadingCollapse ? (
                                        <Loading />
                                    ) : (
                                        <div className='row col-12'>
                                            <div className='col-md-6'>
                                                {/* Effects */}
                                                <h5 className='text-secondary pt-4 pb-2'>
                                                    {strings.labels.effect_entries}
                                                </h5>
                                                {ability.effect_entries.map((effect, index) => (
                                                    <p key={index} className='text-primary'>
                                                        {effect.language.name === strings.language
                                                            ? effect.effect
                                                            : null}
                                                    </p>
                                                ))}
                                                {/* Generation */}
                                                <h5 className='text-secondary pt-4 pb-2'>
                                                    {strings.labels.generation}
                                                </h5>
                                                <p className='text-primary text-uppercase'>
                                                    {String(ability.generation.name).replace('-', ' ')}
                                                </p>
                                                {/* Other Languages */}
                                                <h5 className='text-secondary pt-4 pb-2'>
                                                    {strings.labels.other_languages}
                                                </h5>
                                                {ability.names.map((language, index) => (
                                                    <p key={index} className='text-primary'>
                                                        <span className='text-muted'>{language.language.name}: </span>
                                                        {language.name}
                                                    </p>
                                                ))}
                                            </div>
                                            <div className='col-md-6'>
                                                {/* Flavors */}
                                                <h5 className='text-secondary pt-4 pb-2'>
                                                    {strings.labels.flavor_entries}
                                                </h5>
                                                {ability.flavor_text_entries.map((flavor, index) => (
                                                    <div key={index} className='text-primary'>
                                                        <span className='text-muted'>
                                                            {flavor.version_group.name}:{' '}
                                                        </span>
                                                        {flavor.flavor_text}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='col-12'>
                                                {/* Pokemons */}
                                                <h5 className='text-secondary pt-4 pb-2'>
                                                    {strings.labels.other_pokemons + ability.name}
                                                </h5>
                                                <div className='row'>
                                                    {ability.pokemon.map((pokemon, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => onLoadNewPokemon(pokemon.pokemon.id)}
                                                            className='col-md-4'>
                                                            <PokemonCard pokemon={pokemon.pokemon} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Collapse>
                        </ScrollableAnchor>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </Template>
    );
}
