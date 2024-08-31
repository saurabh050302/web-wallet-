import React from 'react';
import WalletList from './WalletList';
import { generateWallet } from '../utils/walletUtils';
import Button from './Button';
import toast from 'react-hot-toast';

function WalletSection({ mnemonic, wallets, setWallets, selectedChain }) {
    const handleGenerateWallet = () => {
        try {
            const newWallet = generateWallet(mnemonic, selectedChain, wallets[selectedChain].length);
            setWallets(prevWallets => ({
                ...prevWallets,
                [selectedChain]: [...prevWallets[selectedChain], newWallet]
            }));
            toast.success(`${selectedChain} Wallet added!`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='w-3/4 flex flex-col justify-center items-center gap-4'>
            <h1 className='text-3xl font-semibold tracking-wider'>Your {selectedChain} Wallets</h1>
            <WalletList wallets={wallets[selectedChain]} selectedChain={selectedChain} />
            <Button onClick={handleGenerateWallet}>Add Wallet +</Button>
        </div>
    );
}

export default WalletSection;