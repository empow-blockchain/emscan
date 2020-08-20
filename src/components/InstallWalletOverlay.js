import React from 'react';
import ChromeLogo from '../assets/images/chrome-logo.svg'

const InstallWalletOverlay = props => {
    return (
        <div className="install-wallet-overlay">
            <p className="title">To use all tool of the wallet. Please install Empow Wallet Extension into your browser</p>
            <a className="btn btn-install-wallet" href="https://chrome.google.com/webstore/detail/bglmfiihjjbjolgjpflcdklccdlcidgn" target="_blank" rel="noopener noreferrer"><img src={ChromeLogo} alt="ChromeLogo"></img>Install Wallet Extension</a>
            <p className="note">*Note: If you are creating a wallet for the first time, transfer some EM to activate your wallet</p>
        </div>
    );
};

export default InstallWalletOverlay;