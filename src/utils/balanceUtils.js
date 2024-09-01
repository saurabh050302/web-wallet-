import toast from 'react-hot-toast';

export async function fetchBalance(address, chain) {
    try {
        if (chain !== "SOL" && chain !== "ETH") throw new Error("Unsupported Network!");

        const requestBody = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": chain === "SOL" ? "getBalance" : "eth_getBalance",
            "params": chain === "SOL" ? [address] : [address, "latest"]
        };

        const URL_BASE = chain === "SOL" ? "solana-devnet" : "eth-sepolia";
        const response = await fetch(`https://${URL_BASE}.g.alchemy.com/v2/DiYXA3ASAHJzyAoRKhsz72a98EYYwSTU`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error("Server Error!");
        const result = await response.json();
        const balance = chain === "SOL"
            ? result.result.value / 1000000000
            : Number(result.result) / 1000000000000000000;

        return balance.toFixed(4);
    } catch (error) {
        toast.error(error.message);
    }
}

import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export async function fetchSolanaTokens(address) {

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const tokenAccounts = await connection.getTokenAccountsByOwner(
        new PublicKey(address),
        {
            programId: TOKEN_PROGRAM_ID,
        }
    );

    console.log(tokenAccounts);

    let tokens = {};
    tokenAccounts.value.forEach((tokenAccount) => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);
        tokens[new PublicKey(accountData.mint)] = (parseInt(accountData.amount) / 1000000000).toFixed(2);
    })

    return (tokens);

}