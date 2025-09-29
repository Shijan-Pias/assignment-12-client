import React from 'react';
import image from '../../assets/logo.jpg'

const FirstLogo = () => {
    return (
        <div>
            <img src={image} className='w-14 h-12 rounded-xl' alt="" />
                <a className="text-xl">PharmaHub</a>
        </div>
    );
};

export default FirstLogo;