import { generateMnemonic as bip39GenerateMnemonic } from "bip39";

export function generateMnemonic() {
    return bip39GenerateMnemonic();
}