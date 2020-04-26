import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

export function PokemonCard({ pokemon }) {
    return (
        <div className='card mx-auto'>
            <div className='col-4 text-center'>
                <img src={pokemon.image} width='60' className='py-2' alt='...' />
            </div>
            <div className='col-6 text-dark text-capitalize py-3'>
                <p className='card-number m-0'>#{String(pokemon.id).padStart(3, '0')}</p>
                <p className='card-text'>{pokemon.name}</p>
            </div>
            <div className='col-2 text-center py-4'>
                <FiChevronRight />
            </div>
        </div>
    );
}
