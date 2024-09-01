import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "./AnimatedModal"
import Button from './Button';
import { fetchBalance, fetchSolanaTokens } from '../utils/balanceUtils';
import { copyToClipboard } from '../utils/clipboardUtils';


const WalletModal = ({ wallet, selectedChain }) => {
    const [balance, setBalance] = useState(0);
    const [tokens, setTokens] = useState({});

    return (
        <Modal>
            < ModalTrigger
                address={wallet.publicKey}
                selectedChain={selectedChain}
                setBalance={setBalance}
                setTokens={setTokens}
                className="hover:bg-zinc-600 flex justify-center items-center group/modal-btn" >
                <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                    Check Details
                </span>
                <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                    🧐
                </div>
            </ModalTrigger >

            <ModalBody
                setTokens={setTokens}
            >
                <ModalContent>
                    ACCOUNT DETAILS
                    <div className=' my-2 px-3 break-all py-2 rounded-md bg-zinc-800'>
                        <p>Public Key : {wallet.publicKey}</p>
                        <p>Path : {wallet.path}</p>
                    </div>
                    BALANCE
                    <div className=' my-2 px-3 py-2 rounded-md bg-zinc-800'>
                        Account Balance : {balance + " " + selectedChain}
                    </div>
                    {selectedChain == "SOL" && "TOKENS"}
                    {tokens && Object.keys(tokens).map((key, index) => {
                        return (
                            <div key={index} className=' my-2 px-3 py-2 rounded-md bg-zinc-800 flex justify-between'>
                                <p>{key}</p>
                                <p>{tokens[key]}</p>
                            </div>
                        )
                    })}
                </ModalContent>

                <ModalFooter className={"gap-2 bg-zinc-950"}>
                    <Button onClick={() => copyToClipboard(`${wallet.publicKey}`, "Public Key copied!")}>
                        Copy Wallet Address
                    </Button>
                    <Button onClick={() => copyToClipboard(`[${wallet.secretKey}]`, "Private Key copied!")}>
                        Export Private Key
                    </Button>
                    {/* <Button">
                        Delete Wallet
                    </Button> */}
                </ModalFooter>
            </ModalBody>
        </Modal >
    )
}

export default WalletModal