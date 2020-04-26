import React from 'react';
import logo from '../assets/images/logo.svg';
import grassBackground from '../assets/images/bg-grass.png';

export function Template({ children }) {
    return (
        <div className='row p-0 m-0'>
            <div className='col-12 text-center bg-grass py-5' style={{ backgroundImage: `url(${grassBackground})` }}>
                <img src={logo} width='250' className='py-2 pb-5' alt='...' />
            </div>
            <div className='container card-body'>{children}</div>
        </div>
    );
}
