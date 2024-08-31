import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Wallet, HDNodeWallet } from "ethers";
import nacl from "tweetnacl";

export function generateWallet(mnemonic, chain, index) {
    if (mnemonic.split(" ").length !== 12) throw new Error("Invalid Mnemonic");
    const seed = mnemonicToSeedSync(mnemonic);

    if (chain === "SOL") {
        return generateSolanaWallet(seed, index);
    } else if (chain === "ETH") {
        return generateEthereumWallet(seed, index);
    } else {
        throw new Error("Unsupported Network!");
    }
}

function generateSolanaWallet(seed, index) {
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const kp = Keypair.fromSecretKey(secret);
    return {
        path,
        publicKey: kp.publicKey.toBase58(),
        secretKey: kp.secretKey.toString('hex')
    };
}

function generateEthereumWallet(seed, index) {
    const path = `m/44'/60'/${index}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(path);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
    return {
        path,
        publicKey: wallet.address,
        secretKey: wallet.privateKey
    };
}