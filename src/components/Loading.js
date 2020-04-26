import React from 'react';
import pokeLoading from '../assets/images/pokeball_icon.svg';

export function Loading() {
    return (
        <div className='col-12 text-center py-3'>
            <img src={pokeLoading} width='40' className='loading' alt='...' />
        </div>
    );
}