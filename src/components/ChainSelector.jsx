import React from 'react';

function ChainSelector({ selectedChain, onChainChange }) {
    return (
        <select
            value={selectedChain}
            onChange={(e) => onChainChange(e.target.value)}
            className='p-2 outline-none bg-zinc-800 rounded-md'
        >
            <option value="SOL">SOL (Devnet)</option>
            <option value="ETH">ETH (Sepolia)</option>
        </select>
    );
}

export default ChainSelector;