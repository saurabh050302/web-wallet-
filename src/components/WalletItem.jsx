import React from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';
import { fetchBalance } from '../utils/balanceUtils';
import copyIcon from '../assets/copy.svg';

function WalletItem({ wallet, selectedChain }) {
    return (
        <div className='flex w-3/4 justify-between bg-zinc-800 gap-4 rounded-md'>
            <button
                className='px-3 py-2 font-bold rounded-l-md hover:bg-zinc-600'
                onClick={() => copyToClipboard(wallet.publicKey, "Address copied!")}
            >
                <img src={copyIcon} className='w-8 h-8' alt="Copy" />
            </button>
            <div className='px-3 p-2 hover:bg-zinc-600'>
                <p>Public Address: {wallet.publicKey}</p>
                <p>Path: {wallet.path}</p>
            </div>
            <button
                className='px-3 py-2 hover:bg-zinc-600 rounded-r-md'
                onClick={() => fetchBalance(wallet.publicKey, selectedChain)}
            >
                Check Balance
            </button>
        </div>
    );
}

export default WalletItem;