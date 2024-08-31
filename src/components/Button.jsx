import React from 'react';

function Button({ onClick, children }) {
    return (
        <button
            className='bg-zinc-800 hover:bg-zinc-600 px-3 py-2 rounded-sm'
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;