import React, { useEffect, useState } from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';
import copyIcon from '../assets/copy.svg';
import WalletModal from './WalletModal';


function WalletItem({ wallet, selectedChain }) {
    return (
        <div className='flex w-3/4 justify-between bg-zinc-800 gap-4 rounded-md'>
            <div className='flex gap-2 items-center'>
                <button
                    className='px-3 py-2 flex font-bold rounded-l-md hover:bg-zinc-600'
                    onClick={() => copyToClipboard(wallet.publicKey, "Address copied!")}
                >
                    <img src={copyIcon} className='w-8 h-8' alt="Copy" />
                </button>
                <p>{wallet.publicKey}</p>
            </div>
            <WalletModal wallet={wallet} selectedChain={selectedChain} />
        </div >
    );
}

export default WalletItem;