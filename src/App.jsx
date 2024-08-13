import { useState } from 'react'
import deerLogo from './assets/deer.svg'
import githubLogo from './assets/github.svg'
import copyIcon from './assets/copy.svg'

import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";


function App() {

  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);

  const [selectedCoin, setSelectedCoin] = useState(60);
  const handleChange = (e) => {
    setSelectedCoin(e.target.value);
  };

  const handleGenerateMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setWallets([]);
  }

  const handleGenerateWallet = () => {
    if (mnemonic.split(" ").length != 12) throw new Error("Invalid Mnemonic")
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/${selectedCoin}'/${wallets.length}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const kp = Keypair.fromSecretKey(secret);
    const wallet = {
      selectedCoin,
      path,
      publicKey: kp.publicKey.toBase58(),
      secretKey: kp.secretKey.toString('hex')
    }
    setWallets([...wallets, wallet])
  }

  return (
    <div className=' w-full min-h-screen bg-zinc-800 text-white p-10 flex flex-col gap-10'>
      <div className='flex justify-between items-center'>
        <div>
          <a href="https://github.com/saurabh050302/web-wallet-" target='/'>
            <img src={githubLogo} className=' w-12 h-12' />
          </a>
        </div>
        <div className=' flex justify-center items-center gap-4'>
          <img src={deerLogo} className=" w-14 h-14" />
          <h1 className='text-3xl font-semibold tracking-wide'>Web Wallet</h1>
        </div>
        <select
          value={selectedCoin}
          onChange={handleChange}
          className=' bg-zinc-700 p-2 rounded-md outline-none'>
          <option value={60}>ETH</option>
          <option value={501}>SOL</option>
          <option value={0}>BTC</option>
        </select>
      </div>

      <div className='flex flex-col justify-center items-center gap-4'>
        <textarea
          className={`h-10 w-3/4 bg-zinc-600 rounded-md outline-none px-2 py-1 resize-none text-xl text-center ${mnemonic.split(" ").length == 12 && "blur-sm"} hover:blur-none`}
          placeholder='Paste or generate mnemonic'
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <div className=' flex justify-center items-center gap-4'>
          <button
            className=' bg-zinc-700 hover:bg-zinc-500 px-3 py-2 rounded-sm'
            onClick={handleGenerateMnemonic}
          >Generate Mnemonic</button>
          <button
            className=' bg-zinc-700 hover:bg-zinc-500 px-3 py-2 rounded-sm'
            onClick={() => { navigator.clipboard.writeText(mnemonic) }}
          >Copy Mnemonic</button>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-4'>
        <h1 className=' text-3xl font-semibold tracking-wider'>Your {selectedCoin == 0 ? "BTC" : selectedCoin == 60 ? "ETH" : "SOL"} Wallets</h1>

        {wallets.map((wallet, index) => (
          wallet.selectedCoin == selectedCoin &&
          <div key={index} className='flex w-3/4 justify-between bg-zinc-600 gap-4 rounded-md'>
            <div className='flex'>
              <button
                className=' px-3 py-2 bg-zinc-700 font-bold rounded-l-md'
                onClick={() => { navigator.clipboard.writeText(wallet.publicKey) }}
              >
                <img src={copyIcon} className=' w-8 ' />
              </button>
              <div className=' p-2 bg-zinc-600'>
                <p>Public Address : {wallet.publicKey}</p>
                <p>Path : {wallet.path}</p>
              </div>
            </div>
            {/* <button
              className=' px-3 py-2 bg-zinc-700 hover:bg-zinc-500 rounded-r-md'
            >Check Balance</button> */}
          </div>
        )
        )}

        <button
          className=' bg-zinc-700 hover:bg-zinc-500 px-3 py-2 rounded-sm'
          onClick={handleGenerateWallet}
        >Add Wallet +</button>
      </div>

    </div >
  )
}

export default App
