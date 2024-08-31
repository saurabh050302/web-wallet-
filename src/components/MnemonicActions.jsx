import React from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';
import Button from './Button';

function MnemonicActions({ mnemonic, onGenerateMnemonic }) {
    return (
        <div className='flex justify-center items-center gap-4'>
            <Button onClick={onGenerateMnemonic}>Generate Mnemonic</Button>
            <Button onClick={() => copyToClipboard(mnemonic, "Mnemonic copied!")}>Copy Mnemonic</Button>
        </div>
    );
}

export default MnemonicActions;