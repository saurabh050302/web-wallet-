import { useState } from 'react'
import deerLogo from './assets/deer.svg'

import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";


function App() {

  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);

  const handleGenerateMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setWallets([]);
  }

  const handleGenerateWallet = () => {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/${501}'/${wallets.length}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const kp = Keypair.fromSecretKey(secret);
    const wallet = {
      publicKey: kp.publicKey.toBase58(),
      secretKey: kp.secretKey.toString('hex')
    }
    setWallets([...wallets, wallet])
  }

  return (
    <div className=' w-full min-h-screen bg-zinc-800 text-white p-10 flex flex-col gap-10'>
      <div className='flex justify-between items-center'>
        <div>Github</div>
        <div className=' flex justify-center items-center gap-4'>
          <img src={deerLogo} className=" w-14 h-14" />
          <h1 className='text-3xl font-semibold tracking-wide'>Web Wallet</h1>
        </div>
        <div>ETH/SOL</div>
      </div>

      <div className='flex flex-col justify-center items-center gap-4'>
        <textarea
          className=' h-10 w-3/4 bg-zinc-600 rounded-md outline-none px-2 py-1 resize-none text-xl text-center'
          placeholder='Paste or generate mnemonic'
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <div className=' flex justify-center items-center gap-4'>
          <button
            className=' bg-zinc-700 hover:bg-zinc-500 px-3 py-2 rounded-sm'
            onClick={handleGenerateMnemonic}
          >Generate Mnemonic</button>
          <button className=' bg-zinc-700 hover:bg-zinc-500 px-3 py-2 rounded-sm'>Copy </button>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-4'>
        <h1 className=' text-3xl font-semibold tracking-wider'>Your Wallets</h1>

        {wallets.map((wallet, index) => (
          <div
            key={index}
            className='w-3/4 flex justify-between bg-zinc-600 rounded-md'>
            <p className=' font-bold bg-zinc-700 px-3 py-2 rounded-l-md'>{index}</p>
            <p className=' p-2'>Public Address : {wallet.publicKey}</p>
            {/* <p>Private Key : {wallet.secretKey}</p> */}
            <p className=' font-bold self-end bg-zinc-700 px-3 py-2 rounded-r-md'>Balance</p>
          </div>
        )
        )}
        <button
          className=' bg-zinc-700 hover:bg-zinc-500 px-3 py-2 rounded-sm'
          onClick={handleGenerateWallet}
        // disabled={mnemonic == ""}
        >Add Wallet +</button>
      </div>


    </div>
  )
}

export default App
