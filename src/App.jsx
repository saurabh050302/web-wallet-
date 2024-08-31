import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import MnemonicSection from './components/MnemonicSection';
import WalletSection from './components/WalletSection';

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState({ "SOL": [], "ETH": [] });
  const [selectedChain, setSelectedChain] = useState("SOL");

  return (
    <div className='w-full min-h-screen bg-zinc-900 text-white p-10 flex flex-col items-center gap-10'>
      <Toaster position='bottom-center' toastOptions={{ className: 'bg-zinc-800 text-white rounded-sm' }} />
      <Header selectedChain={selectedChain} onChainChange={setSelectedChain} />
      <MnemonicSection mnemonic={mnemonic} setMnemonic={setMnemonic} setWallets={setWallets} />
      <WalletSection
        mnemonic={mnemonic}
        wallets={wallets}
        setWallets={setWallets}
        selectedChain={selectedChain}
      />
    </div>
  );
}

export default App;