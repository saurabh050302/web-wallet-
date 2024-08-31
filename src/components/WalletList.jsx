import React from 'react';
import WalletItem from './WalletItem';

function WalletList({ wallets, selectedChain }) {
    return (
        <>
            {wallets.map((wallet, index) => (
                <WalletItem key={index} wallet={wallet} selectedChain={selectedChain} />
            ))}
        </>
    );
}

export default WalletList;