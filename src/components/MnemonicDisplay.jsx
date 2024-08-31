import React from 'react';

function MnemonicDisplay({ mnemonic, setMnemonic }) {
    return (
        <textarea
            className='h-10 w-3/4 bg-zinc-800 text-white rounded-md outline-none px-2 py-1 resize-none text-xl text-center blur-sm hover:blur-none'
            placeholder='Paste or generate mnemonic'
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
        />
    );
}

export default MnemonicDisplay;