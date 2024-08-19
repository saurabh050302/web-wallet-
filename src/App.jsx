import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import deerLogo from './assets/deer.svg'
import githubLogo from './assets/github.svg'
import copyIcon from './assets/copy.svg'

import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

function App() {

  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState({ "SOL": [], "ETH": [] });
  const [walletsArray, setWalletsArray] = useState([]);
  const [selectedChain, setSelectedChain] = useState("SOL");

  const handleGenerateMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setWallets({ "SOL": [], "ETH": [] });
    setWalletsArray([]);
    toast.success("New Mnemonic Created!")
  }

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
    const newWalletsArray = e.target.value == "SOL" ? wallets.SOL : wallets.ETH;
    setWalletsArray(newWalletsArray);
  }

  const handleGenerateWallet = () => {
    try {
      if (mnemonic.split(" ").length != 12) throw new Error("Invalid Mnemonic")
      const seed = mnemonicToSeedSync(mnemonic);

      if (selectedChain == "SOL") {
        const path = `m/44'/501'/${wallets.SOL.length}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const kp = Keypair.fromSecretKey(secret);
        const newWallet = {
          path,
          publicKey: kp.publicKey.toBase58(),
          secretKey: kp.secretKey.toString('hex')
        }
        setWalletsArray([...walletsArray, newWallet]);
        setWallets({ ...wallets, SOL: [...wallets.SOL, newWallet] });

      } else if (selectedChain == "ETH") {
        const path = `m/44'/60'/${wallets.ETH.length}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const kp = Keypair.fromSecretKey(secret);
        const newWallet = {
          path,
          publicKey: kp.publicKey.toString("hex"),
          secretKey: kp.secretKey.toString('hex')
        }
        setWalletsArray([...walletsArray, newWallet]);
        setWallets({ ...wallets, ETH: [...wallets.SOL, newWallet] });


      } else {
        throw new Error("Unsupported Network!");
      }
      toast.success(`${selectedChain} Wallet added!`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchBalance = async (address) => {
    console.log("fetch balance");

    // try {
    //   const response = await fetch('https://api.devnet.solana.com', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       jsonrpc: '2.0',
    //       id: 1,
    //       method: 'getBalance',
    //       params: [address, { "encoding": "base58" }]
    //     }),
    //   });
    //   if (response.ok) {
    //     const data = await response.json();
    // toast.success(`Balance : ${data.result.value / 1000000000} ${selectedChain}`);
    //   }
    // } catch (error) {
    //   toast.error(error.message)
    // }
  };

  return (
    <div className=' w-full min-h-screen bg-zinc-900 text-white p-10 flex flex-col items-center gap-10'>
      <Toaster position='bottom-center' toastOptions={{ className: 'bg-zinc-800 text-white ' }} />

      <div className='flex justify-between items-center w-full'>
        <a href="https://github.com/saurabh050302/web-wallet-" target='/'>
          <img src={githubLogo} className=' w-12 h-12' />
        </a>
        <div className=' flex justify-center items-center gap-4'>
          <img src={deerLogo} className=" w-14 h-14" />
          <h1 className='text-3xl font-semibold tracking-wide'>Web Wallet</h1>
        </div>
        <select value={selectedChain} onChange={handleChainChange} className=' p-2 outline-none bg-zinc-800 rounded-md'>
          <option value="SOL">SOL</option>
          <option value="ETH">ETH</option>
        </select>

      </div>

      <div className=' w-3/4 flex flex-col justify-center items-center gap-4'>
        <textarea
          className='h-10 w-3/4 bg-zinc-800 text-white rounded-md outline-none px-2 py-1 resize-none text-xl text-center blur-sm hover:blur-none'
          placeholder='Paste or generate mnemonic'
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <div className=' flex justify-center items-center gap-4'>
          <button
            className=' bg-zinc-800 hover:bg-zinc-600 px-3 py-2 rounded-sm'
            onClick={handleGenerateMnemonic}
          >Generate Mnemonic</button>
          <button
            className=' bg-zinc-800 hover:bg-zinc-600 px-3 py-2 rounded-sm'
            onClick={() => { navigator.clipboard.writeText(mnemonic), toast.success("Mnemonic copied!") }}
          >Copy Mnemonic</button>
        </div>
      </div>

      <div className=' w-3/4 flex flex-col justify-center items-center gap-4'>
        <h1 className=' text-3xl font-semibold tracking-wider'>Your {selectedChain} Wallets</h1>

        {walletsArray.map((wallet, index) => (
          <div key={index} className='flex w-3/4 justify-between bg-zinc-800 gap-4 rounded-md'>
            <div className='flex'>
              <button
                className=' px-3 py-2 bg-zinc-800 font-bold rounded-l-md hover:bg-zinc-600'
                onClick={() => { navigator.clipboard.writeText(wallet.publicKey), toast.success("Address copied!") }}
              >
                <img src={copyIcon} className=' w-8 h-8' />
              </button>
              <div className=' p-2 bg-zinc-800'>
                <p>Public Address : {wallet.publicKey}</p>
                <p>Path : {wallet.path}</p>
              </div>
            </div>
            <button
              className=' px-3 py-2 bg-zinc-800 hover:bg-zinc-600 rounded-r-md'
              onClick={() => fetchBalance(wallet.publicKey)}
            >Check Balance</button>
          </div>
        )
        )}

        <button
          className=' bg-zinc-800 hover:bg-zinc-600 px-3 py-2 rounded-sm'
          onClick={handleGenerateWallet}
        >Add Wallet +</button>
      </div>

    </div >
  )
}

export default App
