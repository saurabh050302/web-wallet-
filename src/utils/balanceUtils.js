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

        toast.success(`Balance : ${balance.toFixed(4)} ${chain}`);
    } catch (error) {
        toast.error(error.message);
    }
}