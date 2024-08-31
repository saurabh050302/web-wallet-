import React from 'react';
import { generateMnemonic } from '../utils/mnemonicUtils';
import MnemonicDisplay from './MnemonicDisplay';
import MnemonicActions from './MnemonicActions';

function MnemonicSection({ mnemonic, setMnemonic, setWallets }) {
    const handleGenerateMnemonic = () => {
        const newMnemonic = generateMnemonic();
        setMnemonic(newMnemonic);
        setWallets({ "SOL": [], "ETH": [] });
    };

    return (
        <div className='w-3/4 flex flex-col justify-center items-center gap-4'>
            <MnemonicDisplay mnemonic={mnemonic} setMnemonic={setMnemonic} />
            <MnemonicActions mnemonic={mnemonic} onGenerateMnemonic={handleGenerateMnemonic} />
        </div>
    );
}

export default MnemonicSection;