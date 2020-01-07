import React, { Component } from 'react'
import { connect } from 'react-redux';
import WalletSidebar from '../components/WalletSidebar'
import Input from '../components/Input'
import { toastr } from 'react-redux-toastr'
import Utils from '../utils/index'
import InstallWalletOverlay from '../components/InstallWalletOverlay';

import ReactFlagsSelect from 'react-flags-select';

class WalletProducer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            to: "",
            amount: 0,
            tokenSelectValue: { value: 'em', label: 'EM (EMPOW)' },
            tokenSelectOptions: [{ value: 'em', label: 'EM (EMPOW)' }],
            memo: "",
            isLoading: false,
            pubkey: "",
            netId: "",
            loc: "US",
            url: "",
        };
    };

    async componentDidMount() {
    }

    async register() {
        this.setState({ isLoading: true })

        const { pubkey,netId,loc,url } = this.state

        const tx = window.empow.callABI("vote_producer.empow", "applyRegister", [this.props.addressInfo.address, pubkey, loc, url, netId, true])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isLoading: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Register Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isLoading: false })
        })
    }

    pickAmount(percent) {
        this.setState({
            amount: this.props.addressInfo.balance * (percent / 100)
        })
    }
    

    render() {

        const { pubkey, netId, loc, url, isLoading } = this.state
        const { addressInfo } = this.props

        return (
            <section id="wallet-producer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <WalletSidebar active="producer"></WalletSidebar>
                        </div>
                        <div className="col-md-9">
                            <div className="card">
                                {!addressInfo && <InstallWalletOverlay></InstallWalletOverlay>}
                                <h3 className="title">Become Producer</h3>
                                <p className="time note">Your wallet must actived (If your wallet just created you must transfer some EM to activate it)</p>
                                <div className="how-to">
                                    <div className="one-step">
                                        <span className="number">1</span>
                                        <div className="content">
                                            <p>Run Full Node</p>
                                            <p><a href="https://github.com/empow-blockchain/go-empow#empow-blockchain---social-network-on-blockchain" target="_blank" rel="noopener noreferrer">How to run full node empow blockchain</a></p>
                                        </div>
                                    </div>
                                    <div className="one-step">
                                        <span className="number">2</span>
                                        <div className="content">
                                            <p>Register Producer</p>
                                            <p>Copy <b>Network Public Key</b> and <b>Network ID</b> to form bellow and Register</p>
                                        </div>
                                    </div>
                                    <div className="one-step">
                                        <span className="number">3</span>
                                        <div className="content">
                                            <p>Contact Our</p>
                                            <p>Contact <a href="https://t.me/empowofficial" target="_blank" rel="noopener noreferrer">Our Telegram</a> if you have any problems</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="register">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Input className="pubkey" title="Network Public Key" placeholder="Paste your Network Public Key" type="text" value={pubkey} onChange={(e) => this.setState({ pubkey: e.target.value })}></Input>
                                            <Input className="url" title="Your Website" placeholder="https://example.com" type="text" value={url} onChange={(e) => this.setState({ url: e.target.value })}></Input>
                                        </div>
                                        <div className="col-md-6">
                                            <Input className="netId" title="Network ID" placeholder="Paste your Network ID" type="text" value={netId} onChange={(e) => this.setState({ netId: e.target.value })}></Input>
                                            <p className="loc">Select location</p>
                                            <ReactFlagsSelect className="select-location" searchable={true} defaultCountry={loc} onSelect={(countryCode) => this.setState({ loc: countryCode })} />
                                        </div>
                                        <button className={`btn btn-color ${isLoading ? "btn-color-loading" : ""}`} onClick={() => this.register()}>Register</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(state => ({
    addressInfo: state.app.addressInfo
}), ({
}))(WalletProducer)