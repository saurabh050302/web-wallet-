import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import deerLogo from './assets/deer.svg'
import githubLogo from './assets/github.svg'
import copyIcon from './assets/copy.svg'

import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Wallet, HDNodeWallet } from "ethers";

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
      let newWallet;

      if (selectedChain == "SOL") {
        const path = `m/44'/501'/${wallets.SOL.length}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const kp = Keypair.fromSecretKey(secret);
        newWallet = {
          path,
          publicKey: kp.publicKey.toBase58(),
          secretKey: kp.secretKey.toString('hex')
        }
        setWallets({ ...wallets, SOL: [...wallets.SOL, newWallet] });

      } else if (selectedChain == "ETH") {
        const path = `m/44'/60'/${wallets.ETH.length}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(path);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        newWallet = {
          path,
          publicKey: wallet.address,
          secretKey: wallet.privateKey
        }
        setWallets({ ...wallets, ETH: [...wallets.ETH, newWallet] });
      } else {
        throw new Error("Unsupported Network!");
      }

      setWalletsArray([...walletsArray, newWallet]);
      toast.success(`${selectedChain} Wallet added!`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchBalance = async (address) => {
    try {
      if (selectedChain != "SOL" && selectedChain != "ETH") throw new Error("Unsupported Network!")

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 1,
        "method": selectedChain == "SOL" ? "getBalance" : "eth_getBalance",
        "params": selectedChain == "SOL" ? [address] : [address, "latest"]
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const URL_BASE = selectedChain == "SOL" ? "solana-devnet" : "eth-sepolia";

      const res = await fetch(`https://${URL_BASE}.g.alchemy.com/v2/DiYXA3ASAHJzyAoRKhsz72a98EYYwSTU`, requestOptions);
      if (!res.ok) throw new Error("Server Error!");
      const result = await res.json();
      const balance = selectedChain == "SOL" ? result.result.value / 1000000000 : Number(result.result) / 1000000000000000000;
      // console.log(result.result.value); // SOL json
      // console.log(Number(result.result)); // ETH json
      // console.log(balance.toFixed(4)); // to control decimals

      toast.success(`Balance : ${balance.toFixed(4)} ${selectedChain}`);
    } catch (error) {
      toast.error(error.message);
    }

  };

  return (
    <div className=' w-full min-h-screen bg-zinc-900 text-white p-10 flex flex-col items-center gap-10'>
      <Toaster position='bottom-center' toastOptions={{ className: 'bg-zinc-800 text-white rounded-sm' }} />

      <div className='flex justify-between items-center w-full'>
        <a href="https://github.com/saurabh050302/web-wallet-" target='/'>
          <img src={githubLogo} className=' w-12 h-12' />
        </a>
        <div className=' flex justify-center items-center gap-4'>
          <img src={deerLogo} className=" w-14 h-14" />
          <h1 className='text-3xl font-semibold tracking-wide'>Web Wallet</h1>
        </div>
        <select value={selectedChain} onChange={handleChainChange} className=' p-2 outline-none bg-zinc-800 rounded-md'>
          <option value="SOL">SOL (Devnet)</option>
          <option value="ETH">ETH (Sepolia)</option>
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
                className=' px-3 py-2 font-bold rounded-l-md hover:bg-zinc-600'
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
              className=' px-3 py-2 hover:bg-zinc-600 rounded-r-md'
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
