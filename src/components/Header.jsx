import React from 'react';
import deerLogo from '../assets/deer.svg';
import githubLogo from '../assets/github.svg';
import ChainSelector from './ChainSelector';

function Header({ selectedChain, onChainChange }) {
    return (
        <div className='flex justify-between items-center w-full'>
            <a href="https://github.com/saurabh050302/web-wallet-" target='/'>
                <img src={githubLogo} className='w-12 h-12' alt="GitHub" />
            </a>
            <div className='flex justify-center items-center gap-4'>
                <img src={deerLogo} className="w-14 h-14" alt="Deer Logo" />
                <h1 className='text-3xl font-semibold tracking-wide'>Web Wallet</h1>
            </div>
            <ChainSelector selectedChain={selectedChain} onChainChange={onChainChange} />
        </div>
    );
}

export default Header;